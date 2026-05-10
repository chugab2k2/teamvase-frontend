"use client";

export default function ProcessingPanel({ progress, stage }: { progress: number; stage: string }) {
  const safeProgress = Math.max(0, Math.min(100, Number(progress || 0)));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gap: "24px",
        }}
      >
        <section
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
            color: "#ffffff",
            borderRadius: "24px",
            padding: "28px 30px",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#cbd5e1",
              marginBottom: "10px",
            }}
          >
            TeamVase AI Copilot
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              lineHeight: 1.1,
              fontWeight: 800,
            }}
          >
            Processing Schedule
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              color: "#cbd5e1",
              fontSize: "15px",
            }}
          >
            Your Primavera schedule is being parsed, analysed, simulated, and interpreted.
          </p>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {stage || "Processing schedule"}
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderRadius: "999px",
                background: "#dbeafe",
                color: "#1d4ed8",
                fontWeight: 800,
                fontSize: "13px",
              }}
            >
              {safeProgress}%
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: "14px",
              background: "#e2e8f0",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${safeProgress}%`,
                height: "100%",
                background: "#2563eb",
                borderRadius: "999px",
                transition: "width 0.5s ease",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "18px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "12px",
            }}
          >
            {["Parsing", "Metrics", "Monte Carlo", "AI Insights", "Complete"].map((label) => (
              <div
                key={label}
                style={{
                  padding: "12px",
                  borderRadius: "14px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
