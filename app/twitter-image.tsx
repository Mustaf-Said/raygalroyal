import { ImageResponse } from "next/og"

export const alt = "Raygal Royal"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(140deg, #0f172a 0%, #1e3a8a 38%, #0ea5e9 100%)",
          color: "#f8fafc",
          padding: "56px",
          fontFamily: "ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.24)",
            background: "rgba(2,6,23,0.42)",
            padding: "44px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                fontWeight: 800,
              }}
            >
              R
            </div>
            <span style={{ fontSize: "30px", fontWeight: 800 }}>Raygal Royal</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "64px", lineHeight: 1.08, fontWeight: 900 }}>
              Modern Web.
              <br />
              Better Visibility.
            </h2>
            <p style={{ margin: 0, fontSize: "28px", color: "#dbeafe" }}>
              Next.js engineering, SEO architecture, and affiliate-focused content strategy.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", color: "#bfdbfe" }}>
            <span>raygalroyal.com</span>
            <span>Web • SEO • Growth</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
