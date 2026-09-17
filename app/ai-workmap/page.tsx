import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WorkMapCTA } from "@/components/workmap/CTA";
import { JsonLd } from "@/components/JsonLd";
import { product } from "@/lib/workmap/config";
import { absoluteUrl } from "@/lib/site";
const description = `Scopri dove l’AI può aiutarti nel lavoro di ogni giorno. Analisi iniziale gratuita, workflow personali e piano 30 giorni. ${product.priceLabel} una tantum, IVA inclusa.`;
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
    "Un manuale operativo personale costruito partendo dal tuo lavoro: procedure, prompt, assistenti AI e un piano per applicarli.",
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
    "Quanto costa? È un abbonamento?",
    `${product.priceLabel} IVA inclusa, con pagamento una tantum. L’analisi iniziale è gratuita e non richiede una carta.`,
  ],
  [
    "Posso inserire qualsiasi lavoro?",
    "Sì. Puoi scrivere liberamente la tua professione. Per attività ad alto rischio, l’AI viene proposta come supporto organizzativo e documentale, con revisione professionale.",
  ],
  [
    "Cosa succede dopo l’acquisto?",
    "Riprendi la stessa conversazione per le ultime informazioni. Poi generiamo e controlliamo la WorkMap, disponibile in PDF e in una pagina privata. Ricevi il collegamento via email.",
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
                Quali parti del tuo lavoro stai ancora facendo <em>a mano?</em>
              </h1>
              <p className="wm-lead">
                Parla per pochi minuti con il nostro assistente AI. Analizzerà
                quello che fai ogni giorno e individuerà dove l’intelligenza
                artificiale può esserti realmente utile.
              </p>
              <WorkMapCTA />
              <p className="wm-micro">
                Analisi iniziale gratuita. Nessuna carta richiesta.
              </p>
              <p className="wm-price-note">
                La WorkMap completa:{" "}
                <strong>{product.priceLabel} IVA inclusa</strong>. Una volta
                sola.
              </p>
            </div>
            <div
              className="wm-preview"
              aria-label="Esempio illustrativo di una WorkMap commerciale"
            >
              <div className="wm-preview-top">
                <span className="eyebrow">AI WORKMAP</span>
                <span className="wm-tag">Esempio di risultato</span>
              </div>
              <p className="wm-micro">PREPARATA PER</p>
              <h2>Marco Rossi</h2>
              <p>Responsabile commerciale</p>
              <div className="wm-preview-counts">
                <span>
                  <strong>12</strong>workflow personali
                </span>
                <span>
                  <strong>3</strong>assistenti AI
                </span>
                <span>
                  <strong>30</strong>giorni per iniziare
                </span>
              </div>
              <div className="wm-paper">
                <p className="eyebrow">LA TUA PRIMA PRIORITÀ</p>
                <h3>
                  Da aggiornamenti sparsi
                  <br />a un report chiaro.
                </h3>
                <p>
                  Email degli agenti → struttura comune → sintesi per la
                  direzione.
                </p>
                <div className="wm-pill-row">
                  <span>Priorità alta</span>
                  <span>Controllo umano</span>
                </div>
              </div>
              <p className="wm-micro">
                Procedure, prompt e controlli. Selezionati per il tuo lavoro.
              </p>
            </div>
          </div>
        </section>
        <section className="section wm-soft">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">IL PUNTO DI PARTENZA</p>
              <h2>
                ChatGPT sa fare tante cose.
                <br />
                Il problema è capire quali servono a te.
              </h2>
              <p>
                AI WorkMap parte dal tuo lavoro reale. Analizza attività,
                strumenti e problemi quotidiani e seleziona le applicazioni AI
                con maggiore utilità per il tuo profilo.
              </p>
            </div>
            <div className="wm-pill-row wm-topics">
              {[
                "Email",
                "Preventivi",
                "PDF",
                "Report",
                "Riunioni",
                "Ricerca",
                "Excel",
                "Follow-up",
                "CRM",
                "Presentazioni",
                "Documenti",
                "Clienti",
                "Analisi",
                "Procedure",
                "Contenuti",
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">COME FUNZIONA</p>
              <h2>
                Dal tuo lavoro.
                <br />
                Al tuo prossimo passo.
              </h2>
            </div>
            <div className="wm-three">
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
                  "Se scegli di acquistarla, approfondiamo il profilo e prepariamo PDF, prompt e piano 30 giorni.",
                ],
              ].map(([n, t, d]) => (
                <article className="wm-card" key={n}>
                  <span className="wm-number">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
            <div className="wm-section-cta">
              <WorkMapCTA />
            </div>
          </div>
        </section>
        <section className="section wm-soft">
          <div className="container wm-grid">
            <div className="section-heading">
              <p className="eyebrow">UN ESEMPIO CONCRETO</p>
              <h2>
                Gestisci clienti.
                <br />
                Offerte. E una rete di agenti.
              </h2>
              <p>
                Se perdi tempo tra follow-up, report e aggiornamenti sparsi, la
                tua WorkMap parte da lì.
              </p>
              <p className="wm-micro">
                Esempio illustrativo per un responsabile commerciale.
              </p>
            </div>
            <div className="wm-card wm-example">
              <span className="wm-tag">Responsabile commerciale</span>
              <h3>Le opportunità da mettere in ordine.</h3>
              {[
                "Preparazione appuntamenti",
                "Bozze di follow-up clienti",
                "Sintesi dei report agenti",
                "Prima bozza delle offerte",
                "Analisi delle note CRM",
                "Preparazione riunioni",
              ].map((t, i) => (
                <p className="wm-example-row" key={t}>
                  <span className="accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t}
                </p>
              ))}
              <p className="wm-micro">L’AI prepara. Tu verifichi e decidi.</p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container wm-grid">
            <div className="section-heading">
              <p className="eyebrow">CONTA IL TUO CONTESTO</p>
              <h2>
                Stessa professione.
                <br />
                WorkMap diversa.
              </h2>
              <p>
                Il ruolo è solo l’inizio. Sono le attività, gli strumenti e le
                difficoltà quotidiane a definire le priorità.
              </p>
            </div>
            <div className="wm-two">
              {[
                ["Commercialista A", "Email clienti", "Circolari", "Documenti"],
                ["Commercialista B", "Excel", "Report", "Riunioni"],
              ].map(([t, ...items]) => (
                <article className="wm-card" key={t}>
                  <h3>{t}</h3>
                  <p className="wm-micro">Esempio di priorità</p>
                  {items.map((i) => (
                    <p key={i}>{i}</p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section wm-dark">
          <div className="container wm-grid">
            <div>
              <p className="eyebrow eyebrow--light">
                IL VALORE È NELLA SELEZIONE
              </p>
              <h2>Perché non basta chiedere a ChatGPT?</h2>
              <p className="wm-lead">
                Puoi farlo. Il problema è sapere cosa chiedere, quali attività
                hanno senso, come strutturare il processo e come controllare il
                risultato.
              </p>
              <p>
                AI WorkMap parte dal tuo lavoro e costruisce una sequenza già
                organizzata.
              </p>
            </div>
            <div className="wm-offer">
              <p className="eyebrow eyebrow--light">AI WORKMAP COMPLETA</p>
              <h3>
                Una mappa.
                <br />
                Il tuo modo di lavorare.
              </h3>
              <ul>
                <li>10–15 workflow selezionati per te</li>
                <li>Prompt Master e prompt di revisione</li>
                <li>3 assistenti AI con istruzioni copiabili</li>
                <li>Procedure, strumenti e checklist</li>
                <li>Privacy e piano di applicazione 30 giorni</li>
                <li>Documento PDF e versione web privata</li>
              </ul>
              <p className="wm-price">
                {product.priceLabel} <small>IVA inclusa</small>
              </p>
              <p>Pagamento una tantum. Nessun abbonamento.</p>
              <WorkMapCTA />
              {product.guarantee && <p>{product.guarantee}</p>}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container wm-faq">
            <div className="section-heading">
              <p className="eyebrow">DOMANDE FREQUENTI</p>
              <h2>Prima di cominciare.</h2>
            </div>
            {faq.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="section wm-final">
          <div className="container">
            <h2>
              Non devi imparare tutto sull’AI.
              <br />
              Devi capire cosa può fare
              <br />
              per il tuo lavoro.
            </h2>
            <WorkMapCTA />
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
