import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { randomUUID } from 'node:crypto';
function setup(cookie = '', pixelId = '123456') {
 const scripts=[], events=[];
 const document={cookie,createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
 const location={search:'?utm_source=instagram&utm_campaign=officine&settore=officine',protocol:'https:',hostname:'acceleriamo.it'};
 const window={dispatchEvent:e=>events.push(e.type)};
 const exports={};
 const source=ts.transpileModule(readFileSync(new URL('../lib/tracking.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(source,{exports,process:{env:{NEXT_PUBLIC_META_PIXEL_ID:pixelId}},window,document,location,URLSearchParams,crypto:{randomUUID},Event});
 return {tracking:exports,window,document,scripts,events};
}
test('nessun pixel, Lead o WhatsApp senza consenso o ID',()=>{
 for(const [cookie,id] of [['','123456'],['acceleriamo_marketing=rejected','123456'],['acceleriamo_marketing=accepted','']]) {
  const {tracking,scripts,window}=setup(cookie,id);
  tracking.startPixel();tracking.trackLead('id');tracking.trackWhatsApp('fisso');
  assert.equal(scripts.length,0);assert.equal(window.fbq,undefined);
 }
});
test('consenso carica una sola volta e conta il medesimo Lead una sola volta',()=>{
 const {tracking,scripts,window}=setup('acceleriamo_marketing=accepted');
 tracking.startPixel();tracking.startPixel();tracking.trackLead('same-id');tracking.trackLead('same-id');tracking.trackWhatsApp('fisso');
 assert.equal(scripts.length,1);
 const queue=window.fbq.queue;
 const leads=queue.filter(args=>args[1]==='Lead');assert.equal(leads.length,1);assert.equal(leads[0][3].eventID,'same-id');
 assert.ok(queue.findIndex(args=>args[1]==='autoConfig')<queue.findIndex(args=>args[0]==='init'));
 assert.equal(queue.find(args=>args[1]==='WhatsAppClick')[2].placement,'fisso');
});
test('UTM nel modulo anche senza consenso, identificatori Meta esclusi',()=>{
 const {tracking}=setup('_fbp=fb.1.123.456');
 const data=tracking.contactAttribution();assert.equal(data.utm_campaign,'officine');assert.equal(data.sector,'officine');assert.equal(data.marketingConsent,false);assert.equal(data.fbp,undefined);
});
test('revoca invia il comando e aggiorna le preferenze',()=>{
 const {tracking,window,events}=setup('acceleriamo_marketing=accepted');tracking.startPixel();tracking.setMarketingConsent(false);
 assert.ok(window.fbq.queue.some(args=>args[0]==='consent'&&args[1]==='revoke'));assert.ok(events.includes('marketing-consent-change'));
});
