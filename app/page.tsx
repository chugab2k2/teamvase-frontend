"use client";

import type { CSSProperties } from "react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <section style={heroSection}>
        <div style={heroInner}>
          <div>
            <div style={eyebrow}>TeamVase AI Copilot</div>

            <h1 style={heroTitle}>
              AI Copilot for Project Controls
            </h1>

            <p style={heroText}>
              Upload your Primavera P6 schedule and get instant schedule health
              diagnostics, risk insights, Monte Carlo intelligence, and
              executive-ready AI explanations.
            </p>

            <div style={buttonRow}>
              <a href="/register?next=/upload" style={primaryHeroBtn}>
                Start Uploading
              </a>

              <a href="/pricing" style={secondaryHeroBtn}>
                View Pricing
              </a>
            </div>
          </div>

          <div style={previewWrap}>
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
          <h2 style={sectionTitle}>Turn schedule data into project intelligence</h2>

          <p style={sectionText}>
            TeamVase helps planners, project controls managers, and project
            leaders move from manual schedule review to faster decision support.
            Instead of only seeing dates and charts, you see what is wrong, why
            it matters, and what action to take.
          </p>

          <div style={threeGrid}>
            <div style={infoCard}>
              <h3 style={infoCardTitle}>Upload Primavera files</h3>
              <p style={infoCardText}>
                Upload P6 `.xer` schedules and generate automated diagnostics
                without manual spreadsheet preparation.
              </p>
            </div>

            <div style={infoCard}>
              <h3 style={infoCardTitle}>Identify risks quickly</h3>
              <p style={infoCardText}>
                Review health score, float concerns, open ends, risk drivers,
                Monte Carlo outputs, and schedule pressure indicators.
              </p>
            </div>

            <div style={infoCard}>
              <h3 style={infoCardTitle}>Explain results clearly</h3>
              <p style={infoCardText}>
                Convert technical schedule analytics into executive-ready
                explanations, actions, and project control decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...sectionWrap, background: "#ffffff" }}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>Simple plan structure</h2>

          <p style={sectionText}>
            Start free, validate the workflow, then upgrade when you need
            unlimited capacity and premium AI decision support.
          </p>

          <div style={pricingGrid}>
            <div style={planCard}>
              <div style={planName}>Free</div>
              <div style={planPrice}>$0</div>
              <p style={planText}>
                Best for testing the upload workflow and viewing basic schedule
                analysis.
              </p>

              <div style={featureList}>
                <div style={featureItem}>Limited uploads</div>
                <div style={featureItem}>Basic dashboard</div>
                <div style={featureItem}>Schedule health metrics</div>
                <div style={featureItem}>Monte Carlo visibility</div>
              </div>

              <a href="/register?next=/upload" style={lightBtn}>
                Start Free
              </a>
            </div>

            <div style={{ ...planCard, border: "2px solid #2563eb" }}>
              <div style={proBadge}>Recommended</div>
              <div style={planName}>Pro</div>
              <div style={planPrice}>$29/mo</div>
              <p style={planText}>
                Built for planners and project leaders who need premium schedule
                intelligence and unlimited working capacity.
              </p>

              <div style={featureList}>
                <div style={featureItem}>Unlimited uploads</div>
                <div style={featureItem}>AI Explanation Engine</div>
                <div style={featureItem}>AI comparison insight</div>
                <div style={featureItem}>Unlimited saved reports</div>
              </div>

              <a href="/billing" style={primaryPlanBtn}>
                Upgrade to Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      <section style={sectionWrap}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>Built for real project controls workflows</h2>

          <div style={threeGrid}>
            <div style={featureCard}>
              <div style={featureHeading}>For Planners</div>
              <div style={featureBody}>
                Quickly review logic quality, float pressure, open ends, and
                schedule health.
              </div>
            </div>

            <div style={featureCard}>
              <div style={featureHeading}>For Project Controls Managers</div>
              <div style={featureBody}>
                Compare schedule condition, monitor risk exposure, and support
                recovery decisions.
              </div>
            </div>

            <div style={featureCard}>
              <div style={featureHeading}>For Directors</div>
              <div style={featureBody}>
                Get management-ready summaries that explain risks in clear
                business language.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={ctaSection}>
        <div style={sectionInner}>
          <div style={ctaBox}>
            <h2 style={ctaTitle}>
              Start with your next schedule upload
            </h2>

            <p style={ctaText}>
              Use the free tier to validate the workflow, then move to Pro when
              you need premium AI insight and unlimited working capacity.
            </p>

            <div style={buttonRow}>
              <a href="/upload" style={whiteBtn}>
                Go to Upload Workspace
              </a>

              <a href="/pricing" style={ghostBtn}>
                Compare Plans
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const heroSection: CSSProperties = {
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
  color: "#ffffff",
  padding: "72px 32px 88px",
};

const heroInner: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "40px",
  alignItems: "center",
};

const eyebrow: CSSProperties = {
  fontSize: "14px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#cbd5e1",
  marginBottom: "14px",
};

