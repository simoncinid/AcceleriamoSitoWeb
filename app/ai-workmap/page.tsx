import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceCarousel } from "@/components/ServiceCarousel";
import { PdfPreview } from "@/components/workmap/PdfPreview";
import { WorkMapCTA } from "@/components/workmap/CTA";
import { JsonLd } from "@/components/JsonLd";
import { product } from "@/lib/workmap/config";
import { absoluteUrl } from "@/lib/site";
const description = `Scopri dove l’AI può aiutarti nel lavoro di ogni giorno. Analisi completa gratuita, workflow personali e piano 30 giorni. Ricevi il PDF via email.`;
export const metadata: Metadata = {
  title: "AI WorkMap · L’AI applicata al tuo lavoro",
  description,
  alternates: {
    canonical: "/ai-workmap",
    languages: { "it-IT": "/ai-workmap", "x-default": "/ai-workmap" },
  },
  openGraph: {
    title: "Quali parti del tuo lavoro stai ancora facendo a mano?",
    description,
    url: "/ai-workmap",
  },
};
const faq = [
  [
    "Cos’è AI WorkMap?",
    "Una guida operativa personale con le cinque applicazioni AI più utili per il tuo lavoro, prompt pronti e un piano per provarle.",
  ],
  [
    "È un corso o un ebook?",
    "Non è un corso. Ricevi un documento e una versione web; il contenuto cambia in base al tuo profilo, alle tue attività e ai tuoi vincoli.",
  ],
  [
    "Ricevo prompt?",
    "Sì, inseriti dentro procedure complete, con input, output atteso e controlli da fare prima di usarli.",
  ],
  [
    "Devo conoscere già l’AI?",
    "No. La WorkMap tiene conto della tua esperienza e indica da dove cominciare.",
  ],
  [
    "Quali strumenti vengono considerati?",
    "ChatGPT, Claude, Gemini e gli strumenti pertinenti al tuo contesto. I suggerimenti rispettano i vincoli che ci indichi.",
  ],
  [
    "Devo avere abbonamenti?",
    "Molte procedure possono essere svolte anche con piani gratuiti. Prima di usare una funzione, verifica disponibilità e condizioni sul sito del fornitore.",
  ],
  [
    "Quanto dura l’analisi iniziale?",
    "Circa 90 secondi per raccontarci le informazioni essenziali. Puoi rispondere con pulsanti o poche parole.",
  ],
  [
    "L’analisi completa è gratuita?",
    `Sì, tutta l’analisi è gratuita. Ricevi la WorkMap completa in PDF via email.`,
  ],
  [
    "Posso inserire qualsiasi lavoro?",
    "Sì. Puoi scrivere liberamente la tua professione. Per attività ad alto rischio, l’AI viene proposta come supporto organizzativo e documentale, con revisione professionale.",
  ],
  [
    "Come ricevo la mia analisi?",
    "Dopo le ultime domande generiamo e controlliamo la WorkMap. Ricevi il PDF personalizzato in allegato via email.",
  ],
];
export default function WorkMap() {
  return (
    <>
      <Header workmap />
      <main id="contenuto" className="wm-landing">
        <section className="section wm-hero">
          <div className="container wm-grid">
            <div>
              <p className="eyebrow">
                <span className="signal-square" />
                AI WORKMAP · IL TUO LAVORO, IN PRATICA
              </p>
              <h1>
                Quali parti del tuo lavoro
                <br />
                stai ancora facendo{" "}
                <br className="wm-hero-last" />
                <em>a mano?</em>
              </h1>
              <p className="wm-lead">
                Racconti il tuo lavoro. Ti consegniamo un documento con prompt e
                procedure per usare ChatGPT e Claude nella tua professione.
              </p>
              <div className="button-row">
                <WorkMapCTA />
              </div>
            </div>
            <PdfPreview
              page={4}
              title="Dalle email degli agenti al report settimanale."
              result="Ottieni una tabella con risultati, problemi e prossime azioni."
              input="Incolla gli aggiornamenti degli agenti, senza nomi o dati riservati."
              prompt="Riassumi questi aggiornamenti in una tabella: agente, risultati, problemi, prossima azione. Usa solo i dati presenti. Se manca qualcosa, scrivi ‘da verificare’."
              check="Confronta numeri e scadenze con le email originali."
            />
          </div>
        </section>
        <section className="section wm-soft">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">IL PUNTO DI PARTENZA</p>
              <h2>
                ChatGPT sa fare tante cose.{" "}
                <br />
                Il problema è capire{" "}
                <span className="accent">quali servono a te.</span>
              </h2>
              <p>
                AI WorkMap parte dal tuo lavoro reale. Analizza attività,
                strumenti e problemi quotidiani e seleziona le applicazioni AI
                con maggiore utilità per il tuo profilo.
              </p>
            </div>
            <div className="wm-pill-row wm-topics">
              {(
                [
                  ["Email", "email"],
                  ["Preventivi", "quote"],
                  ["PDF", "pdf"],
                  ["Report", "report"],
                  ["Riunioni", "meeting"],
                  ["Ricerca", "search"],
                  ["Excel", "excel"],
                  ["Follow-up", "follow"],
                  ["CRM", "crm"],
                  ["Presentazioni", "slides"],
                  ["Documenti", "docs"],
                  ["Clienti", "clients"],
                  ["Analisi", "analysis"],
                  ["Procedure", "process"],
                  ["Contenuti", "content"],
                ] as const
              ).map(([label, topic]) => (
                <span
                  key={label}
                  data-topic={topic}
                  className={
                    topic === "process" || topic === "content"
                      ? "wm-topic-desktop-hide"
                      : undefined
                  }
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">COME FUNZIONA</p>
              <h2>
                Dal tuo lavoro.{" "}
                <br />
                Al tuo <span className="accent">prossimo passo.</span>
              </h2>
            </div>
            <ServiceCarousel className="wm-three" label="Come funziona">
              {[
                [
                  "01",
                  "Raccontaci cosa fai.",
                  "Una conversazione breve, con domande mirate e risposte veloci.",
                ],
                [
                  "02",
                  "L’assistente individua le opportunità.",
                  "Vedi gratis le prime 3 applicazioni e confermi che abbiamo capito il tuo lavoro.",
                ],
                [
                  "03",
                  "Ricevi la tua AI WorkMap personale.",
                  "Approfondiamo il profilo e ti inviamo gratuitamente via email il PDF con prompt e piano 30 giorni.",
                ],
              ].map(([n, t, d]) => (
                <article className="wm-card" key={n}>
                  <span className="wm-number">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </ServiceCarousel>
            <div className="wm-section-cta button-row">
              <WorkMapCTA />
            </div>
          </div>
        </section>
        <section className="section wm-soft">
          <div className="container wm-grid">
            <div className="section-heading">
              <p className="eyebrow">UN ESEMPIO CONCRETO</p>
              <h2>
                Gestisci clienti.{" "}
                <br />
                Offerte.{" "}
                <span className="accent">E una rete di agenti.</span>
              </h2>
              <p className="wm-micro">
                Se perdi tempo tra follow-up, report e aggiornamenti sparsi, la
                tua WorkMap parte da lì.
              </p>
            </div>
            <PdfPreview
              page={5}
              title="Dagli appunti alla mail per il cliente."
              result="Ottieni una bozza da inviare dopo l’appuntamento."
              input="Incolla gli appunti dell’incontro, sostituendo nomi e dati riservati."
              prompt="Scrivi una mail di massimo 100 parole: riepiloga cosa abbiamo concordato e il prossimo passo. Tono cordiale e diretto. Non aggiungere prezzi, date o promesse assenti dagli appunti."
              check="Verifica gli accordi e completa i nomi prima di inviare."
            />
          </div>
        </section>
        <section className="section">
          <div className="container wm-grid">
            <div className="section-heading">
              <p className="eyebrow">STESSO TITOLO, LAVORO DIVERSO</p>
              <h2>
                Due commercialisti.
                <span className="accent wm-title-break">Due documenti diversi.</span>
              </h2>
              <p>
                Non basta dirci la professione. Uno passa le giornate sulle
                email dei clienti. L’altro su Excel, report e chiusure. I prompt
                da copiare in ChatGPT e Claude partono da lì.
              </p>
            </div>
            <div className="wm-two">
              <article className="wm-card wm-compare">
                <span className="wm-tag">Commercialista A</span>
                <h3>Gestisce i clienti</h3>
                <p>Risponde, spiega circolari, prepara documenti.</p>
                <p className="wm-micro">Nella sua WorkMap</p>
                <ul>
                  <li>Bozza di risposta alle email</li>
                  <li>Riassunto di una circolare</li>
                  <li>Prima stesura di un documento</li>
                </ul>
              </article>
              <article className="wm-card wm-compare">
                <span className="wm-tag">Commercialista B</span>
                <h3>Chiude i numeri</h3>
                <p>Vive su fogli, scadenze e riunioni di controllo.</p>
                <p className="wm-micro">Nella sua WorkMap</p>
                <ul>
                  <li>Controllare un foglio Excel</li>
                  <li>Preparare un report</li>
                  <li>Riordinare le note di una riunione</li>
                </ul>
              </article>
            </div>
          </div>
        </section>
        <section className="section wm-dark">
          <div className="container wm-grid">
            <div>
              <p className="eyebrow eyebrow--light">
                IL VALORE È NELLA SELEZIONE
              </p>
              <h2>
                Perché non basta chiedere <span className="accent">a ChatGPT?</span>
              </h2>
              <p className="wm-lead">
                Puoi farlo. Il problema è sapere cosa chiedere, quali attività
                hanno senso, come strutturare il processo e come controllare il
                risultato.
              </p>
              <p className="wm-lead">
                AI WorkMap parte dal tuo lavoro e costruisce una sequenza già
                organizzata.
              </p>
            </div>
            <div className="wm-offer">
              <p className="eyebrow eyebrow--light">AI WORKMAP COMPLETA</p>
              <h3>
                Una mappa.
                <br />
                Il tuo <span className="accent">modo di lavorare.</span>
              </h3>
              <ul>
                <li>5 workflow prioritari selezionati per te</li>
                <li>Prompt Master e prompt di revisione</li>
                <li>2 assistenti AI con istruzioni copiabili</li>
                <li>Procedure, strumenti e checklist</li>
                <li>Privacy e piano di applicazione 30 giorni</li>
                <li>Documento PDF sintetico, entro 15 pagine</li>
              </ul>
              <p className="wm-free">
                Analisi gratuita
              </p>
              <p>Il PDF completo arriva direttamente alla tua email.</p>
              <div className="button-row">
                <WorkMapCTA />
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container wm-faq">
            <div className="section-heading">
              <p className="eyebrow">DOMANDE FREQUENTI</p>
              <h2>
                Prima di <span className="accent">cominciare.</span>
              </h2>
            </div>
            <div className="example-list">
              {faq.map(([q, a]) => (
                <details className="example-item faq-item" key={q}>
                  <summary>
                    <strong className="example-title">{q}</strong>
                    <i aria-hidden="true">+</i>
                  </summary>
                  <div className="example-detail">
                    <p>{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="section wm-final">
          <div className="container">
            <h2>
              Non devi imparare tutto sull’AI.{" "}
              <br />
              Devi capire cosa può fare{" "}
              <br />
              <span className="accent">per il tuo lavoro.</span>
            </h2>
            <div className="button-row">
              <WorkMapCTA />
            </div>
            <p className="wm-micro">
              Inizia gratis. Decidi dopo aver visto le prime opportunità.
            </p>
            <Link className="text-link" href="/ai-workmap/condizioni">
              Condizioni e informazioni sul prodotto
            </Link>
          </div>
        </section>
        <WorkMapCTA sticky />
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description,
          url: absoluteUrl("/ai-workmap"),
          brand: { "@type": "Brand", name: "ACCELERIAMO" },
        }}
      />
    </>
  );
}
