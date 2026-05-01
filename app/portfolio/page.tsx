"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { apiFetch } from "@/lib/api";

type JobRow = {
  id: number;
  project_id: number;
  filename: string;
  version: string;
  status: string;
  created_at?: string;
  analysis?: {
    health_score?: number;
    open_ends?: number;
    negative_float?: number;
    total_activities?: number;
    executive_summary?: string;
  } | null;
  error?: string | null;
};

type MeResponse = {
  id: number;
  email: string;
  plan: string;
  usage?: {
    uploads_used: number;
    upload_limit: number | null;
    reports_used: number;
    report_limit: number | null;
  };
};

type MetricRow = {
  id: number;
  name: string;
  version: string;
  health: number;
  openEnds: number;
  negFloat: number;
  activities: number;
  risk: "HIGH" | "MEDIUM" | "LOW";
  createdAt?: string;
};

function getRiskFromHealth(health: number): "HIGH" | "MEDIUM" | "LOW" {
  if (health >= 80) return "LOW";
  if (health >= 50) return "MEDIUM";
  return "HIGH";
}

function getHealthColor(health: number): string {
  if (health >= 80) return "#16a34a";
  if (health >= 50) return "#f59e0b";
  return "#dc2626";
}

function getRiskColor(risk: "HIGH" | "MEDIUM" | "LOW"): string {
  if (risk === "LOW") return "#16a34a";
  if (risk === "MEDIUM") return "#f59e0b";
  return "#dc2626";
}

function normalizeJobsResponse(data: any): JobRow[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.jobs)) return data.jobs;
  return [];
}

