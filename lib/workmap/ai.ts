import { z } from "zod";
import { prompts, type PromptId } from "./prompts";

const DEFAULT_TIMEOUT_MS = 45_000;
const PROMPT_TIMEOUT_MS: Partial<Record<PromptId, number>> = {
  "workflow-selector": 90_000,
  "workflow-personalizer": 75_000,
  "assistant-generator": 90_000,
  "plan-generator": 90_000,
  "quality-reviewer": 40_000,
};
const PROMPT_ATTEMPTS: Partial<Record<PromptId, number>> = {
  "quality-reviewer": 1,
};

export function aiConfigured() {
  return Boolean(
    process.env.WORKMAP_AI_API_KEY && process.env.WORKMAP_AI_MODEL,
  );
}

export function isTransientAIError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === "AbortError" || error.name === "TimeoutError") return true;
  return /timeout|aborted|temporaneamente|occupato|incompleta|fetch failed|ECONNRESET|EPIPE/i.test(
    error.message,
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function structuredOnce<T extends z.ZodType>(
  id: PromptId,
  schema: T,
  input: unknown,
  creative: boolean,
  timeoutMs: number,
): Promise<z.infer<T>> {
  if (!aiConfigured())
    throw new Error(
      "Il consulente AI non è ancora disponibile. Riprova più tardi.",
    );
  const base = process.env.WORKMAP_AI_BASE_URL || "https://api.openai.com/v1";
  if (
    !base.startsWith("https://") &&
    !(
      (process.env.NODE_ENV !== "production" ||
        process.env.WORKMAP_TEST_LOCAL_AI === "true") &&
      base.startsWith("http://localhost:")
    )
  )
    throw new Error("Provider AI non configurato correttamente.");
  const response = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WORKMAP_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.WORKMAP_AI_MODEL,
      store: false,
      ...(process.env.WORKMAP_AI_TEMPERATURE_SUPPORTED === "true"
        ? { temperature: creative ? 0.4 : 0.1 }
        : {}),
      messages: [
        {
          role: "system",
          content:
            prompts[id].text +
            (id === "workflow-personalizer"
              ? `\n${prompts["prompt-generator"].text}`
              : ""),
        },
        { role: "user", content: JSON.stringify(input) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: id.replaceAll("-", "_"),
          strict: true,
          schema: z.toJSONSchema(schema),
        },
      },
    }),
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(
      "Il servizio AI è temporaneamente occupato. I tuoi progressi sono salvati.",
    );
  const result = await response.json();
  const message = result.choices?.[0]?.message;
  if (
    !message?.content ||
    message.refusal ||
    result.choices?.[0]?.finish_reason !== "stop"
  )
    throw new Error(
      "Risposta AI incompleta. Riprova: i tuoi progressi sono salvati.",
    );
  try {
    return schema.parse(JSON.parse(message.content));
  } catch {
    throw new Error(
      "Risposta AI incompleta. Riprova: i tuoi progressi sono salvati.",
    );
  }
}

export async function structured<T extends z.ZodType>(
  id: PromptId,
  schema: T,
  input: unknown,
  creative = false,
): Promise<z.infer<T>> {
  const attempts = PROMPT_ATTEMPTS[id] ?? 3;
  const timeoutMs = PROMPT_TIMEOUT_MS[id] ?? DEFAULT_TIMEOUT_MS;
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await structuredOnce(
        id,
        schema,
        input,
        creative,
        timeoutMs + attempt * 15_000,
      );
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1 || !isTransientAIError(error)) throw error;
      await sleep(2000 * (attempt + 1));
    }
  }
  throw lastError;
}
