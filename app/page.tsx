"use client";

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
          color: "#ffffff",
          padding: "72px 32px 88px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#cbd5e1",
                marginBottom: "14px",
              }}
            >
              TeamVase AI Copilot
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "54px",
                lineHeight: 1.05,
                fontWeight: 900,
                maxWidth: "760px",
              }}
            >
              AI Copilot for Project Controls
            </h1>

            <p
              style={{
                marginTop: "20px",
                fontSize: "18px",
                lineHeight: 1.8,
                color: "#cbd5e1",
                maxWidth: "760px",
              }}
            >
              Upload your Primavera P6 schedule and get instant health diagnostics,
              risk insights, Monte Carlo intelligence, and executive-ready AI
              explanations.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "28px",
              }}
            >
              <a href="/upload" style={primaryHeroBtn}>
                Start Uploading
              </a>

              <a href="/pricing" style={secondaryHeroBtn}>
                View Pricing
              </a>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "28px",
              padding: "24px",
              boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
            }}
          >
            <div style={previewCard}>
              <div style={previewLabel}>Schedule Health</div>
              <div style={previewValue}>74</div>
              <div style={previewSub}>Moderate · needs proactive control</div>
            </div>

            <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
              <div style={miniMetric}>Open Ends: 8</div>
              <div style={miniMetric}>Negative Float: 0</div>
              <div style={miniMetric}>AI Explanation: Pro</div>
              <div style={miniMetric}>Comparison Insight: Pro</div>
            </div>
          </div>
        </div>
      </section>

      <section style={sectionWrap}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>Why TeamVase AI Copilot</h2>
          <p style={sectionText}>
            Traditional schedule reviews are slow, manual, and hard to translate into
            management decisions. TeamVase turns schedule data into clear project
            intelligence for planners, project controls managers, and directors.
          </p>

          <div style={threeGrid}>
            <div style={infoCard}>
              <h3 style={infoCardTitle}>Upload Primavera files</h3>
              <p style={infoCardText}>
                Bring in Primavera P6 `.xer` schedules and immediately start analysis.
              </p>
            </div>

            <div style={infoCard}>
              <h3 style={infoCardTitle}>See decision-ready insight</h3>
              <p style={infoCardText}>
                Review health metrics, risk exposure, and executive summaries in one
                workflow.
              </p>
            </div>

            <div style={infoCard}>
              <h3 style={infoCardTitle}>Upgrade when ready</h3>
              <p style={infoCardText}>
                Unlock AI Explanation, comparison intelligence, and unlimited capacity
                with Pro.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...sectionWrap, background: "#ffffff" }}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>Built for real project controls workflows</h2>

          <div style={threeGrid}>
            <div style={featureCard}>
              <div style={featureHeading}>Free</div>
              <div style={featureBody}>Basic upload workflow and core dashboard access</div>
            </div>

            <div style={featureCard}>
              <div style={featureHeading}>Pro</div>
              <div style={featureBody}>AI explanation, AI compare, unlimited uploads, unlimited saved reports</div>
            </div>

            <div style={featureCard}>
              <div style={featureHeading}>Management-ready</div>
              <div style={featureBody}>Built for executive review, portfolio oversight, and fast decision support</div>
            </div>
          </div>
        </div>
      </section>

      <section style={ctaSection}>
        <div style={sectionInner}>
          <div
            style={{
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e40af 100%)",
              borderRadius: "28px",
              padding: "36px",
              color: "#ffffff",
              boxShadow: "0 16px 40px rgba(37, 99, 235, 0.24)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "12px",
                fontSize: "34px",
                fontWeight: 900,
              }}
            >
              Start with your next schedule upload
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                lineHeight: 1.8,
                color: "#dbeafe",
                maxWidth: "780px",
              }}
            >
              Use the free tier to validate the workflow, then move to Pro when you
              need premium AI insight and unlimited working capacity.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "24px",
              }}
            >
              <a href="/upload" style={whiteBtn}>
                Go to Upload Workspace
              </a>

              <a href="/billing" style={ghostBtn}>
                Billing & Subscription
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const sectionWrap: React.CSSProperties = {
  padding: "72px 32px",
};

const sectionInner: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const sectionTitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "12px",
  fontSize: "34px",
  fontWeight: 900,
  color: "#0f172a",
};

const sectionText: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "30px",
  fontSize: "16px",
  lineHeight: 1.8,
  color: "#475569",
  maxWidth: "900px",
};

const threeGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
};

const infoCard: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "22px",
  boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
};

const infoCardTitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "10px",
  fontSize: "22px",
  fontWeight: 800,
  color: "#0f172a",
};

const infoCardText: React.CSSProperties = {
  margin: 0,
  fontSize: "14px",
  lineHeight: 1.8,
  color: "#475569",
};

const featureCard: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "22px",
  padding: "22px",
};

const featureHeading: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: "10px",
};

const featureBody: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: 1.8,
  color: "#475569",
};

const ctaSection: React.CSSProperties = {
  padding: "0 32px 80px",
};

const primaryHeroBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 20px",
  borderRadius: "14px",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 800,
  textDecoration: "none",
};

const secondaryHeroBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 20px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.18)",
  fontWeight: 800,
  textDecoration: "none",
};

const previewCard: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "20px",
  padding: "22px",
  color: "#0f172a",
};

const previewLabel: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const previewValue: React.CSSProperties = {
  fontSize: "48px",
  fontWeight: 900,
  marginTop: "8px",
};

const previewSub: React.CSSProperties = {
  fontSize: "14px",
  color: "#475569",
  marginTop: "8px",
};

const miniMetric: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  padding: "12px 14px",
  color: "#e2e8f0",
  fontSize: "14px",
};

const whiteBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 20px",
  borderRadius: "14px",
  background: "#ffffff",
  color: "#1d4ed8",
  fontWeight: 800,
  textDecoration: "none",
};

const ghostBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 20px",
  borderRadius: "14px",
  background: "transparent",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.3)",
  fontWeight: 800,
  textDecoration: "none",
};