"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { apiFetch, ApiError } from "@/lib/api";

/* ================= TYPES ================= */

type JobResponse = {
  job_id: number;
  project_id: number;
  version: string;
  filename: string;
  status: string;
  error?: string | null;
  analysis?: {
    health_score?: number;
    deterministic_health_score?: number;
    ai_health_score?: number;
    open_ends?: number;
    negative_float?: number;
    total_activities?: number;
    executive_summary?: string;
  } | null;
};

type MetricRow = {
  id: number;
  filename: string;
  shortName: string;
  version: string;
  health: number;
  openEnds: number;
  negativeFloat: number;
  totalActivities: number;
  deterministicHealth: number;
  aiHealth: number;
  score: number;
};

/* ================= HELPERS ================= */

function getHealthColor(h: number) {
  if (h >= 80) return "#16a34a";
  if (h >= 50) return "#f59e0b";
  return "#dc2626";
}

function getShortName(name: string) {
  if (!name) return "Unnamed";
  if (name.length < 24) return name;
  return name.slice(0, 21) + "...";
}

function scoreIndex(m: MetricRow) {
  return Math.max(
    0,
    Math.min(100, m.health * 2 - m.openEnds * 3 - m.negativeFloat * 5)
  );
}

function formatAI(text: string) {
  return text
    ?.replace(/^###\s?/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\n/g, "<br/>");
}

function PremiumLockCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #bfdbfe",
        background: "#eff6ff",
        borderRadius: 18,
        padding: 22,
        marginTop: 20,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 8,
        }}
      >
        🔒 {title}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#475569",
          lineHeight: 1.7,
          marginBottom: 16,
        }}
      >
        {message}
      </div>
      <button
        onClick={() => {
          window.location.href = "/pricing";
        }}
        style={{
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #2563eb",
          background: "#2563eb",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Upgrade to Pro
      </button>
    </div>
  );
}

/* ================= COMPONENT ================= */

