import { ImageResponse } from "next/og"

export const alt = "Raygal Royal"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at 20% 20%, #0ea5e9 0%, #0f172a 45%, #020617 100%)",
          color: "#f8fafc",
          padding: "64px",
          fontFamily: "ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(120deg, rgba(14,165,233,0.15), rgba(2,6,23,0.9))",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
                fontWeight: 800,
                boxShadow: "0 12px 30px rgba(14,165,233,0.35)",
              }}
            >
              R
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "22px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bae6fd" }}>
                Raygal Royal
              </span>
              <span style={{ fontSize: "16px", color: "#cbd5e1" }}>Digital Solutions Agency</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: "930px" }}>
            <h1 style={{ fontSize: "70px", lineHeight: 1.05, margin: 0, fontWeight: 900 }}>
              Build Faster.
              <br />
              Rank Smarter.
            </h1>
            <p style={{ margin: "24px 0 0", fontSize: "30px", color: "#cbd5e1" }}>
              Web Development, SEO Strategy, and Affiliate-Ready Digital Growth.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "20px", color: "#7dd3fc" }}>raygalroyal.com</span>
            <span style={{ fontSize: "18px", color: "#94a3b8" }}>Multilingual Digital Agency</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
