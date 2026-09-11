import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1D1B19", position: "relative" }}>
      <div style={{ display: "flex", color: "#FFFDF8", fontSize: 96, fontWeight: 800, letterSpacing: -6, lineHeight: 1 }}>A</div>
      <div style={{ position: "absolute", top: 28, right: 28, width: 24, height: 24, borderRadius: 24, background: "#FF5A1F" }} />
    </div>,
    size,
  );
}
