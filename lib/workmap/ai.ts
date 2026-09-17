import { z } from "zod";
import { prompts, type PromptId } from "./prompts";
export function aiConfigured() {
  return Boolean(
    process.env.WORKMAP_AI_API_KEY && process.env.WORKMAP_AI_MODEL,
  );
}
export async function structured<T extends z.ZodType>(
  id: PromptId,
  schema: T,
  input: unknown,
  creative = false,
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
    signal: AbortSignal.timeout(45000),
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
  return schema.parse(JSON.parse(message.content));
}