function ConversionBanner({ me, jobsCount }: { me: MeResponse | null; jobsCount: number }) {
  const plan = String(me?.plan || "free").toLowerCase();
  const used = me?.usage?.uploads_used ?? 0;
  const limit = me?.usage?.upload_limit ?? null;

  if (plan === "pro") return null;

  const limitReached = limit !== null && used >= limit;
  const nearLimit = limit !== null && limit > 0 && used / limit >= 0.8 && used < limit;

  if (jobsCount === 0) {
    return (
      <div style={bannerStyle("#eff6ff", "#bfdbfe")}>
        <div>
          <div style={bannerTitleStyle("#1e3a8a")}>Build your first portfolio view</div>
          <div style={bannerTextStyle}>
            Upload at least one completed schedule to activate trend, ranking, and risk mix views.
          </div>
        </div>
        <button onClick={() => (window.location.href = "/")} style={primaryButtonStyle}>
          Upload Schedule
        </button>
      </div>
    );
  }

  if (limitReached || nearLimit) {
    return (
      <div style={bannerStyle(limitReached ? "#fef2f2" : "#fffbeb", limitReached ? "#fecaca" : "#fde68a")}>
        <div>
          <div style={bannerTitleStyle(limitReached ? "#991b1b" : "#92400e")}>
            {limitReached ? "Portfolio growth is blocked" : "You’re close to your free upload limit"}
          </div>
          <div style={bannerTextStyle}>
            {limitReached
              ? `You have used ${used}/${limit} free uploads. Upgrade to Pro to keep building your project portfolio.`
              : `You have used ${used}/${limit} free uploads. Upgrade now for uninterrupted portfolio analytics.`}
          </div>
        </div>
        <button onClick={() => (window.location.href = "/pricing")} style={primaryButtonStyle}>
          Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div style={bannerStyle("#eff6ff", "#bfdbfe")}>
      <div>
        <div style={bannerTitleStyle("#1e3a8a")}>Unlock portfolio intelligence with Pro</div>
        <div style={bannerTextStyle}>
          Pro gives you unlimited uploads, AI explanations, comparison insights, and unlimited saved reports.
        </div>
      </div>
      <button onClick={() => (window.location.href = "/pricing")} style={primaryButtonStyle}>
        View Pro Plan
      </button>
    </div>
  );
}

export default function PortfolioPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [jobsRes, meRes] = await Promise.all([apiFetch("/jobs/my"), apiFetch("/auth/me")]);

        const jobsData = await jobsRes.json();
        const meData = await meRes.json();

        if (!jobsRes.ok) {
          throw new Error(jobsData?.detail || jobsData?.error || "Failed to load portfolio.");
        }

        setJobs(normalizeJobsResponse(jobsData));
        if (meRes.ok) setMe(meData);
      } catch (err: any) {
        console.error("PORTFOLIO FETCH ERROR:", err);
        setError(err?.message || "Failed to load portfolio.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const latestUniqueMetrics = useMemo(() => {
    const doneJobs = jobs.filter((j) => String(j.status).toLowerCase() === "done");
    const latestByFilename = new Map<string, JobRow>();

    for (const job of doneJobs) {
      const existing = latestByFilename.get(job.filename);
      if (!existing || job.id > existing.id) latestByFilename.set(job.filename, job);
    }

    return Array.from(latestByFilename.values())
      .sort((a, b) => b.id - a.id)
      .map((j) => {
        const health = j.analysis?.health_score ?? 0;
        const openEnds = j.analysis?.open_ends ?? 0;
        const negFloat = j.analysis?.negative_float ?? 0;
        const activities = j.analysis?.total_activities ?? 0;

        return {
          id: j.id,
          name: j.filename || `Job ${j.id}`,
          version: j.version || "",
          health,
          openEnds,
          negFloat,
          activities,
          risk: getRiskFromHealth(health),
          createdAt: j.created_at,
        } as MetricRow;
      });
  }, [jobs]);

  const avgHealth =
    latestUniqueMetrics.length > 0
      ? (
          latestUniqueMetrics.reduce((sum, row) => sum + row.health, 0) /
          latestUniqueMetrics.length
        ).toFixed(1)
      : "0.0";

  const highRisk = latestUniqueMetrics.filter((m) => m.risk === "HIGH").length;
  const mediumRisk = latestUniqueMetrics.filter((m) => m.risk === "MEDIUM").length;
  const lowRisk = latestUniqueMetrics.filter((m) => m.risk === "LOW").length;
  const rankingData = [...latestUniqueMetrics].sort((a, b) => b.health - a.health);

  if (loading) return <div style={{ padding: 24 }}>Loading portfolio dashboard...</div>;

  if (error) {
    return (
      <div style={{ padding: 24, color: "#dc2626" }}>
        <h2>Portfolio load failed</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gap: 24 }}>
        <section
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
            color: "#ffffff",
            borderRadius: 24,
            padding: "28px 30px",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#cbd5e1" }}>
                TeamVase AI Copilot
              </div>
              <h1 style={{ margin: "10px 0 8px", fontSize: 34, lineHeight: 1.1, fontWeight: 900 }}>
                Portfolio Dashboard
              </h1>
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: 15 }}>
                Compare project health, risk exposure, and schedule performance across completed analyses.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/my-analyses")}
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Select Jobs to Compare
            </button>
          </div>
        </section>

        <ConversionBanner me={me} jobsCount={latestUniqueMetrics.length} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
          <Card title="Avg Health" value={avgHealth} valueColor={getHealthColor(Number(avgHealth))} />
          <Card title="Total Jobs" value={latestUniqueMetrics.length} />
          <Card title="High Risk" value={highRisk} valueColor="#dc2626" />
          <Card title="Risk Mix" value={`${lowRisk}/${mediumRisk}/${highRisk}`} subtitle="Low / Medium / High" />
        </div>

        <section style={chartCard}>
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Health Trend</h2>
          {latestUniqueMetrics.length === 0 ? (
            <div style={emptyBox}>No completed jobs available for trend analysis.</div>
          ) : (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={latestUniqueMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="health" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section style={chartCard}>
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Portfolio Ranking</h2>
          {rankingData.length === 0 ? (
            <div style={emptyBox}>No completed jobs available for ranking.</div>
          ) : (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={rankingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="health">
                    {rankingData.map((entry) => (
                      <Cell key={entry.id} fill={getHealthColor(entry.health)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ padding: "20px 22px", borderBottom: "1px solid #e5e7eb" }}>
            <h2 style={{ margin: 0, color: "#0f172a" }}>Latest Jobs by File</h2>
            <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 14 }}>
              Latest completed schedule analysis per uploaded file.
            </p>
          </div>

          {latestUniqueMetrics.map((m) => (
            <div
              key={m.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(240px, 1.3fr) minmax(320px, 1.8fr) 100px",
                gap: 16,
                alignItems: "center",
                padding: "14px 18px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: "#0f172a" }}>{m.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {m.version ? `${m.version} • ` : ""}Job {m.id}
                </div>
              </div>

              <div style={{ color: "#334155", fontSize: 14 }}>
                Health: <span style={{ fontWeight: 800, color: getHealthColor(m.health) }}>{m.health}</span>
                {" | "}Open Ends: {m.openEnds}
                {" | "}Float: {m.negFloat}
                {" | "}Activities: {m.activities}
              </div>

              <div style={{ textAlign: "right", fontWeight: 900, color: getRiskColor(m.risk) }}>{m.risk}</div>
            </div>
          ))}

          {latestUniqueMetrics.length === 0 && <div style={{ padding: 22 }}>No completed jobs found.</div>}
        </section>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  subtitle,
  valueColor = "black",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div style={{ fontSize: 14, marginBottom: 8, color: "#64748b", fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 30, fontWeight: 900, color: valueColor }}>{value}</div>
      {subtitle ? <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{subtitle}</div> : null}
    </div>
  );
}

const chartCard: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 20,
  overflowX: "auto",
  boxShadow: "0 6px 20px rgba(15, 23, 42, 0.05)",
};

const emptyBox: React.CSSProperties = {
  border: "1px dashed #cbd5e1",
  borderRadius: 16,
  padding: 24,
  background: "#f8fafc",
  color: "#64748b",
};

function bannerStyle(bg: string, border: string): React.CSSProperties {
  return {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 20,
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    alignItems: "center",
  };
}

function bannerTitleStyle(color: string): React.CSSProperties {
  return {
    fontSize: 20,
    fontWeight: 900,
    color,
    marginBottom: 6,
  };
}

const bannerTextStyle: React.CSSProperties = {
  color: "#475569",
  fontSize: 14,
  lineHeight: 1.7,
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 900,
  cursor: "pointer",
};