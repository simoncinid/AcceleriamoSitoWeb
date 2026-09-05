import { Icon } from "./Icons";

export type ProcessStep = {
  title: string;
  detail: string;
  type: "input" | "ai" | "system" | "human" | "output";
  icon: string;
};

const defaultSteps: ProcessStep[] = [
  { title: "Lista ricevuta", detail: "Email cliente", type: "input", icon: "inbox" },
  { title: "Articoli letti", detail: "Codici e quantità", type: "ai", icon: "scan" },
  { title: "Bozza compilata", detail: "Prezzi dal listino", type: "system", icon: "database" },
  { title: "Verifica commerciale", detail: "Prezzi e sconti", type: "human", icon: "person" },
  { title: "Preventivo pronto", detail: "Da approvare e inviare", type: "output", icon: "check" },
];

export function ProcessFlow({ steps = defaultSteps, compact = false }: { steps?: ProcessStep[]; compact?: boolean }) {
  return (
    <div className={`process-flow${compact ? " process-flow--compact" : ""}`}>
      <ol className="process-flow__track" aria-label="Esempio di processo automatizzato">
        {steps.map((step, index) => (
          <li className={`process-step process-step--${step.type}`} key={step.title} style={{ "--step": index } as React.CSSProperties}>
            <span className="process-step__icon"><Icon name={step.icon} size={19} /></span>
            <span className="process-step__copy">
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </span>
            {index < steps.length - 1 && <span className="process-step__connector" aria-hidden="true"><Icon name="arrow" size={17} /></span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
