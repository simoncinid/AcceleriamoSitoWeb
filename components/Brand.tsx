export function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand${light ? " brand--light" : ""}`} aria-label="ACCELERIAMO">
      ACCELER<span className="brand__ia">IA</span>MO
    </span>
  );
}
