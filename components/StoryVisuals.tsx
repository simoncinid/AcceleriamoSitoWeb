import { MotionScene } from "./MotionScene";
import { Icon } from "./Icons";
import styles from "./StoryVisuals.module.css";

export type ArtKind =
  | "email" | "document" | "database" | "person" | "observe" | "map" | "simplify" | "software"
  | "inbox" | "duplicate" | "waiting" | "scattered"
  | "quote" | "invoice" | "operations" | "support"
  | "autoFlow" | "aiExtract" | "approval" | "customApp";
export function StoryArt({ kind, at, className = "" }: { kind: ArtKind; at?: number; className?: string }) {
  return <span aria-hidden="true" className={`${styles.art} ${styles[kind]} ${className}`} data-motion={at === undefined ? undefined : "pop"} data-at={at} />;
}

function Link({ at = 1 }: { at?: number }) {
  return <span className={styles.link} aria-hidden="true" data-motion="draw" data-at={at}><span data-motion="travel" data-at={at + .1} /><Icon name="arrow" size={15} /></span>;
}

export function HeroStory() {
  return <div className={styles.heroStage}>
    <div className={styles.sceneEyebrow}><span /> Cosa succede senza che nessuno ribatta niente</div>
    <ol className={styles.heroNodes} aria-label="Dall’email del cliente alla bozza di preventivo nel gestionale">
      {[{ icon: "inbox", title: "Arriva l’email", detail: "30 codici e quantità" }, { icon: "aiExtract", title: "Il software legge i codici", detail: "e cerca il listino giusto" }, { icon: "database", title: "La bozza è nel gestionale", detail: "coi prezzi di quel cliente" }].map((step, i) => <li key={step.title}>
        <div className={styles.heroObject} data-motion="rise" data-at={.2 + i * 1.5}><StoryArt kind={step.icon as ArtKind} at={.4 + i * 1.5} /></div>
        <strong data-motion="reveal" data-at={.4 + i * 1.5}>{step.title}</strong><small data-motion="reveal" data-at={.5 + i * 1.5}>{step.detail}</small>
        {i < 2 && <Link at={1.1 + i * 1.5} />}
      </li>)}
    </ol>
    <div className={styles.heroReview} data-motion="rise" data-at={4.8}><StoryArt kind="person" at={5} /><div><small>Il tuo commerciale</small><strong>Controlla il prezzo e invia.</strong></div><span className={styles.check} data-motion="pop" data-at={5.5}><Icon name="check" size={18} /></span></div>
  </div>;
}

export function MethodVisual() {
  return <div className={styles.methodStage} data-motion-viewport>
    <div className={styles.sceneEyebrow}><span /> Dal primo incontro all’assistenza di tutti i giorni</div>
    <ol className={styles.methodNodes} aria-label="Guardiamo, scegliamo cosa conviene, costruiamo, restiamo raggiungibili">
      {[["observe", "Guardiamo"], ["map", "Scegliamo"], ["simplify", "Costruiamo"], ["software", "Restiamo"]].map(([icon, title], i) => <li key={icon}>
        <div data-motion="rise" data-at={.2 + i * 1.5}><StoryArt kind={icon as ArtKind} at={.4 + i * 1.5} /></div>
        <small data-motion="reveal" data-at={.6 + i * 1.5}>{title}</small>
        {i < 3 && <Link at={1.1 + i * 1.5} />}
      </li>)}
    </ol>
    <div className={styles.result} data-motion="rise" data-at={6}><Icon name="check" size={18} /><span>Dopo la consegna rispondiamo noi.</span></div>
  </div>;
}

export function ServiceVisual({ type }: { type: "automation" | "ai" | "software" }) {
  return <MotionScene className={`${styles.serviceStage} ${type === "ai" ? styles.dark : ""}`} label={{ automation: "Dall’email al gestionale, senza ribattere niente", ai: "Il software legge i dati di una fattura", software: "Una schermata con lo stato dei lavori" }[type]}>
    {type === "automation" && <>
      <div className={styles.serviceObjects}>
        {(["email", "autoFlow", "database"] as const).map((kind, i) => <div key={kind} className={styles.serviceObject}><StoryArt kind={kind} at={.3 + i * 1.4} />{i < 2 && <Link at={1 + i * 1.4} />}</div>)}
      </div>
      <div className={styles.serviceRows}><div data-motion="rise" data-at={.5}><span>Arriva un ordine via email</span><Icon name="inbox" size={15} /></div><div data-motion="rise" data-at={2.1}><span>Il software copia codici e quantità</span><Icon name="check" size={15} /></div><div data-motion="rise" data-at={3.8}><span>L’ordine è nel gestionale</span><Icon name="check" size={15} /></div></div>
    </>}
    {type === "ai" && <>
      <div className={styles.aiWorkspace}>
        <div className={styles.scanDocument}><StoryArt kind="document" at={.2} /><span className={styles.scan} aria-hidden="true" data-motion="scan" data-at={1} /></div>
        <div className={styles.extracted}><small data-motion="reveal" data-at={.3}>Cosa ha letto</small>{["Fornitore", "Importo", "Scadenza"].map((label, i) => <div key={label} data-motion="rise" data-at={1.7 + i * .6}><span>{label}</span><Icon name="check" size={13} /></div>)}</div>
      </div>
      <div className={styles.serviceResult} data-motion="rise" data-at={4}><Icon name="person" size={17} /> Segnala solo le righe che non tornano</div>
    </>}
    {type === "software" && <>
      <div className={styles.softwareArt}><StoryArt kind="customApp" at={.2} /></div>
      <div className={styles.miniApp} data-motion="rise" data-at={1}>
        <div className={styles.miniAppTop}><span /><span /><span /><strong>I tuoi lavori</strong></div>
        <div className={styles.appModules}>{["Da avviare", "In corso", "Pronti"].map((label, i) => <div key={label} data-motion="rise" data-at={1.8 + i * .8}><span>{label}</span><i /><i /><b data-motion="draw" data-at={2.4 + i * .8} /></div>)}</div>
      </div>
      <div className={styles.softwareNote} data-motion="reveal" data-at={4.4}>Chi risponde al telefono guarda qui e risponde subito.</div>
    </>}
  </MotionScene>;
}

