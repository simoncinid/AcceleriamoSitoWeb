import { ImageResponse } from "next/og";

export const alt = "ACCELERIAMO — Consulenza gratuita e soluzioni su misura per le PMI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const steps = ["Consulenza gratuita", "Proposta", "Sviluppo su misura", "Supporto e manutenzione"];
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#FFFDF8", color: "#1D1B19", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 29, fontWeight: 800, letterSpacing: -1 }}>
          ACCELER<span style={{ color: "#FF5A1F" }}>IA</span>MO
        </div>
        <div style={{ fontSize: 18, color: "#625E58" }}>Soluzioni su misura per le PMI</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 65, fontWeight: 600, lineHeight: 1.04, letterSpacing: -3 }}>
          <span>Meno ore perse.</span>
          <span>Più tempo per la tua azienda.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {steps.map((step, index) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", border: `1px solid ${index === 3 ? "#3F6F65" : index === 1 ? "#FF5A1F" : "#DED9D0"}`, borderRadius: 10, background: index === 3 ? "#3F6F65" : "#F6F2EB", color: index === 3 ? "#FFFDF8" : "#1D1B19", fontSize: 17, fontWeight: 700 }}>
                <span style={{ display: "flex", width: 9, height: 9, borderRadius: 9, background: index === 3 ? "#FFFDF8" : index === 1 ? "#FF5A1F" : "#DED9D0" }} />{step}
              </div>
              {index < steps.length - 1 && <span style={{ display: "flex", color: "#FF5A1F", fontSize: 24 }}>→</span>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", color: "#625E58", fontSize: 17 }}>Richiedi una consulenza gratuita · acceleriamo.it</div>
    </div>,
    size,
  );
}
