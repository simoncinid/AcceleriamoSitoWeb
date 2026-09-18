type PdfPreviewProps = {
  page: number;
  title: string;
  result: string;
  input: string;
  prompt: string;
  check: string;
};

export function PdfPreview({ page, title, result, input, prompt, check }: PdfPreviewProps) {
  return (
    <article className="wm-preview" aria-label={`Pagina di esempio del PDF: ${title}`}>
      <div className="wm-doc">
        <div className="wm-doc-bar">
          <span className="wm-doc-file">
            <span className="signal-square" />
            AI WorkMap · PDF
          </span>
          <span className="wm-tag">Pagina di esempio</span>
        </div>
        <p className="wm-doc-context">PER UN RESPONSABILE COMMERCIALE</p>
        <h3 className="wm-doc-heading">{title}</h3>
        <p className="wm-doc-result">{result}</p>
        <ol className="wm-doc-instructions">
          <li>
            <span className="wm-doc-n">01</span>
            <div>
              <strong>Apri ChatGPT o Claude</strong>
              <p>{input}</p>
            </div>
          </li>
          <li>
            <span className="wm-doc-n">02</span>
            <div>
              <strong>Copia questa richiesta</strong>
              <blockquote className="wm-doc-prompt">{prompt}</blockquote>
            </div>
          </li>
        </ol>
        <p className="wm-doc-check"><strong>Prima di usarlo</strong> {check}</p>
        <footer className="wm-doc-footer">
          <span>Il tuo PDF sarà personalizzato sul tuo lavoro.</span>
          <span>{String(page).padStart(2, "0")}</span>
        </footer>
      </div>
    </article>
  );
}
