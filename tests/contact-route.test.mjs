import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
function compile(file, dependencies = {}, env = {}) {
  const source = ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, { exports, require: (name) => dependencies[name] ?? require(name), process: { env }, Date });
  return exports;
}
const legal = compile('../lib/legal.ts');
function setup(configured = true, fail = false) {
  const sent = [];
  const route = compile('../app/api/contact/route.ts', {
    '@/lib/legal': legal,
    nodemailer: { createTransport: () => ({ sendMail: async (mail) => { if (fail) throw Error('SMTP'); sent.push(mail); } }) },
  }, configured ? { GMAIL_FROM_ADDRESS: 'from@example.test', GMAIL_TO_ADDRESS: 'to@example.test', GMAIL_APP_PASSWORD: 'mock' } : {});
  return { sent, post: (body) => route.POST(new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })) };
}
const valid = { name: 'Test', company: 'Test Srl', email: 'test@example.test', activity: 'Preventivi', currentProcess: 'Excel', privacy: 'accepted', terms: 'accepted', legalVersion: legal.LEGAL_VERSION };
test('rifiuta ciascuna dichiarazione assente o falsificata senza inviare email', async () => {
  const { post, sent } = setup();
  for (const field of ['privacy', 'terms']) {
    for (const value of [undefined, false, true, 'on', 'rejected']) {
      assert.equal((await post({ ...valid, [field]: value })).status, 422);
    }
  }
  assert.equal(sent.length, 0);
});
test('rifiuta versioni mancanti o obsolete', async () => {
  const { post, sent } = setup();
  for (const legalVersion of [undefined, '2020-01-01']) assert.equal((await post({ ...valid, legalVersion })).status, 409);
  assert.equal(sent.length, 0);
});
test('invio valido registra versione, dichiarazioni e data server con SMTP simulato', async () => {
  const { post, sent } = setup();
  assert.equal((await post(valid)).status, 200);
  assert.equal(sent.length, 1);
  assert.ok(sent[0].text.includes(legal.LEGAL_VERSION));
  assert.ok(sent[0].text.includes(legal.PRIVACY_ACKNOWLEDGEMENT));
  assert.ok(sent[0].text.includes(legal.TERMS_ACKNOWLEDGEMENT));
  assert.match(sent[0].text, /Ricevuto dal server il: \d{4}-\d{2}-\d{2}T/);
});
test('JSON di tipo errato, campi mancanti e honeypot non inviano', async () => {
  const { post, sent } = setup();
  for (const value of [null, [], 'string']) assert.equal((await post(value)).status, 400);
  assert.equal((await post({ ...valid, email: 'invalid' })).status, 422);
  assert.equal((await post({ ...valid, name: '' })).status, 422);
  assert.equal((await post({ ...valid, website: 'spam' })).status, 200);
  assert.equal(sent.length, 0);
});
test('nessun falso successo quando SMTP manca o fallisce', async () => {
  assert.equal((await setup(false).post(valid)).status, 503);
  assert.equal((await setup(true, true).post(valid)).status, 502);
});
