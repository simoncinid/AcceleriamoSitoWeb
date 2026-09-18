import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  authenticate,
  createSession,
  cookie,
  view,
  requestBody,
  sameOrigin,
  deliverPending,
  safeEqual,
} from "@/lib/workmap/service";
import { kickGeneration, scheduleWork } from "@/lib/workmap/jobs";
import { analyzeTasks, selectWorkflows } from "@/lib/workmap/pipeline";
import { answerSchema } from "@/lib/workmap/schema";
import { answerConversation, beginDetailsChat } from "@/lib/workmap/conversation";
import {
  getSession,
  saveSession,
  rateLimit,
  Conflict,
  claimLease,
  releaseLease,
  deleteSession,
} from "@/lib/workmap/store";
import { recoveryToken } from "@/lib/workmap/email";
import { aiConfigured } from "@/lib/workmap/ai";
export const runtime = "nodejs";
export const maxDuration = 180;
const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};
type Context = { params: Promise<{ action: string }> };
export async function GET(request: Request, { params }: Context) {
  try {
    const { action } = await params;
    const s = await authenticate(request);
    if (!s)
      return NextResponse.json(
        { error: "Conversazione non trovata." },
        { status: 401, headers },
      );
    if (action === "session") return NextResponse.json(view(s), { headers });
    if (action === "pdf") {
      if (s.state !== "ready" || !s.pdf)
        return NextResponse.json(
          { error: "Il PDF non è ancora disponibile." },
          { status: 409, headers },
        );
      s.downloads++;
      await saveSession(s, s.version);
      return new Response(Buffer.from(s.pdf, "base64"), {
        headers: {
          ...headers,
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=AI-WorkMap.pdf",
        },
      });
    }
    return NextResponse.json(
      { error: "Operazione non trovata." },
      { status: 404, headers },
    );
  } catch {
    return NextResponse.json(
      { error: "Archivio temporaneamente non disponibile." },
      { status: 503, headers },
    );
  }
}
export async function POST(request: Request, { params }: Context) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Origine non autorizzata." },
      { status: 403, headers },
    );
  let held: { id: string; token: string } | undefined;
  try {
    const { action } = await params;
    const body = await requestBody(request);
    if (action === "resume") {
      const token = z
        .string()
        .regex(/^[a-f0-9]{64}\.[a-f0-9]{64}$/)
        .parse(body.token);
      const id = token.split(".")[0];
      if (!safeEqual(token, recoveryToken(id)))
        throw Error("Collegamento non valido.");
      const s = await getSession(id);
      if (!s) throw Error("Analisi non trovata o scaduta.");
      return NextResponse.json(view(s), {
        headers: { ...headers, "Set-Cookie": cookie(token) },
      });
    }
    if (action === "start" || action === "reset") {
      if (!aiConfigured())
        throw Error(
          "L’analisi AI sarà disponibile a breve. Riprova più tardi.",
        );
      const ip = process.env.VERCEL
        ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0] ||
          "unknown"
        : "local";
      if (action === "reset") {
        const current = await authenticate(request);
        if (current) await deleteSession(current.id);
        await rateLimit(`reset:${ip}`, 20);
      } else {
        const existing = await authenticate(request);
        if (existing) return NextResponse.json(view(existing), { headers });
        await rateLimit(`start:${ip}`, 10);
      }
      const consent =
        request.headers
          .get("cookie")
          ?.split(/;\s*/)
          .includes("acceleriamo_marketing=accepted") &&
        body.marketingConsent === true;
      const fb = (key: string) =>
        consent &&
        typeof body[key] === "string" &&
        /^fb\.\d+\.\d+\.[\w.-]{1,450}$/.test(body[key])
          ? (body[key] as string)
          : undefined;
      const { session, token } = await createSession(
        Boolean(consent),
        fb("fbp"),
        fb("fbc"),
      );
      return NextResponse.json(view(session), {
        headers: { ...headers, "Set-Cookie": cookie(token) },
      });
    }
    let s = await authenticate(request);
    if (!s && action === "consent")
      return NextResponse.json({ accepted: true }, { headers });
    if (!s)
      return NextResponse.json(
        { error: "Riprendi l’analisi dal collegamento ricevuto via email." },
        { status: 401, headers },
      );
    if (action === "generate") {
      if (!s.confirmed || !s.email || !["profile_complete", "generating", "reviewing", "failed", "ready"].includes(s.state))
        throw Error("Completa prima il profilo e indica la tua email.");
      if (s.state === "profile_complete" || (s.state === "failed" && body.retry === true)) {
        const lease = await claimLease(s.id); if (!lease) throw new Conflict();
        try {
          s = (await getSession(s.id))!;
          if (s.state === "profile_complete" || s.state === "failed") {
            s.job ??= {step:0,cursor:0,attempts:0,updatedAt:new Date().toISOString()};
            if (!s.job.runId) s.job.runId = randomUUID();
            s.job.attempts = 0;
            s.job.error = undefined;
            s.state = s.job.step === 5 ? "reviewing" : "generating";
            await saveSession(s, s.version);
          }
        } finally { await releaseLease(s.id, lease); }
      }
      if (
        ["generating", "reviewing"].includes(s.state) ||
        (s.state === "failed" && (s.job?.attempts ?? 5) < 5)
      ) {
        if (!s.job?.runId && s.job) {
          s.job.runId = randomUUID();
          await saveSession(s, s.version);
        }
        kickGeneration(s.id);
        s = (await getSession(s.id))!;
      }
      return NextResponse.json(view(s), {headers});
    }
    const lease = await claimLease(s.id);
    if (!lease) throw new Conflict();
    held = { id: s.id, token: lease };
    s = (await getSession(s.id))!;
    if (action === "consent") {
      s.marketing = Boolean(
        request.headers
          .get("cookie")
          ?.split(/;\s*/)
          .includes("acceleriamo_marketing=accepted") &&
          body.marketingConsent === true,
      );
      if (!s.marketing) {
        s.fbp = undefined;
        s.fbc = undefined;
      }
      await saveSession(s, s.version);
    } else if (action === "answer") {
      const input = answerSchema.parse(body);
      if (!s.requestIds.includes(input.requestId)) {
        if (input.version !== s.version) throw new Conflict();
        if (!["lead", "details"].includes(s.state))
          throw Error("Questa fase è conclusa.");
        await rateLimit(`answer:${s.id}`, 100);
        await answerConversation(s, input.answer);
        s.requestIds.push(input.requestId);
        await saveSession(s, s.version);
      }
    } else if (action === "qualify") {
      if (!["lead", "qualified"].includes(s.state) || s.question) throw Error("Completa prima la conversazione.");
      if (!s.email) {
        s.email = z.email().max(254).parse(body.email).toLowerCase();
        await saveSession(s, s.version);
      }
      if (!s.selection) {
        s.analysis = await analyzeTasks(s);
        s.selection = await selectWorkflows(s);
        s.state = "qualified";
        await saveSession(s, s.version);
      }
      await releaseLease(held.id, held.token);
      held = undefined;
      await deliverPending(s.id);
      s = (await getSession(s.id))!;
      if (s.mailErrors.length || (s.state === "ready" && !s.mail.ready))
        scheduleWork(s.id, "email", 8000);
    } else if (action === "confirm") {
      if (!s.selection || s.state !== "qualified")
        throw Error("Profilo non modificabile in questa fase.");
      s.confirmed = true;
      await saveSession(s, s.version);
    } else if (action === "edit") {
      if (!["lead", "qualified"].includes(s.state))
        throw Error(
          "Per modifiche dopo l’avvio del documento contatta info@acceleriamo.it.",
        );
      const answer = z.string().trim().min(3).max(4000).parse(body.answer);
      s.question = {
        id: "correction",
        field: "role",
        text: "Cosa vuoi correggere del tuo profilo?",
        kind: "text",
        options: [],
      };
      await answerConversation(s, answer);
      s.question = null;
      s.selection = undefined;
      s.analysis = undefined;
      s.confirmed = false;
      s.state = "lead";
      await saveSession(s, s.version);
    } else if (action === "complete") {
      if (s.state === "qualified" && s.confirmed && s.selection && s.email) {
        beginDetailsChat(s);
        await saveSession(s, s.version);
      } else if (!["details", "profile_complete"].includes(s.state)) {
        throw Error("Completa e conferma prima il profilo.");
      }
    } else if (action === "email") {
      await releaseLease(held.id, held.token);
      held = undefined;
      await deliverPending(s.id);
      s = (await getSession(s.id))!;
      if (s.mailErrors.length || (s.state === "ready" && !s.mail.ready))
        scheduleWork(s.id, "email", 8000);
    } else
      return NextResponse.json(
        { error: "Operazione non trovata." },
        { status: 404, headers },
      );
    return NextResponse.json(view(s), { headers });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? "Controlla i dati inseriti e riprova."
            : error instanceof Error
              ? error.message
              : "Operazione non riuscita. Riprova.",
      },
      {
        status:
          error instanceof Conflict
            ? 409
            : error instanceof z.ZodError
              ? 422
              : 503,
        headers,
      },
    );
  } finally {
    if (held) await releaseLease(held.id, held.token);
  }
}
