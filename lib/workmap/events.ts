import { watch } from "node:fs";
import {
  redisRestToken,
  redisRestUrl,
  remoteStore,
  sessionDirectory,
} from "./store";

export function isRedisChangeLine(line: string) {
  const data = line.trim();
  return data.startsWith("data:") && Boolean(data.slice(5).trim());
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) return resolve();
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

async function subscribeRedis(
  id: string,
  onChange: () => Promise<void>,
  signal: AbortSignal,
) {
  const response = await fetch(
    `${redisRestUrl()!.replace(/\/$/, "")}/subscribe/workmap:events:${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisRestToken()}`,
        Accept: "text/event-stream",
      },
      signal,
      cache: "no-store",
    },
  );
  if (!response.ok || !response.body)
    throw Error("Connessione aggiornamenti non disponibile.");
  const reader = response.body.getReader(),
    decoder = new TextDecoder();
  let buffer = "";
  try {
    while (!signal.aborted) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let end: number;
      while ((end = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        if (isRedisChangeLine(line)) await onChange();
      }
      if (buffer.length > 64000) throw Error("Evento non valido.");
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
}

export async function subscribeToSession(
  id: string,
  onChange: () => Promise<void>,
  signal: AbortSignal,
) {
  await onChange();
  if (!remoteStore()) {
    await new Promise<void>((resolve, reject) => {
      let pending = Promise.resolve();
      const watcher = watch(
        /* turbopackIgnore: true */ sessionDirectory(),
        (_event, filename) => {
          if (filename?.toString() === `${id}.json`)
            pending = pending.then(onChange).catch(reject);
        },
      );
      const stop = () => {
        watcher.close();
        resolve();
      };
      signal.addEventListener("abort", stop, { once: true });
      watcher.on("error", reject);
      if (signal.aborted) stop();
    });
    return;
  }
  while (!signal.aborted) {
    try {
      await subscribeRedis(id, onChange, signal);
    } catch {
      if (signal.aborted) return;
    }
    if (!signal.aborted) await sleep(2000, signal);
  }
}
