import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
function compile(file, dependencies = {}, env = {}, globals = {}) {
  const source = ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, { exports, require: name => dependencies[name] ?? require(name), process: { env }, Date, console, ...globals });
  return exports;
}
const legal = compile('../lib/legal.ts');
function setup(configured = true, fail = false, metaFail = false) {
  const sent = [], events = [];
  const route = compile('../app/api/contact/route.ts', {
    '@/lib/legal': legal,
    '@/lib/meta': { sendMetaLead: async event => { if (metaFail) throw Error('Meta'); events.push(event); } },
    nodemailer: { createTransport: () => ({ sendMail: async mail => { if (fail) throw Error('SMTP'); sent.push(mail); } }) },
  }, configured ? { ARUBA_USER: 'info@acceleriamo.it', ARUBA_PASS: 'mock', LEAD_DEST: 'lead@example.test' } : {});
  return { sent, events, post: body => route.POST(new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })) };
}
const valid = { name: 'Test', company: 'Test Srl', phone: '+39 333 123 4567', activity: 'Preventivi', legalVersion: legal.LEGAL_VERSION };
test('telefono sufficiente: accetta email e caselle assenti, senza replyTo vuoto', async () => {
  const { post, sent } = setup();
  const response = await post(valid);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).accepted, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].from, '"ACCELERIAMO" <info@acceleriamo.it>');
  assert.equal(sent[0].to, 'lead@example.test');
  assert.equal('replyTo' in sent[0], false);
  assert.equal((await post({ ...valid, email: '' })).status, 200);
});
test('valida email facoltativa e preserva replyTo quando presente', async () => {
  const { post, sent } = setup();
  assert.equal((await post({ ...valid, email: 'invalid' })).status, 422);
  assert.equal(sent.length, 0);
  assert.equal((await post({ ...valid, email: 'example@gmail.com' })).status, 200);
  assert.equal(sent[0].replyTo.address, 'example@gmail.com');
});
test('rifiuta versioni mancanti o obsolete', async () => {
  const { post, sent } = setup();
  for (const legalVersion of [undefined, '2020-01-01']) assert.equal((await post({ ...valid, legalVersion })).status, 409);
  assert.equal(sent.length, 0);
});
test('SMTP confermato: stesso ID per risposta, email e Conversion API; UTM conservati', async () => {
  const { post, sent, events } = setup();
  const response = await post({ ...valid, utm_source: 'instagram', utm_campaign: 'officine', utm_content: 'video-1', sector: 'officine' });
  const result = await response.json();
  assert.equal(result.accepted, true);
  assert.match(result.eventId, /^[\da-f-]{36}$/);
  assert.equal(events[0].eventId, result.eventId);
  for (const value of [result.eventId, legal.LEGAL_VERSION, 'utm_source: instagram', 'utm_campaign: officine', 'utm_content: video-1', 'sector: officine']) assert.ok(sent[0].text.includes(value));
  assert.doesNotMatch(sent[0].text, /Ho letto|Ho letto e accetto/);
  assert.match(sent[0].text, /Ricevuto dal server il: \d{4}-\d{2}-\d{2}T/);
});
test('JSON errato, campi mancanti e honeypot non inviano né generano un Lead', async () => {
  const { post, sent, events } = setup();
  for (const value of [null, [], 'string']) assert.equal((await post(value)).status, 400);
  for (const field of ['name', 'company', 'phone', 'activity']) assert.equal((await post({ ...valid, [field]: '' })).status, 422);
  assert.equal((await post({ ...valid, phone: 'abc' })).status, 422);
  const bot = await (await post({ ...valid, website: 'spam' })).json();
  assert.equal(bot.accepted, false);
  assert.equal(bot.eventId, undefined);
  assert.equal(sent.length, 0);
  assert.equal(events.length, 0);
});
test('SMTP assente o fallito: nessun falso successo né conversione', async () => {
  for (const [configured, fail, status] of [[false, false, 503], [true, true, 502]]) {
    const { post, events } = setup(configured, fail);
    const response = await post(valid);
    assert.equal(response.status, status);
    assert.equal((await response.json()).eventId, undefined);
    assert.equal(events.length, 0);
  }
});
test('guasto Meta successivo a SMTP non trasforma una richiesta ricevuta in errore', async () => {
  const { post, sent } = setup(true, false, true);
  assert.equal((await post(valid)).status, 200);
  assert.equal(sent.length, 1);
});

const metaEnv = { NEXT_PUBLIC_META_PIXEL_ID: '123456', META_CONVERSIONS_ACCESS_TOKEN: 'test-secret', META_GRAPH_API_VERSION: 'v25.0' };
function metaSetup(env = metaEnv, failure = false) {
  const calls = [];
  const meta = compile('../lib/meta.ts', {}, env, { URL, AbortSignal, fetch: async (url, options) => { calls.push({ url, ...options }); if (failure) throw Error('offline'); return { ok: true }; } });
  return { calls, send: (consent, cookie = '') => meta.sendMetaLead({ request: new Request('https://acceleriamo.it/api/contact', { headers: { cookie } }), body: { ...valid, email: 'TEST@example.test', marketingConsent: consent }, eventId: 'shared-event-id' }) };
}
test('Conversion API bloccata senza doppia evidenza di consenso o configurazione', async () => {
  const { send, calls } = metaSetup();
  await send(false, 'acceleriamo_marketing=accepted');
  await send(true);
  await send(true, 'acceleriamo_marketing=rejected');
  assert.equal(calls.length, 0);
  const missing = metaSetup({});
  await missing.send(true, 'acceleriamo_marketing=accepted');
  assert.equal(missing.calls.length, 0);
});
test('Conversion API con consenso usa hash e ID condiviso senza token in URL', async () => {
  const { send, calls } = metaSetup();
  await send(true, 'acceleriamo_marketing=accepted');
  assert.equal(calls.length, 1);
  const { data } = JSON.parse(calls[0].body);
  assert.equal(data[0].event_name, 'Lead');
  assert.equal(data[0].event_id, 'shared-event-id');
  assert.match(data[0].user_data.em[0], /^[a-f0-9]{64}$/);
  assert.match(data[0].user_data.ph[0], /^[a-f0-9]{64}$/);
  assert.ok(!calls[0].body.includes('TEST@example.test'));
  assert.ok(!calls[0].url.includes('test-secret'));
});
test('Conversion API assorbe un errore di rete', async () => {
  await assert.doesNotReject(metaSetup(metaEnv, true).send(true, 'acceleriamo_marketing=accepted'));
});