export function HumanVisual() {
  return <MotionScene className={`${styles.humanStage} ${styles.dark}`} label="Le righe che non tornano arrivano a chi deve controllarle">
    <div className={styles.sceneEyebrow}><span /> Esempio: la fattura di un fornitore</div>
    <div className={styles.humanPair}>
      <div className={styles.humanNode} data-motion="rise" data-at={.3}><StoryArt kind="approval" at={.5} /><small>Importo corretto</small><strong className="accent">Passa</strong><span className={styles.dataChip} data-motion="rise" data-at={1.4}>Fornitore trovato <Icon name="check" size={13} /></span><span className={styles.dataChip} data-motion="rise" data-at={2.2}>Importo uguale all’ordine <Icon name="check" size={13} /></span></div>
      <Link at={3.2} />
      <div className={`${styles.humanNode} ${styles.personNode}`} data-motion="rise" data-at={4}><StoryArt kind="person" at={4.2} /><small>Importo diverso</small><strong className="accent">Si&nbsp;ferma</strong><span className={styles.decision} data-motion="pop" data-at={5}><Icon name="shield" size={17} /> Ti mostra ordine e fattura</span></div>
    </div>
    <p className={styles.humanNote} data-motion="reveal" data-at={5.5}>L’amministrazione vede la differenza<br />prima di pagare, non dopo.</p>
  </MotionScene>;
}

export function IntegrationsVisual() {
  return <MotionScene className={styles.integrationsStage} label="Gli strumenti che usate già, collegati tra loro">
    <ul className={styles.integrationNodes}>
      {[["email", "Email"], ["duplicate", "Excel"], ["support", "Clienti"], ["software", "Gestionale"], ["document", "Documenti"], ["database", "Magazzino"]].map(([icon, title], i) => <li key={title} data-motion="rise" data-at={.2 + i * .5}><StoryArt kind={icon as ArtKind} at={.35 + i * .5} /><span>{title}</span></li>)}
    </ul>
    <div className={styles.integrationRail} data-motion="draw" data-at={3.2} aria-hidden="true" />
    <div className={styles.integrationHub} data-motion="rise" data-at={4}><StoryArt kind="autoFlow" at={4.2} /><div><small>Un dato scritto una volta sola</small><strong>Arriva dove serve, senza ricopiarlo.</strong></div><span className={styles.check} data-motion="pop" data-at={5}><Icon name="check" size={18} /></span></div>
  </MotionScene>;
}

export function ExampleVisual({ index }: { index: number }) {
  const examples: { kind: ArtKind; title: string; input: string; output: string }[] = [
    { kind: "quote", title: "Bozza di preventivo", input: "Email del cliente e listino di quel cliente", output: "Prezzi e sconti da controllare" },
    { kind: "invoice", title: "Ordine già scritto", input: "Foto, messaggi e note vocali degli agenti", output: "Codici e quantità da confermare" },
    { kind: "map", title: "Giri pronti da assegnare", input: "Clienti, zone, orari e tecnici disponibili", output: "Il giro di domani, rifatto se salta un appuntamento" },
    { kind: "operations", title: "Stato del lavoro", input: "Interventi fatti, ricambi in arrivo e ore spese", output: "Una schermata da guardare mentre sei al telefono" },
    { kind: "support", title: "Agenda aggiornata", input: "Prenotazioni, disdette e urgenze", output: "Posti riassegnati e orari da confermare" },
  ];
  const example = examples[index];
  return <MotionScene className={styles.exampleStage} label={["Esempio per il commercio all’ingrosso", "Esempio per aziende con agenti di commercio", "Esempio di giri per aziende di manutenzione", "Esempio di stato dei lavori per l’assistenza tecnica", "Esempio di agenda per servizi su appuntamento"][index]}>
    <div className={styles.exampleFocus} data-motion="rise" data-at=".2">
      <StoryArt kind={example.kind} at={.4} />
      <div><small>Cosa ottieni</small><strong>{example.title}</strong></div>
    </div>
    <dl className={styles.exampleFacts}>
      <div data-motion="rise" data-at="1.2"><dt>Parte da</dt><dd>{example.input}</dd></div>
      <div data-motion="rise" data-at="2"><dt>Diventa</dt><dd>{example.output}</dd></div>
    </dl>
  </MotionScene>;
}

export function ProblemVisual({ type, label }: { type: "inbox" | "duplicate" | "waiting" | "scattered"; label: string }) {
  return <MotionScene className={styles.problemStage} label={label}>
    <div className={styles.problemArtwork} data-motion="rise" data-at={.25}><StoryArt kind={type} at={.45} /></div>
    <span className={styles.problemPulse} data-motion="draw" data-at={1.3} aria-hidden="true" />
  </MotionScene>;
}
