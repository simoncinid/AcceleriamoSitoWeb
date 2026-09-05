import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Header } from "@/components/Header";
import { ProcessComparison } from "@/components/ProcessComparison";
import { ServiceCarousel } from "@/components/ServiceCarousel";
import { HeroProcessDemo } from "@/components/HeroProcessDemo";
import { Icon } from "@/components/Icons";
import { MotionScene, SectionEntrances } from "@/components/MotionScene";
import { MethodVisual, ServiceVisual, HumanVisual, IntegrationsVisual, ExampleVisual, ProblemVisual } from "@/components/StoryVisuals";

const examples = [
  ["Grossisti · Preventivi", "Il cliente chiede 30 articoli. Li ricopiate uno per uno?", "La richiesta arriva via email. Per rispondere servono listino e sconti. La soluzione prepara la bozza. Il commerciale controlla e invia."],
  ["Edilizia · Fatture fornitori", "La fattura torna con il materiale consegnato?", "Fatture, ordini e bolle di cantiere vanno confrontati. La soluzione segnala subito quantità o prezzi diversi."],
  ["Officine meccaniche · Commesse", "Il cliente chiede quando consegnate. Devi chiamare tre reparti?", "Per rispondere bisogna chiedere a taglio, lavorazione e assemblaggio. Una schermata mostra cosa è pronto, fermo o mancante."],
  ["Manutenzioni · Giri operatori", "Ogni sera prepari i giri di domani. E se potessi delegare?", "Zone, orari e competenze sono spesso solo nella testa del titolare. Il pianificatore propone i giri e gestisce assenze e urgenze."],
  ["Centri gomme · Appuntamenti", "Una disdetta, un’urgenza. Chi rimette in ordine l’agenda?", "Tra disdette e forature urgenti, il telefono interrompe il lavoro. Il calendario libera posti, propone nuovi orari e gestisce le urgenze."],
];

