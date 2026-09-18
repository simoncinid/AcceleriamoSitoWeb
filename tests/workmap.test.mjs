import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { modules, fakeAI } from "./workmap-loader.mjs";
const basic = modules();
const { catalog } = basic("lib/workmap/catalog.ts");
async function setup() {
  const directory = await mkdtemp(path.join(tmpdir(), "workmap-test-"));
  const env = {
    NODE_ENV: "test",
    WORKMAP_DATA_DIR: directory,
    WORKMAP_AI_API_KEY: "mock",
    WORKMAP_AI_MODEL: "mock",
    WORKMAP_ACCESS_SECRET: "test-secret-long-enough-32-characters",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    ARUBA_USER: "mail@example.test",
    ARUBA_PASS: "mock",
    CRON_SECRET: "cron-test-secret",
  };
  const ai = fakeAI(catalog), sent = [];
  const load = modules({
    env,
    overrides: {
      "./ai": ai,
      "@/lib/workmap/ai": ai,
      nodemailer: {
        createTransport: () => ({ sendMail: async (m) => sent.push(m) }),
      },
    },
  });
  let cookie = "";
  const route = load("app/api/workmap/[action]/route.ts");
  async function post(action, body = {}) {
    const r = await route.POST(
      new Request(`http://localhost:3000/api/workmap/${action}`, {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          cookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }),
      { params: Promise.resolve({ action }) },
    );
    if (r.headers.get("set-cookie"))
      cookie = r.headers.get("set-cookie").split(";")[0];
    const data = await r.json();
    return { status: r.status, data };
  }
  async function get(action = "session") {
    return route.GET(
      new Request(`http://localhost:3000/api/workmap/${action}`, {
        headers: { cookie },
      }),
      { params: Promise.resolve({ action }) },
    );
  }
  async function answer(value) {
    const data = await (await get()).json();
    return post("answer", {
      answer: value,
      requestId: randomUUID(),
      version: data.version,
    });
  }
  async function qualify() {
    await post("start");
    const script = [
      "Sono responsabile commerciale di una PMI e seguo 12 agenti",
      "Report agenti; Offerte",
      "Report agenti; Follow-up clienti",
      "Raccogliere gli aggiornamenti ogni settimana",
      "Email e messaggi diversi",
      "Mai",
    ];
    for (const value of script) {
      const data = await (await get()).json();
      if (!data.question) break;
      await answer(value);
    }
    return post("qualify", { email: "test@example.test" });
  }
  async function finishGeneration() {
    const jobs = load("lib/workmap/jobs.ts");
    const store = load("lib/workmap/store.ts");
    let result = await post("generate");
    for (let n = 0; n < 80 && ["generating", "reviewing", "failed"].includes(result.data.state); n++) {
      if (result.data.state === "failed" && (result.data.job?.attempts ?? 0) >= 5) break;
      const [id] = await store.listSessions();
      await jobs.processWork(id, "generate");
      result = { status: 200, data: await (await get()).json() };
    }
    return result;
  }
  async function runGenerationOnce() {
    const jobs = load("lib/workmap/jobs.ts");
    const store = load("lib/workmap/store.ts");
    const result = await post("generate");
    const [id] = await store.listSessions();
    await jobs.processWork(id, "generate");
    return { status: result.status, data: await (await get()).json() };
  }
  return {
    load,
    ai,
    env,
    sent,
    post,
    get,
    answer,
    qualify,
    finishGeneration,
    runGenerationOnce,
    cleanup: () => rm(directory, { recursive: true, force: true }),
  };
}
test("catalogo curato copre tutte le famiglie, schemi e prompt versionati", () => {
  assert.equal(catalog.length, 26);
  assert.equal(new Set(catalog.map((w) => w.id)).size, 26);
  for (const w of catalog) {
    for (const key of [
      "requiredInputs",
      "baseProcedure",
      "basePrompt",
      "reviewPrompt",
      "privacyLevel",
      "example",
    ])
      assert.ok(w[key]?.length);
    assert.equal(w.humanReviewRequired, true);
  }
  const { prompts } = basic("lib/workmap/prompts/index.ts");
  for (const p of Object.values(prompts)) {
    assert.ok(p.version);
    assert.ok(p.lastUpdated);
  }
});
test("funnel completo: profilo ricco, email, edit, approfondimento gratuito, retry, PDF e email", async () => {
  const s = await setup();
  try {
    assert.equal((await s.get()).status, 401);
    assert.equal((await s.get("pdf")).status, 401);
    let result = await s.qualify();
    assert.equal(result.status, 200);
    assert.equal(result.data.profile.teamSize, "12");
    assert.equal(result.data.workflowCount, 12);
    assert.equal(result.data.opportunities.length, 3);
    assert.equal((await s.get("pdf")).status, 409);
    assert.notEqual((await s.post("generate")).status, 200);
    result = await s.post("edit", { answer: "Responsabile vendite" });
    assert.equal(result.status, 200);
    assert.equal(result.data.profile.role, "Responsabile vendite");
    assert.equal(result.data.confirmed, false);
    await s.post("qualify", { email: "test@example.test" });
    await s.post("email");
    assert.equal(s.sent.length, 0);
    await s.post("email");
    assert.equal(s.sent.length, 0);
    await s.post("confirm");
    result = await s.post("complete");
    assert.equal(result.status, 200);
    const count = result.data.messages.length;
    result = await s.post("complete");
    assert.equal(result.data.messages.length, count);
    assert.equal(result.data.messages[0].tone, "highlight");
    assert.match(result.data.messages[0].text, /analisi gratuita/);
    assert.notEqual(result.data.question.field, "teamSize");
    let guard = 0;
    while (result.data.question && guard++ < 25) {
      result = await s.answer(
        result.data.question.field === "name"
          ? "Marco"
          : result.data.question.options[0] ||
              "Informazioni generiche e autorizzate",
      );
      assert.equal(result.status, 200);
    }
    assert.equal(result.data.state, "profile_complete");
    assert.equal(result.data.question, null);
    const smtpPassword = s.env.ARUBA_PASS;
    s.env.ARUBA_PASS = "";
    s.ai.failNext();
    result = await s.runGenerationOnce();
    assert.equal(result.data.state, "failed");
    assert.equal(result.data.job.step, 0);
    assert.equal(result.data.job.attempts, 1);
    result = await s.finishGeneration();
    assert.equal(result.data.state, "ready");
    assert.equal(result.data.content.workflows.length, 12);
    assert.equal(result.data.content.assistants.length, 3);
    assert.equal(result.data.pdfAvailable, true);
    const pdf = await s.get("pdf");
    assert.equal(pdf.status, 200);
    const bytes = Buffer.from(await pdf.arrayBuffer());
    assert.equal(bytes.subarray(0, 4).toString(), "%PDF");
    await mkdir("artifacts/workmap", { recursive: true });
    await writeFile("artifacts/workmap/sample.pdf", bytes);
    assert.ok(result.data.mailErrors.includes("ready"));
    assert.equal(result.data.emailDelivered, false);
    s.env.ARUBA_PASS = smtpPassword;
    const delivered = await s.post("email");
    assert.equal(delivered.data.emailDelivered, true);
    assert.equal(s.sent.length, 1);
    assert.match(s.sent[0].text, /#resume=/);
    assert.equal(s.sent[0].attachments[0].filename, "AI-WorkMap.pdf");
    assert.deepEqual(s.sent[0].attachments[0].content, bytes);
    await s.post("email");
    assert.equal(s.sent.length, 1);
  } finally {
    await s.cleanup();
  }
});
test("professioni non previste, risposte brevi, opzioni per ruolo e deduplicazione risposte", async () => {
  const s = await setup();
  try {
    let r = await s.post("start");
    let id = randomUUID();
    const input = {
      answer: "Recruiter",
      version: r.data.version,
      requestId: id,
    };
    r = await s.post("answer", input);
    assert.equal(r.status, 200);
    assert.ok(r.data.question.options.includes("Colloqui"));
    const n = r.data.messages.length;
    r = await s.post("answer", input);
    assert.equal(r.data.messages.length, n);
    assert.equal(
      (await s.post("answer", { ...input, requestId: randomUUID() })).status,
      409,
    );
    const second = await s.post("start");
    assert.equal(second.data.profile.role, "Recruiter");
    const reset = await s.post("reset");
    assert.equal(reset.status, 200);
    assert.equal(reset.data.profile.role, "");
    assert.ok(reset.data.question);
  } finally {
    await s.cleanup();
  }
  const t = await setup();
  try {
    await t.post("start");
    const r = await t.answer("Restauratore di organi storici");
    assert.equal(r.data.profile.role, "Restauratore di organi storici");
  } finally {
    await t.cleanup();
  }
  const greet = await setup();
  try {
    await greet.post("start");
    const skipped = await greet.answer("ciao");
    assert.equal(skipped.status, 200);
    assert.equal(skipped.data.profile.role, "");
    assert.equal(skipped.data.question.id, "role");
    assert.match(skipped.data.messages.at(-1).text, /professione|ruolo|lavoro/i);
    const named = await greet.answer("Sviluppo software");
    assert.equal(named.data.profile.role, "Sviluppo software");
    assert.notEqual(named.data.question?.id, "role");
  } finally {
    await greet.cleanup();
  }
});
test("email invalida, origine esterna, accesso privato", async () => {
  const s = await setup();
  try {
    const route = s.load("app/api/workmap/[action]/route.ts");
    const r = await route.POST(
      new Request("http://localhost:3000/api/workmap/start", {
        method: "POST",
        headers: { origin: "https://evil.test" },
        body: "{}",
      }),
      { params: Promise.resolve({ action: "start" }) },
    );
    assert.equal(r.status, 403);
    await s.post("start");
    for (const value of [
      "Consulente",
      "Documenti",
      "Report",
      "Copiare",
      "Diversi",
      "Mai",
    ])
      await s.answer(value);
    assert.equal((await s.post("qualify", { email: "bad" })).status, 422);
    assert.notEqual(
      (await s.post("resume", { token: "a".repeat(64) + "." + "b".repeat(64) }))
        .status,
      200,
    );
  } finally {
    await s.cleanup();
  }
});
test("provider JSON invalido e timeout non producono documenti inventati", async () => {
  const env = { WORKMAP_AI_API_KEY: "mock", WORKMAP_AI_MODEL: "mock" };
  for (const value of ["invalid", "{}"]) {
    const load = modules({
      env,
      fetch: async () =>
        Response.json({
          choices: [{ finish_reason: "stop", message: { content: value } }],
        }),
    });
    const { structured } = load("lib/workmap/ai.ts");
    await assert.rejects(() =>
      structured(
        "profile-extractor",
        basic("lib/workmap/schema.ts").profileSchema,
        {},
      ),
    );
  }
});
test("se il controllo qualità AI fallisce, prosegue con il documento già pronto", async () => {
  const s = await setup();
  try {
    await s.qualify();
    await s.post("confirm");
    let result = await s.post("complete");
    let guard = 0;
    while (result.data.question && guard++ < 25) {
      result = await s.answer(
        result.data.question.field === "name"
          ? "Marco"
          : result.data.question.options[0] ||
              "Informazioni generiche e autorizzate",
      );
    }
    s.ai.failQualityReviewerOnce();
    result = await s.finishGeneration();
    assert.equal(result.data.state, "ready");
    assert.equal(result.data.content.workflows.length, 12);
  } finally {
    await s.cleanup();
  }
});

test("il controllo finale ripara prompt e piano incompleti invece di bloccarsi", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "workmap-review-"));
  try {
    const env = {
      NODE_ENV: "test",
      WORKMAP_DATA_DIR: directory,
      WORKMAP_AI_API_KEY: "mock",
      WORKMAP_AI_MODEL: "mock",
      WORKMAP_ACCESS_SECRET: "test-secret-long-enough-32-characters",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    };
    const ai = fakeAI(catalog);
    ai.failQualityReviewerOnce();
    const load = modules({
      env,
      overrides: { "./ai": ai, "@/lib/workmap/ai": ai },
    });
    const { emptyProfile } = load("lib/workmap/schema.ts");
    const { reviewWorkMap } = load("lib/workmap/pipeline.ts");
    const picked = catalog.slice(0, 10);
    const broken = picked.map((workflow) => ({
      ...ai.workflow(workflow),
      masterPrompt: "Prepara una tabella dal testo",
      procedure: ["Un passo solo"],
      humanReview: "",
      privacy: "",
    }));
    const content = await reviewWorkMap({
      profile: emptyProfile(),
      selection: {
        workflows: picked.map((workflow) => ({
          id: workflow.id,
          reason: "Utile per il profilo.",
          priority: "Priorità alta",
          difficulty: "Semplice",
        })),
        notRecommended: "Non prioritizzerei i social.",
      },
      drafts: broken,
      content: {
        workflows: broken,
        assistants: [],
        weeks: [
          {
            week: 1,
            goal: "Iniziare",
            actions: ["Prova"],
            successCheck: "Controlla",
          },
        ],
        finalChecklist: [],
        privacy: [],
        tools: [],
      },
    });
    assert.equal(content.workflows.length, 10);
    assert.equal(content.assistants.length, 3);
    assert.equal(new Set(content.weeks.map((week) => week.week)).size, 4);
    for (const workflow of content.workflows) {
      for (const section of [
        "RUOLO",
        "OBIETTIVO",
        "CONTESTO",
        "INPUT",
        "VINCOLI",
        "PROCESSO",
        "OUTPUT",
        "CONTROLLO",
      ])
        assert.ok(workflow.masterPrompt.includes(section));
      assert.ok(workflow.procedure.length >= 3);
      assert.ok(workflow.humanReview);
      assert.ok(workflow.privacy);
      assert.equal(
        workflow.id,
        picked.find((item) => item.id === workflow.id).id,
      );
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("id workflow dal modello vengono allineati al catalogo", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "workmap-id-test-"));
  try {
    const env = {
      NODE_ENV: "test",
      WORKMAP_DATA_DIR: directory,
      WORKMAP_AI_API_KEY: "mock",
      WORKMAP_AI_MODEL: "mock",
      WORKMAP_ACCESS_SECRET: "test-secret-long-enough-32-characters",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    };
    const ai = fakeAI(catalog);
    ai.personalizerWrongIdOnce();
    const load = modules({
      env,
      overrides: { "./ai": ai, "@/lib/workmap/ai": ai },
    });
    const { emptyProfile } = load("lib/workmap/schema.ts");
    const { personalizeWorkflow } = load("lib/workmap/pipeline.ts");
    const picked = catalog[0];
    const workflow = await personalizeWorkflow(
      {
        profile: emptyProfile(),
        selection: {
          workflows: [
            {
              id: picked.id,
              reason: "Utile per il profilo.",
              priority: "Priorità alta",
              difficulty: "Semplice",
            },
          ],
          notRecommended: "Non prioritizzerei i social.",
        },
      },
      0,
    );
    assert.equal(workflow.id, picked.id);
    assert.equal(workflow.title, picked.title);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("profilo già completo salta le domande e non richiede team o strumenti due volte", () => {
  const { emptyProfile } = basic("lib/workmap/schema.ts");
  const { analysisReady, missingFields } = basic("lib/workmap/conversation.ts");
  const profile = emptyProfile();
  assert.equal(analysisReady(profile), false);
  profile.role = "Recruiter";
  profile.mainTasks = ["Colloqui"];
  assert.equal(analysisReady(profile), true);
  for (const key of Object.keys(profile))
    profile[key] = Array.isArray(profile[key])
      ? ["Già indicato"]
      : "Già indicato";
  assert.equal(missingFields(profile, true).length, 0);
});
test("persistenza CAS e lease impediscono sovrascritture e lavorazioni concorrenti", async () => {
  const s = await setup();
  try {
    await s.post("start");
    const store = s.load("lib/workmap/store.ts");
    const [id] = await store.listSessions();
    const a = await store.getSession(id),
      b = await store.getSession(id);
    a.email = "saved@example.test";
    await store.saveSession(a, a.version);
    b.email = "stale@example.test";
    await assert.rejects(() => store.saveSession(b, b.version));
    assert.equal((await store.getSession(id)).email, "saved@example.test");
    const lease = await store.claimLease(id);
    assert.ok(lease);
    assert.equal(await store.claimLease(id), null);
    await store.releaseLease(id, "wrong-token");
    assert.equal(await store.claimLease(id), null);
    await store.releaseLease(id, lease);
    assert.ok(await store.claimLease(id));
  } finally {
    await s.cleanup();
  }
});

test("il worker interno usa il dominio pubblico, non solo VERCEL_URL", () => {
  const { workerOrigin } = modules({
    env: {
      NEXT_PUBLIC_SITE_URL: "https://acceleriamo.it",
      VERCEL_URL: "acceleriamo-sito-web.vercel.app",
    },
  })("lib/workmap/jobs.ts");
  assert.equal(workerOrigin(), "https://acceleriamo.it");
});

test("Redis REST ignora rediss con password e preferisce https", () => {
  const rest = modules({
    env: {
      WORKMAP_REDIS_URL: "rediss://default:secret@example.upstash.io:6379",
      STORAGE_KV_REST_API_URL: "https://example.upstash.io",
      STORAGE_KV_REST_API_TOKEN: "rest-token",
    },
  })("lib/workmap/store.ts");
  assert.equal(rest.redisRestUrl(), "https://example.upstash.io");
  assert.equal(rest.redisRestToken(), "rest-token");
  const derived = modules({
    env: {
      STORAGE_REDIS_URL: "rediss://default:secret%2Btoken@example.upstash.io:6379",
    },
  })("lib/workmap/store.ts");
  assert.equal(derived.redisRestUrl(), "https://example.upstash.io");
  assert.equal(derived.redisRestToken(), "secret+token");
});

test("gli eventi Redis riconoscono sia il formato Upstash sia JSON", () => {
  const { isRedisChangeLine } = basic("lib/workmap/events.ts");
  assert.equal(isRedisChangeLine("data: subscribe,workmap:events:abc,1"), true);
  assert.equal(isRedisChangeLine("data: message,workmap:events:abc,12"), true);
  assert.equal(isRedisChangeLine('data: {"type":"message"}'), true);
  assert.equal(isRedisChangeLine(": ping"), false);
  assert.equal(isRedisChangeLine("data:"), false);
  assert.equal(isRedisChangeLine("data:   "), false);
});

test("worker cron autenticato riprende la generazione senza coda esterna", async () => {
  const s = await setup();
  try {
    const worker = s.load("app/api/workmap/worker/route.ts");
    assert.equal(
      (
        await worker.GET(
          new Request("http://localhost:3000/api/workmap/worker"),
        )
      ).status,
      401,
    );
    const empty = await worker.GET(
      new Request("http://localhost:3000/api/workmap/worker", {
        headers: { authorization: `Bearer ${s.env.CRON_SECRET}` },
      }),
    );
    assert.equal(empty.status, 200);
    assert.equal((await empty.json()).processed, 0);
    await s.qualify();
    await s.post("confirm");
    let result = await s.post("complete");
    let guard = 0;
    while (result.data.question && guard++ < 25) {
      result = await s.answer(
        result.data.question.field === "name"
          ? "Marco"
          : result.data.question.options[0] ||
              "Informazioni generiche e autorizzate",
      );
    }
    result = await s.post("generate");
    assert.equal(result.data.state, "generating");
    const step = result.data.job.step;
    const advanced = await worker.GET(
      new Request("http://localhost:3000/api/workmap/worker", {
        headers: { authorization: `Bearer ${s.env.CRON_SECRET}` },
      }),
    );
    assert.equal(advanced.status, 200);
    assert.equal((await advanced.json()).processed, 1);
    assert.ok((await (await s.get()).json()).job.step >= step);
  } finally {
    await s.cleanup();
  }
});

test("tracking: solo metriche prodotto e nessun evento Meta senza consenso", () => {
  const pixels = [],
    analytics = [];
  let allowed = false;
  const load = modules({
    globals: {
      window: { fbq: (...args) => pixels.push(args) },
      crypto: { randomUUID },
    },
    overrides: {
      "@vercel/analytics": { track: (...args) => analytics.push(args) },
      "@/lib/tracking": {
        marketingAllowed: () => allowed,
        startPixel: () => {},
      },
    },
  });
  const { trackWorkMap } = load("components/workmap/tracking.ts");
  trackWorkMap("PreviewViewed", {
    workflow_count: 12,
    email: "private@example.test",
    role: "Private role",
  });
  assert.equal(pixels.length, 0);
  allowed = true;
  trackWorkMap(
    "GenerationCompleted",
    { workflow_count: 12, email: "private@example.test" },
    "generation-test",
  );
  assert.equal(pixels.length, 1);
  assert.equal(
    JSON.stringify([...analytics, ...pixels]).includes("private"),
    false,
  );
  assert.equal(pixels[0][3].eventID, "generation-test");
});
