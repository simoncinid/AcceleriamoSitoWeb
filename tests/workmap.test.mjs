import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHmac, randomUUID } from "node:crypto";
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
    WORKMAP_SALES_ENABLED: "true",
    STRIPE_SECRET_KEY: "sk_test_mock",
    STRIPE_WEBHOOK_SECRET: "whsec_mock",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    ARUBA_USER: "mail@example.test",
    ARUBA_PASS: "mock",
    CRON_SECRET: "cron-test-secret",
  };
  const ai = fakeAI(catalog),
    sent = [],
    stripeRequests = [];
  let checkout;
  const fetch = async (url, init) => {
    stripeRequests.push({ url, init });
    if (url.endsWith("/checkout/sessions")) {
      const p = new URLSearchParams(init.body);
      checkout = {
        id: "cs_test_123",
        url: "https://checkout.stripe.com/test",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        payment_status: "unpaid",
        mode: "payment",
        client_reference_id: p.get("client_reference_id"),
        metadata: { order_id: p.get("metadata[order_id]") },
        amount_total: Number(p.get("line_items[0][price_data][unit_amount]")),
        currency: "eur",
        payment_intent: "pi_test",
      };
    }
    return Response.json(checkout);
  };
  const load = modules({
    env,
    fetch,
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
    await answer("Sono responsabile commerciale di una PMI e seguo 12 agenti");
    await answer("Report agenti; Offerte");
    await answer("Report agenti; Follow-up clienti");
    await answer("Raccogliere gli aggiornamenti ogni settimana");
    await answer("Email e messaggi diversi");
    await answer("Mai");
    return post("qualify", { email: "test@example.test" });
  }
  async function finishGeneration() {
    let result = await post("generate");
    for (let n = 0; n < 80 && ["generating", "reviewing", "failed"].includes(result.data.state); n++) {
      if (result.data.state === "failed" && (result.data.job?.attempts ?? 0) >= 5) break;
      result = await post("generate");
    }
    return result;
  }
  return {
    load,
    ai,
    env,
    sent,
    stripeRequests,
    post,
    get,
    answer,
    qualify,
    finishGeneration,
    pay: () => {
      checkout.payment_status = "paid";
    },
    checkout: () => checkout,
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
test("funnel completo: profilo ricco, email, edit, pagamento confermato, retry, PDF e email", async () => {
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
    assert.equal(s.sent.length, 1);
    await s.post("email");
    assert.equal(s.sent.length, 1);
    await s.post("confirm");
    assert.notEqual(
      (await s.post("checkout", { acceptTerms: false })).status,
      200,
    );
    result = await s.post("checkout", { acceptTerms: true });
    assert.equal(result.status, 200);
    assert.match(result.data.url, /checkout.stripe.com/);
    await s.post("payment");
    assert.equal((await (await s.get()).json()).paid, false);
    s.pay();
    result = await s.post("payment");
    assert.equal(result.data.paid, true);
    const count = result.data.messages.length;
    result = await s.post("payment");
    assert.equal(result.data.messages.length, count);
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
    s.ai.failNext();
    result = await s.post("generate");
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
    await s.post("email");
    assert.equal(s.sent.length, 3);
    assert.match(s.sent[2].text, /#resume=/);
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
});
test("email invalida, origine esterna, accesso privato e firma webhook", async () => {
  const s = await setup();
  try {
    const payments = s.load("lib/workmap/payments.ts");
    const raw = '{"id":"evt_1"}',
      time = Math.floor(Date.now() / 1000);
    const sig = createHmac("sha256", s.env.STRIPE_WEBHOOK_SECRET)
      .update(`${time}.${raw}`)
      .digest("hex");
    assert.equal(payments.verifySignature(raw, `t=${time},v1=${sig}`), true);
    assert.equal(
      payments.verifySignature(raw + " ", `t=${time},v1=${sig}`),
      false,
    );
    assert.equal(
      payments.verifySignature(
        raw,
        `t=${time},v1=${sig}`,
        Date.now() + 3600000,
      ),
      false,
    );
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
test("webhook duplicato e importo errato non duplicano/sbloccano ordini", async () => {
  const s = await setup();
  try {
    await s.qualify();
    await s.post("confirm");
    await s.post("checkout", { acceptTerms: true });
    s.pay();
    const webhook = s.load("app/api/workmap/webhook/route.ts");
    async function send() {
      const raw = JSON.stringify({
          type: "checkout.session.completed",
          data: { object: s.checkout() },
        }),
        t = Math.floor(Date.now() / 1000);
      const sig = createHmac("sha256", s.env.STRIPE_WEBHOOK_SECRET)
        .update(`${t}.${raw}`)
        .digest("hex");
      return webhook.POST(
        new Request("http://localhost:3000/api/workmap/webhook", {
          method: "POST",
          headers: { "stripe-signature": `t=${t},v1=${sig}` },
          body: raw,
        }),
      );
    }
    s.checkout().amount_total = 100;
    assert.equal((await send()).status, 503);
    assert.equal((await (await s.get()).json()).paid, false);
    s.checkout().amount_total = 4700;
    assert.equal((await send()).status, 200);
    const first = await (await s.get()).json();
    assert.equal(first.paid, true);
    assert.equal((await send()).status, 200);
    const second = await (await s.get()).json();
    assert.equal(second.messages.length, first.messages.length);
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
test("profilo già completo salta le domande e non richiede team o strumenti due volte", () => {
  const { emptyProfile } = basic("lib/workmap/schema.ts");
  const { nextCandidate } = basic("lib/workmap/conversation.ts");
  const profile = emptyProfile();
  for (const key of Object.keys(profile))
    profile[key] = Array.isArray(profile[key])
      ? ["Già indicato"]
      : "Già indicato";
  assert.equal(
    nextCandidate({
      profile,
      answered: [],
      order: { paidAt: new Date().toISOString() },
    }),
    null,
  );
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
    await s.post("checkout", { acceptTerms: true });
    s.pay();
    let result = await s.post("payment");
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
    "Purchase",
    { price: 47, currency: "EUR", email: "private@example.test" },
    "purchase-test",
  );
  assert.equal(pixels.length, 1);
  assert.equal(
    JSON.stringify([...analytics, ...pixels]).includes("private"),
    false,
  );
  assert.equal(pixels[0][3].eventID, "purchase-test");
});
