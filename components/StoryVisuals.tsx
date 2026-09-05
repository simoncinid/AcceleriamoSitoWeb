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
    <div className={styles.sceneEyebrow}><span /> Esempio: un preventivo per un grossista</div>
    <ol className={styles.heroNodes} aria-label="Dalla lista del cliente alla bozza di preventivo">
      {[{ icon: "inbox", title: "Arriva la lista", detail: "Articoli e quantità" }, { icon: "aiExtract", title: "Si leggono i dati", detail: "Codici e quantità" }, { icon: "database", title: "Si prepara la bozza", detail: "Prezzi dal listino" }].map((step, i) => <li key={step.title}>
        <div className={styles.heroObject} data-motion="rise" data-at={.2 + i * 1.5}><StoryArt kind={step.icon as ArtKind} at={.4 + i * 1.5} /></div>
        <strong data-motion="reveal" data-at={.4 + i * 1.5}>{step.title}</strong><small data-motion="reveal" data-at={.5 + i * 1.5}>{step.detail}</small>
        {i < 2 && <Link at={1.1 + i * 1.5} />}
      </li>)}
    </ol>
    <div className={styles.heroReview} data-motion="rise" data-at={4.8}><StoryArt kind="person" at={5} /><div><small>Il commerciale controlla</small><strong>Verifica prezzi e sconti, poi invia.</strong></div><span className={styles.check} data-motion="pop" data-at={5.5}><Icon name="check" size={18} /></span></div>
  </div>;
}

export function MethodVisual() {
  return <div className={styles.methodStage} data-motion-viewport>
    <div className={styles.sceneEyebrow}><span /> Con te, dall’analisi alla manutenzione</div>
    <ol className={styles.methodNodes} aria-label="Consulenza gratuita, proposta, sviluppo e supporto">
      {[["observe", "Consulenza gratuita"], ["map", "Proposta"], ["simplify", "Sviluppo su misura"], ["software", "Supporto nel tempo"]].map(([icon, title], i) => <li key={icon}>
        <div data-motion="rise" data-at={.2 + i * 1.5}><StoryArt kind={icon as ArtKind} at={.4 + i * 1.5} /></div>
        <small data-motion="reveal" data-at={.6 + i * 1.5}>{title}</small>
        {i < 3 && <Link at={1.1 + i * 1.5} />}
      </li>)}
    </ol>
    <div className={styles.result} data-motion="rise" data-at={6}><Icon name="check" size={18} /><span>Ti seguiamo anche dopo la consegna.</span></div>
  </div>;
}

export function ServiceVisual({ type }: { type: "automation" | "ai" | "software" }) {
  return <MotionScene className={`${styles.serviceStage} ${type === "ai" ? styles.dark : ""}`} label={{ automation: "Dall’email al gestionale", ai: "L’AI legge i dati di una fattura", software: "Software per seguire le commesse" }[type]}>
    {type === "automation" && <>
      <div className={styles.serviceObjects}>
        {(["email", "autoFlow", "database"] as const).map((kind, i) => <div key={kind} className={styles.serviceObject}><StoryArt kind={kind} at={.3 + i * 1.4} />{i < 2 && <Link at={1 + i * 1.4} />}</div>)}
      </div>
      <div className={styles.serviceRows}><div data-motion="rise" data-at={.5}><span>Arriva un ordine via email</span><Icon name="inbox" size={15} /></div><div data-motion="rise" data-at={2.1}><span>Codici e quantità si trasferiscono</span><Icon name="check" size={15} /></div><div data-motion="rise" data-at={3.8}><span>Il gestionale si aggiorna</span><Icon name="check" size={15} /></div></div>
    </>}
    {type === "ai" && <>
      <div className={styles.aiWorkspace}>
        <div className={styles.scanDocument}><StoryArt kind="document" at={.2} /><span className={styles.scan} aria-hidden="true" data-motion="scan" data-at={1} /></div>
        <div className={styles.extracted}><small data-motion="reveal" data-at={.3}>Campi riconosciuti</small>{["Fornitore", "Importo", "Scadenza"].map((label, i) => <div key={label} data-motion="rise" data-at={1.7 + i * .6}><span>{label}</span><Icon name="check" size={13} /></div>)}</div>
      </div>
      <div className={styles.serviceResult} data-motion="rise" data-at={4}><Icon name="person" size={17} /> Un dato dubbio viene segnalato</div>
    </>}
    {type === "software" && <>
      <div className={styles.softwareArt}><StoryArt kind="customApp" at={.2} /></div>
      <div className={styles.miniApp} data-motion="rise" data-at={1}>
        <div className={styles.miniAppTop}><span /><span /><span /><strong>Le tue commesse</strong></div>
        <div className={styles.appModules}>{["Da avviare", "In corso", "Pronte"].map((label, i) => <div key={label} data-motion="rise" data-at={1.8 + i * .8}><span>{label}</span><i /><i /><b data-motion="draw" data-at={2.4 + i * .8} /></div>)}</div>
      </div>
      <div className={styles.softwareNote} data-motion="reveal" data-at={4.4}>Vedi cosa è pronto e cosa manca per consegnare.</div>
    </>}
  </MotionScene>;
}