const heroTitle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(38px, 6vw, 58px)",
  lineHeight: 1.05,
  fontWeight: 900,
  maxWidth: "780px",
};

const heroText: CSSProperties = {
  marginTop: "20px",
  fontSize: "18px",
  lineHeight: 1.8,
  color: "#cbd5e1",
  maxWidth: "760px",
};

const buttonRow: CSSProperties = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
  marginTop: "28px",
};

const previewWrap: CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "28px",
  padding: "24px",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
};

const previewCard: CSSProperties = {
  background: "#ffffff",
  borderRadius: "20px",
  padding: "22px",
  color: "#0f172a",
};

const previewLabel: CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const previewValue: CSSProperties = {
  fontSize: "48px",
  fontWeight: 900,
  marginTop: "8px",
};

const previewSub: CSSProperties = {
  fontSize: "14px",
  color: "#475569",
  marginTop: "8px",
};

const miniMetric: CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  padding: "12px 14px",
  color: "#e2e8f0",
  fontSize: "14px",
};

const sectionWrap: CSSProperties = {
  padding: "72px 32px",
};

const sectionInner: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const sectionTitle: CSSProperties = {
  marginTop: 0,
  marginBottom: "12px",
  fontSize: "34px",
  fontWeight: 900,
  color: "#0f172a",
};

const sectionText: CSSProperties = {
  marginTop: 0,
  marginBottom: "30px",
  fontSize: "16px",
  lineHeight: 1.8,
  color: "#475569",
  maxWidth: "900px",
};

const threeGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
};

const pricingGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px",
  alignItems: "stretch",
};

const infoCard: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "22px",
  boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
};

const infoCardTitle: CSSProperties = {
  marginTop: 0,
  marginBottom: "10px",
  fontSize: "22px",
  fontWeight: 800,
  color: "#0f172a",
};

const infoCardText: CSSProperties = {
  margin: 0,
  fontSize: "14px",
  lineHeight: 1.8,
  color: "#475569",
};

const planCard: CSSProperties = {
  position: "relative",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "26px",
  boxShadow: "0 8px 26px rgba(15, 23, 42, 0.06)",
};

const proBadge: CSSProperties = {
  display: "inline-block",
  marginBottom: "14px",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#dbeafe",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const planName: CSSProperties = {
  fontSize: "24px",
  fontWeight: 900,
  color: "#0f172a",
};

const planPrice: CSSProperties = {
  marginTop: "10px",
  fontSize: "36px",
  fontWeight: 900,
  color: "#0f172a",
};

const planText: CSSProperties = {
  color: "#475569",
  fontSize: "14px",
  lineHeight: 1.7,
};

const featureList: CSSProperties = {
  display: "grid",
  gap: "10px",
  marginTop: "18px",
  marginBottom: "22px",
};

const featureItem: CSSProperties = {
  fontSize: "14px",
  color: "#334155",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const featureCard: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "22px",
  padding: "22px",
  boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
};

const featureHeading: CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: "10px",
};

const featureBody: CSSProperties = {
  fontSize: "14px",
  lineHeight: 1.8,
  color: "#475569",
};

const ctaSection: CSSProperties = {
  padding: "0 32px 80px",
};

const ctaBox: CSSProperties = {
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e40af 100%)",
  borderRadius: "28px",
  padding: "36px",
  color: "#ffffff",
  boxShadow: "0 16px 40px rgba(37, 99, 235, 0.24)",
};

const ctaTitle: CSSProperties = {
  marginTop: 0,
  marginBottom: "12px",
  fontSize: "34px",
  fontWeight: 900,
};

const ctaText: CSSProperties = {
  margin: 0,
  fontSize: "16px",
  lineHeight: 1.8,
  color: "#dbeafe",
  maxWidth: "780px",
};

const primaryHeroBtn: CSSProperties = {
  display: "inline-block",
  padding: "14px 20px",
  borderRadius: "14px",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 800,
  textDecoration: "none",
};

const secondaryHeroBtn: CSSProperties = {
  display: "inline-block",
  padding: "14px 20px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.18)",
  fontWeight: 800,
  textDecoration: "none",
};

const lightBtn: CSSProperties = {
  display: "inline-block",
  padding: "14px 18px",
  borderRadius: "14px",
  background: "#f8fafc",
  color: "#0f172a",
  border: "1px solid #e2e8f0",
  fontWeight: 800,
  textDecoration: "none",
};

const primaryPlanBtn: CSSProperties = {
  display: "inline-block",
  padding: "14px 18px",
  borderRadius: "14px",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 800,
  textDecoration: "none",
};

const whiteBtn: CSSProperties = {
  display: "inline-block",
  padding: "14px 20px",
  borderRadius: "14px",
  background: "#ffffff",
  color: "#1d4ed8",
  fontWeight: 800,
  textDecoration: "none",
};

const ghostBtn: CSSProperties = {
  display: "inline-block",
  padding: "14px 20px",
  borderRadius: "14px",
  background: "transparent",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.3)",
  fontWeight: 800,
  textDecoration: "none",
};