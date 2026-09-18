import { createHash, randomBytes, randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  rmdir,
  rename,
  writeFile,
  readdir,
  unlink,
  stat,
} from "node:fs/promises";
import path from "node:path";
import type { Session } from "./schema";
export const sessionDirectory = () =>
  process.env.WORKMAP_DATA_DIR || path.join(process.cwd(), ".workmap-data");
const envValue = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
};
const fromRedisUrl = (raw: string) => {
  if (!/^rediss?:\/\//i.test(raw)) return {};
  try {
    const parsed = new URL(raw);
    if (!parsed.hostname) return {};
    return {
      url: `https://${parsed.hostname}`,
      token: decodeURIComponent(parsed.password || ""),
    };
  } catch {
    return {};
  }
};
export const redisRestUrl = () => {
  for (const key of [
    "WORKMAP_REDIS_URL",
    "STORAGE_KV_REST_API_URL",
    "KV_REST_API_URL",
    "UPSTASH_REDIS_REST_URL",
  ]) {
    const raw = process.env[key]?.trim();
    if (raw && /^https:\/\//i.test(raw) && !raw.includes("@"))
      return raw.replace(/\/$/, "");
  }
  for (const key of [
    "WORKMAP_REDIS_URL",
    "STORAGE_REDIS_URL",
    "STORAGE_KV_URL",
    "REDIS_URL",
  ]) {
    const converted = fromRedisUrl(process.env[key]?.trim() || "");
    if (converted.url) return converted.url;
  }
};
export const redisRestToken = () =>
  envValue(
    "WORKMAP_REDIS_TOKEN",
    "STORAGE_KV_REST_API_TOKEN",
    "KV_REST_API_TOKEN",
    "UPSTASH_REDIS_REST_TOKEN",
  ) ||
  fromRedisUrl(
    envValue(
      "WORKMAP_REDIS_URL",
      "STORAGE_REDIS_URL",
      "STORAGE_KV_URL",
      "REDIS_URL",
    ) || "",
  ).token;
export const remoteStore = () => Boolean(redisRestUrl() && redisRestToken());
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export const newToken = () => randomBytes(32).toString("hex");
export class Conflict extends Error {
  constructor() {
    super("Un’altra operazione è in corso. Ricarica e riprova.");
  }
}
export async function redis(...command: (string | number)[]): Promise<unknown> {
  const response = await fetch(redisRestUrl()!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisRestToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!response.ok) throw Error("Archivio temporaneamente non disponibile.");
  const data = await response.json();
  if (data.error) throw Error("Archivio temporaneamente non disponibile.");
  return data.result;
}
function localAllowed() {
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.WORKMAP_ALLOW_LOCAL_STORE
  )
    throw Error(
      "Configura l’archivio persistente prima di avviare il servizio.",
    );
}
export function leadExpired(s: Session, now = Date.now()) { return now >= new Date(s.createdAt).getTime() + 30 * 86400000; }
export async function getSession(id: string): Promise<Session | null> {
  if (!/^[a-f0-9]{64}$/.test(id)) return null;
  if (remoteStore()) {
    const data = await redis("GET", `workmap:${id}`);
    if(typeof data !== "string") return null;
    const s:Session=JSON.parse(data);
    if(leadExpired(s)){await deleteSession(id);return null;}
    return s;
  }
  localAllowed();
  try {
    const s:Session = JSON.parse(
      await readFile(
        /* turbopackIgnore: true */ path.join(sessionDirectory(), `${id}.json`),
        "utf8",
      ),
    );
    if(leadExpired(s)){await deleteSession(id);return null;}
    return s;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}
// All writes use a version CAS. Long provider calls never hold a database lock.
export async function saveSession(s: Session, expected: number) {
  const next = {
    ...s,
    version: expected + 1,
    updatedAt: new Date().toISOString(),
  };
  if (remoteStore()) {
    const result = await redis(
      "EVAL",
      `local raw=redis.call('GET',KEYS[1]); if raw then if cjson.decode(raw).version~=tonumber(ARGV[1]) then return 0 end elseif tonumber(ARGV[1])~=0 then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); if tonumber(ARGV[3])>0 then redis.call('PEXPIREAT',KEYS[1],ARGV[3]) end; redis.call('PUBLISH',KEYS[2],ARGV[4]); return 1`,
      2,
      `workmap:${s.id}`,
      `workmap:events:${s.id}`,
      expected,
      JSON.stringify(next),
      new Date(s.createdAt).getTime() + 30 * 86400000,
      next.version,
    );
    if (result !== 1) throw new Conflict();
  } else {
    localAllowed();
    await mkdir(sessionDirectory(), { recursive: true, mode: 0o700 });
    const lock = path.join(sessionDirectory(), `${s.id}.lock`);
    try {
      await mkdir(lock);
    } catch {
      throw new Conflict();
    }
    try {
      const old = await getSession(s.id);
      if ((old?.version ?? 0) !== expected) throw new Conflict();
      const tmp = path.join(sessionDirectory(), `${s.id}.${randomUUID()}.tmp`);
      await writeFile(tmp, JSON.stringify(next), { mode: 0o600 });
      await rename(tmp, path.join(sessionDirectory(), `${s.id}.json`));
    } finally {
      await rmdir(lock);
    }
  }
  Object.assign(s, next);
}
export async function listSessions(): Promise<string[]> {
  if (remoteStore()) {
    const ids:string[]=[]; let cursor="0";
    do { const page=await redis("SCAN",cursor,"MATCH","workmap:*","COUNT",100) as [string,string[]];cursor=page[0];ids.push(...page[1].filter(key=>/^workmap:[a-f0-9]{64}$/.test(key)).map(key=>key.slice(8))); } while(cursor!=="0");
    return ids;
  }
  localAllowed();
  await mkdir(sessionDirectory(), { recursive: true, mode: 0o700 });
  return (await readdir(/* turbopackIgnore: true */ sessionDirectory()))
    .filter((f) => /^[a-f0-9]{64}\.json$/.test(f))
    .map((f) => f.slice(0, -5));
}
export async function deleteSession(id: string) {
  if (!/^[a-f0-9]{64}$/.test(id)) return;
  if (remoteStore()) {
    await redis("DEL", `workmap:${id}`);

  } else {
    localAllowed();
    await unlink(path.join(sessionDirectory(), `${id}.json`)).catch(() => {});
  }
}
export async function rateLimit(key: string, limit = 30, seconds = 3600) {
  const digest = hashToken(key);
  if (remoteStore()) {
    const n = await redis(
      "EVAL",
      "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",
      1,
      `wm:rate:${digest}`,
      seconds,
    );
    if (Number(n) > limit)
      throw Error("Troppe richieste. Riprova tra qualche minuto.");
  } else {
    localAllowed();
    await mkdir(sessionDirectory(), { recursive: true, mode: 0o700 });
    const p = path.join(sessionDirectory(), `rate-${digest}`);
    let n = 0;
    try {
      const info = await stat(/* turbopackIgnore: true */ p);
      if (Date.now() - info.mtimeMs < seconds * 1000)
        n = Number(await readFile(/* turbopackIgnore: true */ p, "utf8"));
    } catch {}
    if (n >= limit) throw Error("Troppe richieste. Riprova più tardi.");
    await writeFile(p, String(n + 1), { mode: 0o600 });
  }
}
// A lease prevents duplicate expensive generation; CAS still protects late workers.
export async function claimLease(id: string): Promise<string | null> {
  const token = randomUUID();
  if (remoteStore())
    return (await redis("SET", `wm:lease:${id}`, token, "NX", "EX", 240))
      ? token
      : null;
  localAllowed();
  const file = path.join(sessionDirectory(), `${id}.lease`);
  try {
    const info = await stat(/* turbopackIgnore: true */ file);
    if (Date.now() - info.mtimeMs > 240000) await unlink(file);
  } catch {}
  try {
    await writeFile(file, token, { flag: "wx", mode: 0o600 });
    return token;
  } catch {
    return null;
  }
}
export async function releaseLease(id: string, token: string) {
  if (remoteStore())
    await redis(
      "EVAL",
      "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end return 0",
      1,
      `wm:lease:${id}`,
      token,
    );
  else {
    const file = path.join(sessionDirectory(), `${id}.lease`);
    if (
      (await readFile(/* turbopackIgnore: true */ file, "utf8").catch(
        () => "",
      )) === token
    )
      await unlink(file).catch(() => {});
  }
}
