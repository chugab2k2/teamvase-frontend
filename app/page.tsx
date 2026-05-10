"use client";

import type { CSSProperties } from "react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <section style={heroSection}>
        <div style={heroInner}>
          <div>
            <div style={eyebrow}>TeamVase AI Copilot</div>

            <h1 style={heroTitle}>AI Copilot for Project Controls</h1>

            <p style={heroText}>
              Upload Primavera P6 schedules and instantly generate schedule diagnostics, float
              analysis, Monte Carlo risk intelligence, portfolio comparisons, executive-ready
              reports, and AI-powered project insights.
            </p>

            <div style={buttonRow}>
              <a href="/register?next=/upload" style={primaryHeroBtn}>
                Upload Schedule
              </a>

              <a href="/pricing" style={secondaryHeroBtn}>
                View Pricing
              </a>
            </div>
          </div>

          <div style={previewWrap}>
            <div style={previewCard}>
              <div style={previewLabel}>AI Project Controls Workspace</div>
              <div style={previewValue}>P6</div>
              <div style={previewSub}>
                Schedule diagnostics · risk analytics · portfolio intelligence
              </div>
            </div>

            <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
              <div style={miniMetric}>Saved analyses and dashboards</div>
              <div style={miniMetric}>Monte Carlo forecast intelligence</div>
              <div style={miniMetric}>Portfolio comparison and AI insights</div>
              <div style={miniMetric}>Executive PDF reports and snapshots</div>
            </div>
          </div>
        </div>
      </section>

      <section style={sectionWrap}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>Everything project controls teams need in one AI workspace</h2>

          <p style={sectionText}>
            TeamVase helps planners, schedulers, project controls managers, consultants, and
            executives turn Primavera P6 schedules into decision-ready intelligence across single
            projects, portfolios, and executive reporting workflows.
          </p>

          <div style={sixGrid}>
            <FeatureCard
              title="Schedule Diagnostics"
              text="Identify open ends, negative float, logic issues, float exposure, activity counts, and overall schedule health."
            />

            <FeatureCard
              title="Monte Carlo Risk Intelligence"
              text="Generate P10–P90 forecast dates, completion confidence, uncertainty views, criticality, and schedule risk exposure."
            />

            <FeatureCard
              title="AI Executive Explanations"
              text="Convert technical schedule outputs into clear root causes, key risks, management summaries, and recommended actions."
            />

            <FeatureCard
              title="Portfolio Intelligence"
              text="Compare multiple completed analyses, rank project health, identify high-risk jobs, and support PMO-level oversight."
            />

            <FeatureCard
              title="Saved Reports & Snapshots"
              text="Save comparison snapshots, reopen executive reports, preserve historical analyses, and build a reusable reporting library."
            />

            <FeatureCard
              title="AI Comparison Engine"
              text="Compare project schedules, expose performance differences, explain risk rankings, and prioritize intervention areas."
            />
          </div>
        </div>
      </section>

      <section style={{ ...sectionWrap, background: "#ffffff" }}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>From schedule checks to project controls intelligence</h2>

          <p style={sectionText}>
            TeamVase goes beyond one-off schedule review. It combines deterministic schedule quality
            checks, probabilistic risk analytics, saved dashboards, portfolio ranking, AI comparison
            insights, and executive reporting in a single workflow.
          </p>

          <div style={threeGrid}>
            <div style={infoCard}>
              <h3 style={infoCardTitle}>Analyze</h3>
              <p style={infoCardText}>
                Upload P6 `.xer` schedules and generate schedule health, activity metrics, logic
                diagnostics, Monte Carlo forecasts, and AI explanations.
              </p>
            </div>

            <div style={infoCard}>
              <h3 style={infoCardTitle}>Compare</h3>
              <p style={infoCardText}>
                Compare completed jobs across health, open ends, negative float, risk exposure, and
                executive performance narratives.
              </p>
            </div>

            <div style={infoCard}>
              <h3 style={infoCardTitle}>Report</h3>
              <p style={infoCardText}>
                Save snapshots, reopen report history, and export executive-ready PDF reports for
                management, clients, and project teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={sectionWrap}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>Built for real project controls workflows</h2>

          <div style={threeGrid}>
            <div style={workflowCard}>
              <div style={workflowNumber}>01</div>
              <h3 style={workflowTitle}>My Analyses</h3>
              <p style={workflowText}>
                Keep a saved library of completed schedule analyses. Reopen dashboards, review
                previous uploads, and compare selected jobs.
              </p>
            </div>

            <div style={workflowCard}>
              <div style={workflowNumber}>02</div>
              <h3 style={workflowTitle}>Portfolio Dashboard</h3>
              <p style={workflowText}>
                Review average health, total jobs, high-risk projects, health trends, portfolio
                ranking, and latest job summaries.
              </p>
            </div>

            <div style={workflowCard}>
              <div style={workflowNumber}>03</div>
              <h3 style={workflowTitle}>Reports Library</h3>
              <p style={workflowText}>
                Store comparison snapshots, track saved report history, reopen management reports,
                and support recurring project reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...sectionWrap, background: "#ffffff" }}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>Why TeamVase is different</h2>

          <p style={sectionText}>
            Traditional tools show schedule data. TeamVase helps explain what it means, which
            projects need attention, which drivers matter, and what management should do next.
          </p>

          <div style={comparisonGrid}>
            <div style={comparisonCard}>
              <h3 style={comparisonTitle}>Typical Schedule Review</h3>
              <ul style={listStyle}>
                <li>Manual checks and spreadsheet summaries</li>
                <li>Limited executive interpretation</li>
                <li>Single-project analysis only</li>
                <li>Reports recreated repeatedly</li>
                <li>Risk drivers not always clearly explained</li>
              </ul>
            </div>

            <div style={{ ...comparisonCard, border: "2px solid #2563eb" }}>
              <h3 style={comparisonTitle}>TeamVase AI Copilot</h3>
              <ul style={listStyle}>
                <li>Instant P6 diagnostics and health scoring</li>
                <li>Monte Carlo and driver-based risk intelligence</li>
                <li>Portfolio ranking and comparison insights</li>
                <li>Saved reports and executive PDF exports</li>
                <li>AI explanations for leadership decisions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={sectionWrap}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>Simple MVP pricing for early adopters</h2>

          <p style={sectionText}>
            Start free, validate the workflow, then upgrade when you need higher capacity, advanced
            AI diagnostics, saved reports, portfolio comparison, and executive-ready project
            controls intelligence.
          </p>

          <div style={pricingGrid}>
            <div style={planCard}>
              <div style={planName}>Free</div>
              <div style={planPrice}>$0</div>
              <p style={planText}>
                Best for testing the upload workflow and reviewing basic schedule intelligence.
              </p>

              <div style={featureList}>
                <div style={featureItem}>Limited schedule uploads</div>
                <div style={featureItem}>Basic schedule health dashboard</div>
                <div style={featureItem}>Open ends and negative float checks</div>
                <div style={featureItem}>Limited saved analyses</div>
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
                Built for planners, consultants, and project controls professionals who need premium
                schedule and portfolio intelligence.
              </p>

              <div style={featureList}>
                <div style={featureItem}>Unlimited uploads</div>
                <div style={featureItem}>Unlimited saved reports</div>
                <div style={featureItem}>Monte Carlo P10–P90 intelligence</div>
                <div style={featureItem}>Tornado and criticality drivers</div>
                <div style={featureItem}>AI comparison insights</div>
                <div style={featureItem}>Portfolio dashboard</div>
                <div style={featureItem}>Executive PDF export</div>
                <div style={featureItem}>Advanced AI diagnostic review</div>
              </div>

              <a href="/billing" style={primaryPlanBtn}>
                Upgrade to Pro
              </a>
            </div>

            <div style={planCard}>
              <div style={planName}>Team</div>
              <div style={planPrice}>Custom</div>
              <p style={planText}>
                For EPC teams, PM consultants, owners, and project organizations that need
                multi-user project controls intelligence.
              </p>

              <div style={featureList}>
                <div style={featureItem}>Team workspaces</div>
                <div style={featureItem}>Shared portfolio reporting</div>
                <div style={featureItem}>Client-branded reports</div>
                <div style={featureItem}>Portfolio governance dashboards</div>
                <div style={featureItem}>Custom onboarding</div>
                <div style={featureItem}>Priority support</div>
              </div>

              <a href="/pricing" style={lightBtn}>
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...sectionWrap, background: "#ffffff" }}>
        <div style={sectionInner}>
          <h2 style={sectionTitle}>Who TeamVase is for</h2>

          <div style={threeGrid}>
            <div style={featureCard}>
              <div style={featureHeading}>Planners & Schedulers</div>
              <div style={featureBody}>
                Quickly identify logic gaps, float exposure, open ends, risk drivers, and schedule
                quality issues before they become reporting problems.
              </div>
            </div>

            <div style={featureCard}>
              <div style={featureHeading}>Project Controls Managers</div>
              <div style={featureBody}>
                Review saved analyses, compare jobs, monitor portfolio health, generate reports, and
                explain project risk to leadership.
              </div>
            </div>

            <div style={featureCard}>
              <div style={featureHeading}>Executives & Project Directors</div>
              <div style={featureBody}>
                Get decision-ready summaries that explain performance, forecast risk, intervention
                priorities, and delivery confidence.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={ctaSection}>
        <div style={sectionInner}>
          <div style={ctaBox}>
            <h2 style={ctaTitle}>Turn project schedules into executive intelligence</h2>

            <p style={ctaText}>
              Upload a Primavera P6 schedule, generate schedule diagnostics, compare project
              performance, save reports, and export management-ready AI insights in minutes.
            </p>

            <div style={buttonRow}>
              <a href="/register?next=/upload" style={whiteBtn}>
                Start Free
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

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div style={featureCard}>
      <div style={featureHeading}>{title}</div>
      <div style={featureBody}>{text}</div>
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

const sixGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

const workflowCard: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 8px 26px rgba(15, 23, 42, 0.06)",
};

const workflowNumber: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "14px",
  background: "#dbeafe",
  color: "#1d4ed8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  marginBottom: "18px",
};

const workflowTitle: CSSProperties = {
  margin: 0,
  fontSize: "22px",
  color: "#0f172a",
  fontWeight: 900,
};

const workflowText: CSSProperties = {
  marginTop: "10px",
  marginBottom: 0,
  color: "#475569",
  fontSize: "14px",
  lineHeight: 1.8,
};

const comparisonGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "24px",
};

const comparisonCard: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "26px",
  boxShadow: "0 8px 26px rgba(15, 23, 42, 0.06)",
};

const comparisonTitle: CSSProperties = {
  marginTop: 0,
  marginBottom: "18px",
  fontSize: "24px",
  fontWeight: 900,
  color: "#0f172a",
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: "20px",
  color: "#334155",
  lineHeight: 1.9,
  fontSize: "15px",
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