export default function ComparePage() {
  const params = useSearchParams();
  const idsParam = params.get("ids");

  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compareLocked, setCompareLocked] = useState(false);
  const [compareError, setCompareError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveLocked, setSaveLocked] = useState(false);

  /* ================= FETCH JOBS ================= */

  useEffect(() => {
    if (!idsParam) return;

    const ids = idsParam.split(",");

    const fetchJobs = async () => {
      try {
        const res = await Promise.all(
          ids.map(async (id) => {
            const response = await apiFetch(`/jobs/${id}`);
            return response.json();
          })
        );

        setJobs(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [idsParam]);

  /* ================= METRICS ================= */

  const metrics: MetricRow[] = useMemo(() => {
    return jobs.map((j) => {
      const health = j.analysis?.health_score ?? 0;

      return {
        id: j.job_id,
        filename: j.filename,
        shortName: getShortName(j.filename),
        version: j.version,
        health,
        openEnds: j.analysis?.open_ends ?? 0,
        negativeFloat: j.analysis?.negative_float ?? 0,
        totalActivities: j.analysis?.total_activities ?? 0,
        deterministicHealth: j.analysis?.deterministic_health_score ?? health,
        aiHealth: j.analysis?.ai_health_score ?? health,
        score: 0,
      };
    });
  }, [jobs]);

  const enriched = metrics.map((m) => ({
    ...m,
    score: scoreIndex(m),
  }));

  const ranked = [...enriched].sort((a, b) => b.score - a.score);

  /* ================= AI COMPARE ================= */

  useEffect(() => {
    if (!metrics.length) return;

    const runAI = async () => {
      try {
        setCompareLocked(false);
        setCompareError("");

        const res = await apiFetch("/ai/compare", {
          method: "POST",
          body: JSON.stringify({
            jobs: metrics.map((m) => ({
              id: m.id,
              filename: m.filename,
              health: m.health,
              openEnds: m.openEnds,
              negativeFloat: m.negativeFloat,
            })),
          }),
        });

        const data = await res.json();
        setAiInsight(data?.insight || "");
      } catch (err: any) {
        console.error("AI COMPARE ERROR:", err);

        if (err instanceof ApiError && err.status === 403) {
          setCompareLocked(true);
          setCompareError("");
          return;
        }

        setCompareError("Failed to generate AI comparison insight.");
      }
    };

    runAI();
  }, [metrics]);

  /* ================= EXEC KPIs ================= */

  const avgHealth =
    enriched.reduce((a, b) => a + b.health, 0) / enriched.length || 0;

  const worstHealth =
    enriched.length > 0 ? Math.min(...enriched.map((m) => m.health)) : 0;

  const totalOpen = enriched.reduce((a, b) => a + b.openEnds, 0);
  const totalNeg = enriched.reduce((a, b) => a + b.negativeFloat, 0);

  /* ================= SAVE SNAPSHOT ================= */

  const saveSnapshot = async () => {
    try {
      setSaving(true);
      setSaveError("");
      setSaveLocked(false);

      const title =
        jobs.length > 0
          ? `Comparison Snapshot - ${new Date().toLocaleString()}`
          : `Comparison Snapshot`;

      const description = `Saved comparison snapshot for ${jobs.length} selected job(s).`;

      const snapshot_json = {
        selected_ids: metrics.map((m) => m.id),
        metrics: enriched,
        ranked,
        aiInsight,
        jobs,
        summary: {
          avgHealth,
          worstHealth,
          totalOpen,
          totalNeg,
        },
      };

      const res = await apiFetch("/reports/save", {
        method: "POST",
        body: JSON.stringify({
          report_type: "comparison",
          title,
          description,
          snapshot_json,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Failed to save snapshot");
      }

      alert("Comparison snapshot saved successfully.");
    } catch (err: any) {
      console.error("SAVE SNAPSHOT ERROR:", err);

      if (err instanceof ApiError && err.status === 403) {
        setSaveLocked(true);
        setSaveError(err.detail || "Saved report limit reached.");
        return;
      }

      setSaveError(err?.message || "Unknown error");
      alert(`Save failed: ${err?.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  /* ================= UI ================= */

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>Portfolio Comparison</h1>

        <button
          onClick={saveSnapshot}
          disabled={saving || jobs.length === 0}
          style={{
            background: saving ? "#94a3b8" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px 18px",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Snapshot"}
        </button>
      </div>

      {/* ===== EXEC KPIs ===== */}
      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <KPI title="Average Health" value={avgHealth.toFixed(1)} />
        <KPI title="Worst Health" value={worstHealth} />
        <KPI title="Total Open Ends" value={totalOpen} />
        <KPI title="Total Negative Float" value={totalNeg} />
      </div>

      {/* ===== SAVE LOCK ===== */}
      {saveLocked && (
        <PremiumLockCard
          title="Saved report limit reached"
          message={saveError || "Upgrade to Pro to save more comparison snapshots."}
        />
      )}

      {/* ===== AI INSIGHT ===== */}
      <div style={card}>
        <h2>AI Copilot Insight</h2>

        {compareLocked ? (
          <PremiumLockCard
            title="AI Compare is a Pro feature"
            message="Upgrade to Pro to unlock portfolio-level comparison narratives, ranking justification, and management-focused prioritization."
          />
        ) : compareError ? (
          <p style={{ color: "#991b1b", fontWeight: 600 }}>{compareError}</p>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: formatAI(aiInsight || "Generating insight..."),
            }}
          />
        )}
      </div>

      {/* ===== CHART ===== */}
      <div style={card}>
        <h2>Performance Ranking</h2>
        <BarChart width={1000} height={300} data={ranked}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="shortName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score">
            {ranked.map((e) => (
              <Cell key={e.id} fill={getHealthColor(e.health)} />
            ))}
          </Bar>
        </BarChart>
      </div>

      {/* ===== CARDS ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
        }}
      >
        {enriched.map((m) => (
          <div key={m.id} style={card}>
            <h3>{m.filename}</h3>
            <p>Health: {m.health}</p>
            <p>Open Ends: {m.openEnds}</p>
            <p>Negative Float: {m.negativeFloat}</p>
            <p>Total Activities: {m.totalActivities}</p>
            <p>AI Score: {m.aiHealth}</p>
          </div>
        ))}
      </div>

      {/* ===== EXEC SUMMARY ===== */}
      <div style={{ marginTop: 30 }}>
        <h2>Executive Summaries</h2>
        {jobs.map((j) => (
          <div key={j.job_id} style={card}>
            <h3>{j.filename}</h3>
            <p>{j.analysis?.executive_summary || "No summary available."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function KPI({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        minWidth: 200,
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: 13, color: "#64748b" }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>{value}</div>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginTop: 20,
};