export default function Home() {
  return (
    <>
      <Header />
      <SectionEntrances />
      <main id="contenuto">
        <section className="hero" id="top">
          <div className="container hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">Soluzioni su misura per le PMI italiane</p>
              <h1><span>Meno ore perse.</span>{" "}<br /><em>Più tempo</em>{" "}<br /><span>per la tua azienda.</span></h1>
              <p>Riduci il lavoro ripetitivo. Analizziamo il caso, sviluppiamo la soluzione e ti seguiamo nel tempo.</p>
              <div className="button-row">
                <a className="button button--primary" href="#contatti">Richiedi una consulenza gratuita <Icon name="arrow" size={19} /></a>
              </div>
            </div>
            <HeroProcessDemo />
          </div>
        </section>

        <section className="section problem-section" id="problemi">
          <div className="container">
            <div className="section-heading section-heading--center">
              <p className="eyebrow">Il punto di partenza</p>
              <h2>Quante volte succede <span className="accent">anche nella tua azienda?</span></h2>
              <p>Ordini da riscrivere, ritardi da rincorrere, informazioni da cercare.</p>
            </div>
            <ServiceCarousel className="problem-grid" label="Problemi quotidiani nelle PMI" variant="story">
              <article className="editorial-card">
                <div className="editorial-card__copy">
                  <span className="signal-square" />
                  <p className="card-kicker">Lavoro ripetitivo</p>
                  <h3>Il cliente aspetta ancora il preventivo.</h3>
                  <p>Tra allegati, listino e sconti, il cliente aspetta una risposta.</p>
                </div>
                <div className="editorial-card__visual"><ProblemVisual type="inbox" label="Richieste distribuite in più canali" /></div>
              </article>
              <article className="editorial-card">
                <div className="editorial-card__copy">
                  <span className="signal-square" />
                  <p className="card-kicker">Dati da ricopiare</p>
                  <h3>Lo stesso ordine viene scritto tre volte.</h3>
                  <p>Email, Excel e gestionale: ogni copia richiede tempo e può creare errori.</p>
                </div>
                <div className="editorial-card__visual"><ProblemVisual type="duplicate" label="Dati duplicati tra strumenti" /></div>
              </article>
              <article className="editorial-card">
                <div className="editorial-card__copy">
                  <span className="signal-square" />
                  <p className="card-kicker">Tutto passa dal titolare</p>
                  <h3>Per uno sconto devono chiamare te.</h3>
                  <p>Per decidere devi prima cercare dati, prezzi e condizioni.</p>
                </div>
                <div className="editorial-card__visual"><ProblemVisual type="waiting" label="Decisioni in attesa di approvazione" /></div>
              </article>
              <article className="editorial-card">
                <div className="editorial-card__copy">
                  <span className="signal-square" />
                  <p className="card-kicker">Informazioni difficili da trovare</p>
                  <h3>Chi segue la commessa è assente. E ora?</h3>
                  <p>Aggiornamenti dispersi tra email, fogli e messaggi. Nessuna risposta certa.</p>
                </div>
                <div className="editorial-card__visual"><ProblemVisual type="scattered" label="Informazioni difficili da ritrovare" /></div>
              </article>
            </ServiceCarousel>
          </div>
        </section>

        <section className="section method" id="metodo">
          <div className="container">
            <div className="section-heading method-heading">
              <p className="eyebrow">Come lavoriamo</p>
              <h2>Dalla consulenza gratuita{" "}<br /><span className="accent">al supporto nel tempo.</span></h2>
              <p className="method-heading__note">Ci racconti il problema. Noi analizziamo, proponiamo, sviluppiamo e ti seguiamo.</p>
            </div>
            <MotionScene className="method-layout" label="Le quattro fasi del metodo">
              <ol className="method-grid">
                <li data-motion="focus" data-at="0.2"><span aria-hidden="true">01</span><h3>Consulenza gratuita</h3><p>Guardiamo l’attività e dove si perde tempo.</p></li>
                <li data-motion="focus" data-at="1.7"><span aria-hidden="true">02</span><h3>Proposta di soluzione</h3><p>Soluzione, tempi e costi chiari. Anche con AI, se serve.</p></li>
                <li data-motion="focus" data-at="3.2"><span aria-hidden="true">03</span><h3>Sviluppo su misura</h3><p>La realizziamo, la proviamo e vi mostriamo come usarla.</p></li>
                <li data-motion="focus" data-at="4.7"><span aria-hidden="true">04</span><h3>Supporto e manutenzione</h3><p>Restiamo disponibili per assistenza e aggiornamenti.</p></li>
              </ol>
              <MethodVisual />
            </MotionScene>
          </div>
        </section>

        <section className="section services" id="servizi">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Cosa facciamo</p>
              <h2>Cosa possiamo costruire{" "}<br /><span className="accent">per la tua azienda.</span></h2>
            </div>
            <ServiceCarousel>
              <article className="service-card">
                <div className="service-card__copy"><span>01</span><h3>Meno dati da ricopiare</h3><p>Colleghiamo email, Excel e gestionale: l’ordine passa senza essere riscritto.</p></div>
                <ServiceVisual type="automation" />
              </article>
              <article className="service-card">
                <div className="service-card__copy"><span>02</span><h3>AI per leggere i documenti</h3><p>Legge email e PDF, recupera i dati e segnala solo i casi dubbi.</p></div>
                <ServiceVisual type="ai" />
              </article>
              <article className="service-card" id="software">
                <div className="service-card__copy"><span>03</span><h3>Software su misura</h3><p>La vista che ti serve per sapere cosa è fermo e chi deve intervenire.</p></div>
                <ServiceVisual type="software" />
              </article>
            </ServiceCarousel>
          </div>
        </section>

        <section className="section comparison-section" id="confronto" aria-labelledby="comparison-title">
          <div className="container">
            <div className="section-heading section-heading--split">
              <div><p className="eyebrow">Prima e dopo</p><h2 id="comparison-title">Un preventivo pronto{" "}<br /><span className="accent">da controllare e inviare.</span></h2></div>
              <p>Il software prepara articoli e quantità. Il commerciale controlla e invia.</p>
            </div>
            <ProcessComparison />
          </div>
        </section>

        <section className="section examples" id="esempi">
          <div className="container">
            <div className="section-heading section-heading--split">
              <div><p className="eyebrow">Esempi di soluzioni possibili</p><h2>Problemi quotidiani.{" "}<br /><span className="accent">Soluzioni concrete.</span></h2></div>
              <p>Preventivi, giri operatori, appuntamenti: partiamo dal tuo caso.</p>
            </div>
            <div className="example-list">
              {examples.map(([category, title, detail], index) => (
                <details className="example-item" key={category}>
                  <summary><span>0{index + 1} · {category}</span><strong className="example-title">{title}</strong><i aria-hidden="true">+</i></summary>
                  <div className="example-detail"><p>{detail}</p><ExampleVisual index={index} /></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section human-section" id="controllo-umano">
          <div className="container human-grid">
            <div><p className="eyebrow">Le decisioni restano a voi</p><h2>Il software prepara.{" "}<br className="break-keep" /><span className="accent">Voi controllate e decidete.</span></h2><p>Il sistema segnala i casi dubbi. Voi decidete quelli importanti.</p></div>
            <HumanVisual />
          </div>
        </section>

        <section className="section about-section" id="chi-siamo">
          <div className="container about-grid">
            <div>
              <p className="eyebrow">Chi siamo</p>
              <h2>Aiutiamo le PMI a <span className="accent">semplificare il lavoro di ogni giorno.</span></h2>
            </div>
            <div className="about-copy">
              <p>Aiutiamo titolari e collaboratori a eliminare attese, copie e informazioni disperse. Consulenza, proposta, sviluppo, supporto e manutenzione. Anche con AI, quando serve.</p>
            </div>
            <ol className="about-principles">
              <li><span>01</span><strong>Partiamo da chi fa il lavoro</strong><p>Ascoltiamo te e chi gestisce ogni giorno ordini, fatture o commesse.</p></li>
              <li><span>02</span><strong>Creiamo la soluzione custom</strong><p>Realizziamo la soluzione custom, la proviamo sui vostri casi e vi accompagniamo nei primi utilizzi.</p></li>
              <li><span>03</span><strong>Ci siamo anche dopo</strong><p>Supporto, manutenzione e aggiornamenti concordati fanno parte del percorso.</p></li>
            </ol>
          </div>
        </section>

        <section className="section integrations" id="integrazioni">
          <div className="container">
            <div className="integrations__inner">
            <div><p className="eyebrow">Gli strumenti che usi già</p><h2>Email, Excel e gestionale.{" "}<br /><span className="accent">Collegati tra loro.</span></h2></div>
            <p>Colleghiamo gli strumenti che usate già, senza farvi ricopiare gli stessi dati.</p>
            </div>
            <IntegrationsVisual />
          </div>
        </section>

        <section className="section contact-section" id="contatti">
          <div className="container contact-grid">
            <div className="contact-copy"><p className="eyebrow eyebrow--light">Il primo passo è gratuito</p><h2>Richiedi una <span className="accent">consulenza gratuita.</span></h2><p>Descrivi il problema. Ti ricontattiamo per analizzarlo insieme.</p></div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
