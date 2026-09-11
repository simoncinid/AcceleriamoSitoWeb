import Image from "next/image";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { ProcessComparison } from "@/components/ProcessComparison";
import { ServiceCarousel } from "@/components/ServiceCarousel";
import { HeroProcessDemo } from "@/components/HeroProcessDemo";
import { Icon } from "@/components/Icons";
import { MotionScene, SectionEntrances } from "@/components/MotionScene";
import { MethodVisual, ServiceVisual, HumanVisual, IntegrationsVisual, ExampleVisual, ProblemVisual } from "@/components/StoryVisuals";
import { faqs, people, siteName, socialDescription, socialTitle } from "@/lib/site";
import { homeGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: `${siteName} | Meno lavoro rifatto a mano nella tua azienda` },
  alternates: { canonical: "/", languages: { "it-IT": "/", "x-default": "/" } },
  openGraph: { title: socialTitle, description: socialDescription, url: "/" },
};

const examples = [
  ["Commercio all’ingrosso · Preventivi", "Il cliente chiede 30 articoli. Li ricopiate uno per uno?", "La richiesta arriva via email. Per rispondere servono il listino di quel cliente e la disponibilità. Il software scrive la bozza nel gestionale. Il commerciale controlla il prezzo e invia."],
  ["Agenti di commercio · Ordini", "Gli agenti mandano gli ordini su WhatsApp. Chi li ribatte?", "Foto di moduli, note vocali, righe scritte a mano. Il software legge codici e quantità e prepara l’ordine. In amministrazione restano da confermare solo le righe dubbie."],
  ["Manutenzioni · Giri dei tecnici", "Ogni sera prepari i giri di domani. E se lo facesse un altro?", "Zone, orari, competenze e scadenze dei contratti stanno spesso solo nella testa del titolare. Il programma propone i giri e li rifà quando salta un appuntamento."],
  ["Assistenza tecnica · «A che punto siamo?»", "Il cliente chiede a che punto è il lavoro. Devi chiamare due persone?", "Interventi fatti, ricambi in arrivo e ore già spese finiscono in una schermata sola. Chi risponde al telefono la guarda e risponde subito."],
  ["Servizi su appuntamento · Agenda", "Una disdetta, un’urgenza. Chi rimette in ordine l’agenda?", "Il telefono squilla mentre state lavorando. Il calendario libera il posto, propone un altro orario al cliente e infila l’urgenza dove ci sta."],
];