export function HumanVisual() {
  return <MotionScene className={`${styles.humanStage} ${styles.dark}`} label="I dati dubbi arrivano a chi deve controllarli">
    <div className={styles.sceneEyebrow}><span /> Esempio: controllo di una fattura</div>
    <div className={styles.humanPair}>
      <div className={styles.humanNode} data-motion="rise" data-at={.3}><StoryArt kind="approval" at={.5} /><small>Importo corretto</small><strong className="accent">Verificato</strong><span className={styles.dataChip} data-motion="rise" data-at={1.4}>Fornitore trovato <Icon name="check" size={13} /></span><span className={styles.dataChip} data-motion="rise" data-at={2.2}>Importo come l’ordine <Icon name="check" size={13} /></span></div>
      <Link at={3.2} />
      <div className={`${styles.humanNode} ${styles.personNode}`} data-motion="rise" data-at={4}><StoryArt kind="person" at={4.2} /><small>Importo diverso</small><strong className="accent">Da&nbsp;controllare</strong><span className={styles.decision} data-motion="pop" data-at={5}><Icon name="shield" size={17} /> Confronto con l’ordine</span></div>
    </div>
    <p className={styles.humanNote} data-motion="reveal" data-at={5.5}>L’amministrazione vede la differenza<br />e la verifica prima di pagare.</p>
  </MotionScene>;
}

export function IntegrationsVisual() {
  return <MotionScene className={styles.integrationsStage} label="Collegamenti tra gli strumenti aziendali">
    <ul className={styles.integrationNodes}>
      {[["email", "Email"], ["duplicate", "Fogli di calcolo"], ["support", "Rubrica clienti"], ["software", "Gestionali"], ["document", "Documenti"], ["database", "Archivi dati"]].map(([icon, title], i) => <li key={title} data-motion="rise" data-at={.2 + i * .5}><StoryArt kind={icon as ArtKind} at={.35 + i * .5} /><span>{title}</span></li>)}
    </ul>
    <div className={styles.integrationRail} data-motion="draw" data-at={3.2} aria-hidden="true" />
    <div className={styles.integrationHub} data-motion="rise" data-at={4}><StoryArt kind="autoFlow" at={4.2} /><div><small>Meno copie manuali</small><strong>Lo stesso dato nei programmi collegati.</strong></div><span className={styles.check} data-motion="pop" data-at={5}><Icon name="check" size={18} /></span></div>
  </MotionScene>;
}

export function ExampleVisual({ index }: { index: number }) {
  const examples: { kind: ArtKind; title: string; input: string; output: string }[] = [
    { kind: "quote", title: "Bozza di preventivo", input: "Lista articoli e listino cliente", output: "Prezzi e sconti da verificare" },
    { kind: "invoice", title: "Fattura da verificare", input: "Fattura, ordine e bolle del cantiere", output: "Quantità o prezzi che non tornano" },
    { kind: "operations", title: "Stato della commessa", input: "Taglio, lavorazione e assemblaggio", output: "Pezzi pronti e lavorazioni ferme" },
    { kind: "map", title: "Giri pronti da assegnare", input: "Clienti, zone, orari e tecnici disponibili", output: "Un programma che può gestire un collaboratore" },
    { kind: "support", title: "Agenda aggiornata", input: "Prenotazioni, disdette e urgenze", output: "Posti riassegnati e nuovi orari da confermare" },
  ];
  const example = examples[index];
  return <MotionScene className={styles.exampleStage} label={["Esempio per grossisti", "Esempio per imprese edili", "Esempio per officine meccaniche", "Esempio di pianificazione dei giri per aziende di manutenzione", "Esempio di gestione appuntamenti per centri gomme"][index]}>
    <div className={styles.exampleFocus} data-motion="rise" data-at=".2">
      <StoryArt kind={example.kind} at={.4} />
      <div><small>Cosa ottieni</small><strong>{example.title}</strong></div>
    </div>
    <dl className={styles.exampleFacts}>
      <div data-motion="rise" data-at="1.2"><dt>Parte da</dt><dd>{example.input}</dd></div>
      <div data-motion="rise" data-at="2"><dt>Ottieni</dt><dd>{example.output}</dd></div>
    </dl>
  </MotionScene>;
}

export function EvidenceVisual() {
  return <section className={styles.evidenceStage} aria-label="Confronto tra gestione manuale e automatizzata">
    <p className={styles.evidenceLabel}>Esempio: preparazione di un preventivo</p>
    <figure className={styles.evidenceBefore}>
      <span className={styles.evidenceArtwork} role="img" aria-label="Richieste, fogli e preventivi gestiti manualmente" />
      <figcaption><small>Prima</small><strong>Manuale</strong><p>X errori <b>·</b> X minuti</p></figcaption>
    </figure>
    <figure className={styles.evidenceAfter}>
      <span className={styles.evidenceArtwork} role="img" aria-label="Preventivo preparato automaticamente e verificato" />
      <figcaption><small>Dopo</small><strong>Automatizzato</strong><p>0 errori <b>·</b> Y minuti</p></figcaption>
    </figure>
  </section>;
}

export function ProblemVisual({ type, label }: { type: "inbox" | "duplicate" | "waiting" | "scattered"; label: string }) {
  return <MotionScene className={styles.problemStage} label={label}>
    <div className={styles.problemArtwork} data-motion="rise" data-at={.25}><StoryArt kind={type} at={.45} /></div>
    <span className={styles.problemPulse} data-motion="draw" data-at={1.3} aria-hidden="true" />
  </MotionScene>;
}
