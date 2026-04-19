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
    deterministic_health_score?: number;
    ai_health_score?: number;
    open_ends?: number;
    negative_float?: number;
    total_activities?: number;
    key_findings?: string[];
    immediate_actions?: string[];
    executive_summary?: string;
    health_score_breakdown?: {
      base_score?: number;
      penalties?: Record<string, number>;
      inputs?: Record<string, number | string | null>;
      deterministic_score?: number;
    };
  } | null;
  error?: string | null;
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

export default function PortfolioPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch("/jobs/my");
        const data = await res.json();

        console.log("PORTFOLIO JOBS:", data);

        if (!res.ok) {
          throw new Error(data?.detail || data?.error || "Failed to load portfolio.");
        }

        const normalized = normalizeJobsResponse(data);

        if (!Array.isArray(normalized)) {
          throw new Error("Invalid /jobs/my response format.");
        }

        setJobs(normalized);
      } catch (err: any) {
        console.error("PORTFOLIO FETCH ERROR:", err);
        setError(err?.message || "Failed to load portfolio.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const latestUniqueMetrics = useMemo(() => {
    const doneJobs = jobs.filter((j) => j.status === "done");

    const latestByFilename = new Map<string, JobRow>();

    for (const job of doneJobs) {
      const existing = latestByFilename.get(job.filename);
      if (!existing || job.id > existing.id) {
        latestByFilename.set(job.filename, job);
      }
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
  const mediumRisk = latestUniqueMetrics.filter(
    (m) => m.risk === "MEDIUM"
  ).length;
  const lowRisk = latestUniqueMetrics.filter((m) => m.risk === "LOW").length;

  const rankingData = [...latestUniqueMetrics].sort(
    (a, b) => b.health - a.health
  );

  if (loading) {
    return <div style={{ padding: 24 }}>Loading portfolio dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: "#dc2626" }}>
        <h2>Portfolio load failed</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: 24 }}>Portfolio Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <Card
          title="Avg Health"
          value={avgHealth}
          valueColor={getHealthColor(Number(avgHealth))}
        />
        <Card title="Total Jobs" value={latestUniqueMetrics.length} />
        <Card title="High Risk" value={highRisk} valueColor="#dc2626" />
        <Card
          title="Risk Mix"
          value={`${lowRisk}/${mediumRisk}/${highRisk}`}
          subtitle="Low / Medium / High"
        />
      </div>

      <h2 style={{ marginBottom: 12 }}>Health Trend</h2>
      <div style={chartCard}>
        <LineChart width={1100} height={300} data={latestUniqueMetrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="health"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </div>

      <h2 style={{ marginTop: 36, marginBottom: 12 }}>Portfolio Ranking</h2>
      <div style={chartCard}>
        <BarChart width={1100} height={300} data={rankingData}>
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
      </div>

      <h2 style={{ marginTop: 36, marginBottom: 12 }}>Latest Jobs by File</h2>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {latestUniqueMetrics.map((m) => (
          <div
            key={m.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1.8fr 0.5fr",
              gap: 16,
              alignItems: "center",
              padding: "14px 18px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                {m.version ? `${m.version} • ` : ""}Job {m.id}
              </div>
            </div>

            <div>
              Health:{" "}
              <span
                style={{ fontWeight: 700, color: getHealthColor(m.health) }}
              >
                {m.health}
              </span>
              {" | "}Open Ends: {m.openEnds}
              {" | "}Float: {m.negFloat}
              {" | "}Activities: {m.activities}
            </div>

            <div
              style={{
                textAlign: "right",
                fontWeight: 700,
                color: getRiskColor(m.risk),
              }}
            >
              {m.risk}
            </div>
          </div>
        ))}

        {latestUniqueMetrics.length === 0 && (
          <div style={{ padding: 18 }}>No completed jobs found.</div>
        )}
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
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 14, marginBottom: 8 }}>{title}</div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: valueColor,
        }}
      >
        {value}
      </div>
      {subtitle ? (
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

const chartCard = {
  width: "1130px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  overflowX: "auto" as const,
};