export default function Home() {
  return (
    <>
      <Header />
      <SectionEntrances />
      <JsonLd data={homeGraph()} />
      <main id="contenuto">
        <section className="hero" id="top">
          <div className="container hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">Per le aziende dove tutto passa da email, Excel e telefonate</p>
              <h1><span>Ogni giorno</span>{" "}<br /><em>rifate a mano</em>{" "}<br /><span>le stesse cose.</span></h1>
              <p>Documenti da ribattere, preventivi da scrivere, giri da organizzare, appuntamenti da rimettere in fila. Guardiamo come lo fate oggi e costruiamo il pezzo che lo fa al posto vostro.</p>
              <div className="button-row">
                <a className="button button--primary" href="#contatti">Richiedi valutazione <Icon name="arrow" size={19} /></a>
              </div>
            </div>
            <HeroProcessDemo />
          </div>
        </section>

        <section className="section problem-section" id="problemi">
          <div className="container">
            <div className="section-heading section-heading--center">
              <p className="eyebrow">Riconosci il tuo caso?</p>
              <h2>Non conta cosa vendete. <span className="accent">Conta cosa rifate ogni giorno.</span></h2>
              <p>Grossisti, installatori, officine, manutentori: cambia il mestiere, non il lavoro ripetuto.</p>
            </div>
            <ServiceCarousel className="problem-grid" label="Quattro tipi di lavoro ripetuto" variant="story">
              <article className="editorial-card">
                <div className="editorial-card__copy">
                  <span className="signal-square" />
                  <p className="card-kicker">Documenti da ribattere</p>
                  <h3>Lo stesso ordine viene scritto due volte.</h3>
                  <p>Arriva per email o su WhatsApp. Poi qualcuno lo rilegge e lo ribatte nel gestionale, riga per riga.</p>
                </div>
                <div className="editorial-card__visual"><ProblemVisual type="duplicate" label="Lo stesso dato ribattuto in due programmi" /></div>
              </article>
              <article className="editorial-card">
                <div className="editorial-card__copy">
                  <span className="signal-square" />
                  <p className="card-kicker">Richieste che aspettano</p>
                  <h3>Il cliente aspetta ancora il preventivo.</h3>
                  <p>Per rispondere servono il listino giusto, lo sconto di quel cliente e la disponibilità. Stanno in tre posti diversi.</p>
                </div>
                <div className="editorial-card__visual"><ProblemVisual type="inbox" label="Richieste ferme in attesa di risposta" /></div>
              </article>
              <article className="editorial-card">
                <div className="editorial-card__copy">
                  <span className="signal-square" />
                  <p className="card-kicker">Giri e appuntamenti</p>
                  <h3>Ogni sera prepari i giri di domani.</h3>
                  <p>Zone, orari, ricambi, tecnici disponibili. Se uno dà buca, si rifà tutto a mano.</p>
                </div>
                <div className="editorial-card__visual"><ProblemVisual type="scattered" label="Giri e appuntamenti da rifare a mano" /></div>
              </article>
              <article className="editorial-card">
                <div className="editorial-card__copy">
                  <span className="signal-square" />
                  <p className="card-kicker">«A che punto siamo?»</p>
                  <h3>Il cliente chiede quando consegnate.</h3>
                  <p>Per rispondere chiami due persone e cerchi un’email di tre settimane fa.</p>
                </div>
                <div className="editorial-card__visual"><ProblemVisual type="waiting" label="Nessuno sa dire a che punto è il lavoro" /></div>
              </article>
            </ServiceCarousel>
          </div>
        </section>

        <section className="section method" id="metodo">
          <div className="container">
            <div className="section-heading method-heading">
              <p className="eyebrow">Come lavoriamo</p>
              <h2>Guardiamo il lavoro vero.{" "}<br /><span className="accent">Poi tocchiamo solo quello che serve.</span></h2>
              <p className="method-heading__note">A volte la risposta giusta è che un passaggio non va automatizzato: va eliminato.</p>
            </div>
            <MotionScene className="method-layout" label="Le quattro fasi del metodo">
              <ol className="method-grid">
                <li data-motion="focus" data-at="0.2"><span aria-hidden="true">01</span><h3>Guardiamo come lavorate</h3><p>Le email che arrivano, i file che aprite, i passaggi che rifate ogni giorno.</p></li>
                <li data-motion="focus" data-at="1.7"><span aria-hidden="true">02</span><h3>Ti diciamo cosa conviene</h3><p>Alcune cose si eliminano. Altre le fa il computer. Altre è meglio lasciarle come sono.</p></li>
                <li data-motion="focus" data-at="3.2"><span aria-hidden="true">03</span><h3>Costruiamo il pezzo che manca</h3><p>Lo proviamo sui vostri casi veri. Poi lo usate voi, davanti a noi.</p></li>
                <li data-motion="focus" data-at="4.7"><span aria-hidden="true">04</span><h3>Restiamo raggiungibili</h3><p>Se cambia un listino o qualcosa si rompe, scrivete a noi.</p></li>
              </ol>
              <MethodVisual />
            </MotionScene>
          </div>
        </section>

        <section className="section services" id="servizi">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Cosa facciamo</p>
              <h2>Tre modi per togliervi lavoro{" "}<br /><span className="accent">dalle mani.</span></h2>
            </div>
            <ServiceCarousel>
              <article className="service-card">
                <div className="service-card__copy"><span>01</span><h3>I dati passano da soli</h3><p>L’ordine arriva via email e finisce nel gestionale. Nessuno lo ribatte.</p></div>
                <ServiceVisual type="automation" />
              </article>
              <article className="service-card">
                <div className="service-card__copy"><span>02</span><h3>Leggiamo i documenti al posto vostro</h3><p>Fatture, bolle, ordini e PDF: il software tira fuori i dati e segnala solo le righe che non tornano.</p></div>
                <ServiceVisual type="ai" />
              </article>
              <article className="service-card" id="software">
                <div className="service-card__copy"><span>03</span><h3>Il programma che vi manca</h3><p>Quando nessun gestionale segue il vostro modo di lavorare, costruiamo la schermata che vi serve.</p></div>
                <ServiceVisual type="software" />
              </article>
            </ServiceCarousel>
          </div>
        </section>

        <section className="section comparison-section" id="confronto" aria-labelledby="comparison-title">
          <div className="container">
            <div className="section-heading section-heading--split">
              <p className="eyebrow">Prima e dopo</p>
              <h2 id="comparison-title">Trenta articoli da ricopiare.{" "}<br /><span className="accent">Oppure due righe da controllare.</span></h2>
              <p className="split-lead">Stessa richiesta, stesso listino, stesso gestionale. Cambia solo chi fa la parte noiosa.</p>
            </div>
            <ProcessComparison />
          </div>
        </section>

        <section className="section examples" id="esempi">
          <div className="container">
            <div className="section-heading section-heading--split">
              <p className="eyebrow">Esempi</p>
              <h2>Aziende diverse.{" "}<br /><span className="accent">Stesso lavoro ripetuto.</span></h2>
              <p className="split-lead">Cinque casi. Se somigliano al vostro, il vostro lo guardiamo davvero.</p>
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
            <div><p className="eyebrow">Le decisioni restano vostre</p><h2>Il computer non decide niente.{" "}<br className="break-keep" /><span className="accent">Vi mette il caso sotto gli occhi.</span></h2><p>Quando un prezzo non torna o una quantità non corrisponde, il sistema si ferma e ve lo segnala. Lo vedete prima di mandare l’offerta, non quando arriva la fattura.</p></div>
            <HumanVisual />
          </div>
        </section>

        <section className="section about-section" id="chi-siamo">
          <div className="container about-grid">
            <p className="eyebrow">Chi siamo</p>
            <h2>Togliamo lavoro <span className="accent">a chi ce l’ha addosso tutti i giorni.</span></h2>
            <div className="about-copy">
              <p className="split-lead">Parliamo con chi il lavoro lo fa davvero: chi apre le email al mattino, chi ribatte gli ordini, chi prepara i giri. Poi costruiamo il pezzo che gli toglie le parti ripetitive.</p>
            </div>
            <ul className="about-people">
              {people.map((person) => (
                <li className="about-person" key={person.name}>
                  <div className="about-person__photo">
                    <Image src={person.photo} alt={`${person.name}, ${person.role} in ACCELERIAMO`} width={740} height={906} sizes="(max-width: 620px) 100vw, (max-width: 820px) 220px, 240px" />
                  </div>
                  <div className="about-person__copy">
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                    <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                      <Icon name="linkedin" size={16} />
                      LinkedIn
                      <span className="visually-hidden"> di {person.name}</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <ol className="about-principles">
              <li><span>01</span><strong>Partiamo da chi fa il lavoro</strong><p>Guardiamo le email che arrivano, i file che aprite e i passaggi che rifate ogni giorno.</p></li>
              <li><span>02</span><strong>Se non conviene, lo diciamo</strong><p>A volte un passaggio si elimina e basta. A volte è meglio lasciarlo com’è. Non vi vendiamo lavoro inutile.</p></li>
              <li><span>03</span><strong>Ci siamo anche dopo</strong><p>Se cambia un listino o qualcosa si rompe, scrivete a noi. Non a un centralino.</p></li>
            </ol>
          </div>
        </section>

        <section className="section integrations" id="integrazioni">
          <div className="container">
            <div className="integrations__inner">
              <p className="eyebrow">Gli strumenti che usate già</p>
              <h2>Non dovete cambiare{" "}<br /><span className="accent">gestionale.</span></h2>
              <p className="split-lead">Restano il vostro gestionale, i vostri Excel e la vostra casella email. Aggiungiamo solo il pezzo che li fa parlare tra loro.</p>
            </div>
            <IntegrationsVisual />
          </div>
        </section>

        <section className="section faq-section" id="domande" aria-labelledby="faq-title">
          <div className="container">
            <div className="section-heading section-heading--split">
              <p className="eyebrow">Domande</p>
              <h2 id="faq-title">Prima di scriverci,{" "}<br /><span className="accent">le cose da sapere.</span></h2>
              <p className="split-lead">Niente listini né promesse sul sito. Qui c’è cosa facciamo, cosa non facciamo e come inizia il lavoro.</p>
            </div>
            <div className="example-list">
              {faqs.map((faq, index) => (
                <details className="example-item faq-item" key={faq.question} open={index === 0}>
                  <summary><strong className="example-title">{faq.question}</strong><i aria-hidden="true">+</i></summary>
                  <div className="example-detail"><p>{faq.answer}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contatti">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow eyebrow--light">Il primo passo</p>
              <h2>Richiedi <span className="accent">una valutazione.</span></h2>
              <p>Raccontaci un’attività che vi fa perdere tempo. La valutiamo e ti chiamiamo per fissare una consulenza.</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
