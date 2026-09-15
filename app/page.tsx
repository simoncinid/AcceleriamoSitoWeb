import Image from "next/image";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { SectorSelector } from "@/components/SectorSelector";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { whatsappDisplay } from "@/lib/contact";
import { CaseStudyGallery } from "@/components/CaseStudyGallery";
import { HeroProcessDemo } from "@/components/HeroProcessDemo";
import { Icon } from "@/components/Icons";
import { MotionScene, SectionEntrances } from "@/components/MotionScene";
import { MethodVisual, ServiceVisual } from "@/components/StoryVisuals";
import { faqs, people, siteName, socialDescription, socialTitle } from "@/lib/site";
import { homeGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: `${siteName} | Meno lavoro rifatto a mano nella tua azienda` },
  alternates: { canonical: "/", languages: { "it-IT": "/", "x-default": "/" } },
  openGraph: { title: socialTitle, description: socialDescription, url: "/" },
};

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
              <p className="eyebrow">Per le piccole aziende italiane</p>
              <h1><span>Ogni giorno</span>{" "}<br /><em>rifai a mano</em>{" "}<br /><span>le stesse cose?</span></h1>
              <p>Se le tue giornate si riempiono di ordini, preventivi e dati da ricopiare, con Acceleriamo puoi farli passare da soli nei programmi che usi già.</p>
              <div className="button-row">
                <a className="button button--primary" href="#contatti">Richiedi la valutazione gratuita <Icon name="arrow" size={19} /></a>
              </div>
            </div>
            <HeroProcessDemo />
          </div>
        </section>

        <section className="section real-cases" id="caso-reale" aria-labelledby="real-cases-title">
          <div className="container">
            <div className="section-heading section-heading--center real-cases__head">
              <p className="eyebrow">Casi reali</p>
              <h2 id="real-cases-title">Due PMI, <br className="break-keep" /><span className="accent">meno lavoro a mano.</span></h2>
            </div>
            <CaseStudyGallery />
          </div>
        </section>

        <section className="section sectors-section" id="esempi">
          <div className="container">
            <div className="section-heading section-heading--center">
              <p className="eyebrow">Riconosci il tuo caso?</p>
              <h2>In che settore <span className="accent">lavori?</span></h2>
              <p>Ordini da riscrivere, telefonate che interrompono il lavoro, documenti in attesa: cosa succede nella tua giornata?</p>
            </div>
            <SectorSelector />
          </div>
        </section>

        <section className="section method" id="metodo">
          <div className="container">
            <div className="section-heading method-heading">
              <p className="eyebrow">Come lavoriamo</p>
              <h2>Parti da ciò che{" "}<br /><span className="accent">ti porta via tempo.</span></h2>
              <p className="method-heading__note">A volte la risposta giusta è che un passaggio non va automatizzato: va eliminato.</p>
            </div>
            <MotionScene className="method-layout" label="Le quattro fasi del metodo">
              <ol className="method-grid">
                <li data-motion="focus" data-at="0.2"><span aria-hidden="true">01</span><h3>Guardiamo come lavori</h3><p>Le email che arrivano, i file che apri, i passaggi che rifai ogni giorno.</p></li>
                <li data-motion="focus" data-at="1.7"><span aria-hidden="true">02</span><h3>Ti diciamo cosa conviene</h3><p>Alcune cose si eliminano. Altre le fa il computer. Altre è meglio lasciarle come sono.</p></li>
                <li data-motion="focus" data-at="3.2"><span aria-hidden="true">03</span><h3>Costruiamo il pezzo che manca</h3><p>Lo proviamo sui tuoi casi veri. Poi lo usi tu, davanti a noi.</p></li>
                <li data-motion="focus" data-at="4.7"><span aria-hidden="true">04</span><h3>Restiamo raggiungibili</h3><p>Se cambia un listino o qualcosa si rompe, scrivi a noi.</p></li>
              </ol>
              <MethodVisual />
            </MotionScene>
          </div>
        </section>

        <section className="section services" id="servizi">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Cosa puoi semplificare</p>
              <h2>Tre modi per toglierti{" "}<br /><span className="accent">il copia e incolla.</span></h2>
            </div>
            <div className="services-list">
              <article className="service-card">
                <div className="service-card__copy"><span>01</span><h3>I dati passano da soli</h3><p>Tu o i tuoi collaboratori riscrivete gli stessi dati in più programmi? Con i programmi collegati, basta inserirli una volta.</p></div>
                <ServiceVisual type="automation" />
              </article>
              <article className="service-card">
                <div className="service-card__copy"><span>02</span><h3>I documenti diventano dati pronti</h3><p>Fatture, bolle e PDF da ricopiare uno alla volta: il software estrae i dati e ti segnala le righe da controllare.</p></div>
                <ServiceVisual type="ai" />
              </article>
              <article className="service-card" id="software">
                <div className="service-card__copy"><span>03</span><h3>Il programma che ti manca</h3><p>Per finire un lavoro devi saltare tra fogli, chat e app? Una schermata su misura riunisce i passaggi che ti servono.</p></div>
                <ServiceVisual type="software" />
              </article>
            </div>
          </div>
        </section>

        <section className="section about-section" id="chi-siamo">
          <div className="container about-grid">
            <p className="eyebrow">Chi siamo</p>
            <h2><span className="about-title__lead">Meno tempo a ricopiare,</span><br className="break-keep" /><span className="accent">più tempo per il lavoro vero.</span></h2>
            <div className="about-copy">
              <p className="split-lead">La tua giornata è il punto di partenza. Con Diego e Tommaso puoi parlare di ciò che ti rallenta e capire come semplificarlo.</p>
            </div>
            <ul className="about-people">
              {people.map((person) => (
                <li className="about-person" key={person.name}>
                  <div className="about-person__photo">
                    <Image unoptimized src={person.photo} alt={`${person.name}, ${person.role} in ACCELERIAMO`} width={740} height={906} sizes="(max-width: 620px) 45vw, 280px" />
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

          </div>
        </section>

        <section className="section contact-section" id="contatti">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow eyebrow--light">Il primo passo</p>
              <h2>Richiedi la <span className="accent">valutazione gratuita.</span></h2>
              <p>Se hai pensato «succede anche da noi», raccontaci l’attività che ti porta via tempo. Ti richiamiamo per capire insieme cosa puoi semplificare.</p>
              <WhatsAppLink source="modulo">WhatsApp · {whatsappDisplay}</WhatsAppLink>
            </div>
            <ContactForm />
          </div>
        </section>
        <section className="section faq-section" id="domande" aria-labelledby="faq-title">
          <div className="container">
            <div className="section-heading section-heading--split">
              <p className="eyebrow">Domande</p>
              <h2 id="faq-title">Le cose <span className="accent">da sapere.</span></h2>
            </div>
            <div className="example-list">
              {faqs.map((faq) => (
                <details className="example-item faq-item" key={faq.question}>
                  <summary><strong className="example-title">{faq.question}</strong><i aria-hidden="true">+</i></summary>
                  <div className="example-detail"><p>{faq.answer}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
