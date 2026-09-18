import {
  LegalIdentity,
  LegalPage,
  legalMetadata,
} from "@/components/LegalPage";
import { product } from "@/lib/workmap/config";
export const metadata = legalMetadata(
  "AI WorkMap: condizioni e privacy",
  "Informazioni sul prodotto AI WorkMap, analisi gratuita, consegna e trattamento dei dati.",
  "/ai-workmap/condizioni",
);
export default function Conditions() {
  return (
    <LegalPage
      title="AI WorkMap: condizioni e privacy"
      path="/ai-workmap/condizioni"
      intro={`Informazioni sul prodotto · versione ${product.version}`}
    >
      <section>
        <h2>Il servizio e il titolare</h2>
        <LegalIdentity />
        <p>
          AI WorkMap è un documento operativo digitale personalizzato sulla base
          delle informazioni che fornisci. Comprende 10–15 workflow, prompt, tre
          assistenti configurabili mediante istruzioni e un piano di
          applicazione di 30 giorni. Non comprende implementazioni software,
          integrazioni, consulenza professionale regolamentata o abbonamenti a
          strumenti di terzi.
        </p>
      </section>
      <section>
        <h2>Analisi gratuita</h2>
        <p>L’analisi e la WorkMap completa sono gratuite. Completa la conversazione, conferma il profilo e avvia la generazione: riceverai il documento PDF via email.</p>
        <p>In caso di errore puoi riprendere dal punto salvato. Per assistenza scrivi a info@acceleriamo.it.</p>
      </section>
      <section>
        <h2>Consegna e requisiti</h2>
        <p>
          Il risultato è disponibile in una pagina privata e come PDF
          scaricabile. Il PDF viene inviato come allegato via email, insieme al collegamento personale.
          Occorrono una connessione, un browser aggiornato, un indirizzo email
          valido e un lettore PDF. Conserva il documento scaricato e non
          condividere il link personale.
        </p>
        <p>
          La generazione automatica include una seconda revisione AI. Non
          equivale a una revisione umana professionale. Prima di utilizzare
          contenuti o indicazioni, verifica dati, fonti e compatibilità con le
          regole della tua organizzazione.
        </p>
      </section>
      <section>
        <h2>Assistenza e diritti</h2>
        <p>
          Per assistenza sull’analisi o errori nel documento contatta info@acceleriamo.it.        </p>
        <p>
          Consulta le{" "}
          <a href="/termini-e-condizioni">condizioni generali del sito</a>. In
          caso di contrasto sulle caratteristiche di AI WorkMap prevalgono le
          informazioni specifiche di questa pagina, ferme le tutele di legge.
        </p>
      </section>
      <section id="privacy">
        <h2>Privacy dell’analisi e della WorkMap</h2>
        <p>
          Il titolare è indicato sopra. Trattiamo le risposte, il profilo
          professionale, l’email e gli stati della conversazione per fornire l’analisi gratuita richiesta e consegnare il documento. L’email viene richiesta dopo la
          prima parte della conversazione e non comporta iscrizione marketing.
        </p>
        <p>
          Non inserire password, segreti aziendali o dati sensibili dei clienti.
          Descrivi i processi con esempi generici. Il profilo e le risposte
          necessarie vengono elaborati dal provider AI{" "}
          {process.env.WORKMAP_AI_PROVIDER_NAME ||
            "configurato per il servizio"}
          ; l’email non è inviata al modello. Aruba gestisce le email di servizio; l’archivio persistente
          conserva conversazione e documento per il recupero.
        </p>
        <p>
          Le analisi e i documenti sono eliminati dall’archivio dopo 30 giorni dalla creazione. Conserva il PDF ricevuto via email. Puoi chiedere al titolare accesso o cancellazione dei tuoi dati. Nessuna decisione con effetti giuridici è
          presa automaticamente sulla tua persona.
        </p>
        <p>
          Un cookie tecnico protegge la ripresa della conversazione. La
          misurazione Meta segue le preferenze del sito e riceve soltanto eventi
          e dati aggregati del prodotto, senza nome, email, testi della chat o
          informazioni aziendali. Ulteriori informazioni su diritti, fornitori,
          trasferimenti e reclami sono nella{" "}
          <a href="/privacy-policy">Privacy Policy</a> e nella{" "}
          <a href="/cookie-policy">Cookie Policy</a>.
        </p>
      </section>
    </LegalPage>
  );
}
