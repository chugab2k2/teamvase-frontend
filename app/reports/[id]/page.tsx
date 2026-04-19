"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { apiFetch } from "@/lib/api";

type SavedReport = {
  id: number;
  report_type: string;
  title: string;
  description?: string | null;
  snapshot_json: any;
  created_at?: string;
  updated_at?: string;
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

function formatDate(value?: string) {
  if (!value) return "N/A";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleString();
}

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
  return String(text || "")
    .replace(/^###\s?/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\n/g, "<br/>");
}

function SummaryCard({
  title,
  value,
  note,
  accent,
}: {
  title: string;
  value: string | number;
  note: string;
  accent: string;
}) {
  return (
    <div className="summary-card">
      <div className="summary-card-accent" style={{ background: accent }} />
      <div className="summary-card-title">{title}</div>
      <div className="summary-card-value">{value}</div>
      <div className="summary-card-note">{note}</div>
    </div>
  );
}

function normalizeMetrics(snapshot: any): MetricRow[] {
  const metrics = Array.isArray(snapshot?.metrics) ? snapshot.metrics : [];

  return metrics.map((m: any) => {
    const filename = m?.filename || m?.name || `Job ${m?.id ?? ""}`;
    const health = Number(m?.health ?? 0);
    const openEnds = Number(m?.openEnds ?? m?.open_ends ?? 0);
    const negativeFloat = Number(m?.negativeFloat ?? m?.negative_float ?? 0);
    const totalActivities = Number(
      m?.totalActivities ?? m?.total_activities ?? 0
    );
    const deterministicHealth = Number(
      m?.deterministicHealth ?? m?.deterministic_health_score ?? health
    );
    const aiHealth = Number(m?.aiHealth ?? m?.ai_health_score ?? health);

    return {
      id: Number(m?.id ?? 0),
      filename,
      shortName: getShortName(filename),
      version: String(m?.version ?? ""),
      health,
      openEnds,
      negativeFloat,
      totalActivities,
      deterministicHealth,
      aiHealth,
      score: Number(
        m?.score ??
          scoreIndex({
            id: Number(m?.id ?? 0),
            filename,
            shortName: getShortName(filename),
            version: String(m?.version ?? ""),
            health,
            openEnds,
            negativeFloat,
            totalActivities,
            deterministicHealth,
            aiHealth,
            score: 0,
          })
      ),
    };
  });
}

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<SavedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch(`/reports/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.detail || data?.error || "Failed to load report.");
        }

        setReport(data);
      } catch (err: any) {
        console.error("REPORT DETAIL FETCH ERROR:", err);
        setError(err?.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const snapshot = report?.snapshot_json || {};
  const metrics = useMemo(() => normalizeMetrics(snapshot), [snapshot]);
  const ranked = useMemo(
    () => [...metrics].sort((a, b) => b.score - a.score),
    [metrics]
  );

  const jobs = Array.isArray(snapshot?.jobs) ? snapshot.jobs : [];
  const aiInsight = String(snapshot?.aiInsight || "");
  const avgHealth =
    typeof snapshot?.summary?.avgHealth !== "undefined"
      ? Number(snapshot.summary.avgHealth)
      : metrics.length
      ? metrics.reduce((a, b) => a + b.health, 0) / metrics.length
      : 0;

  const worstHealth =
    typeof snapshot?.summary?.worstHealth !== "undefined"
      ? Number(snapshot.summary.worstHealth)
      : metrics.length
      ? Math.min(...metrics.map((m) => m.health))
      : 0;

  const totalOpen =
    typeof snapshot?.summary?.totalOpen !== "undefined"
      ? Number(snapshot.summary.totalOpen)
      : metrics.reduce((a, b) => a + b.openEnds, 0);

  const totalNeg =
    typeof snapshot?.summary?.totalNeg !== "undefined"
      ? Number(snapshot.summary.totalNeg)
      : metrics.reduce((a, b) => a + b.negativeFloat, 0);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Loading saved report...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: "#dc2626" }}>
        <h2>Saved report load failed</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Report not found</h2>
      </div>
    );
  }

  return (
    <>
      <div className="report-page">
        <div className="report-wrap">
          <section className="hero">
            <div className="hero-top">
              <div>
                <div className="eyebrow">TeamVase AI Copilot</div>

                <h1 className="hero-title">{report.title}</h1>

                <p className="hero-subtitle">
                  {report.description || "Saved report snapshot"}
                </p>

                <div className="meta-grid">
                  <div>Type: {report.report_type}</div>
                  <div>Created: {formatDate(report.created_at)}</div>
                  <div>Updated: {formatDate(report.updated_at)}</div>
                  <div>Report ID: {report.id}</div>
                </div>
              </div>

              <div className="hero-actions no-print">
                <button
                  onClick={() => {
                    window.location.href = "/reports";
                  }}
                  className="secondary-btn"
                >
                  Back to Reports
                </button>

                <button onClick={handlePrint} className="primary-btn">
                  Export PDF
                </button>
              </div>
            </div>
          </section>

          <section className="summary-grid">
            <SummaryCard
              title="Average Health"
              value={avgHealth.toFixed(1)}
              note="Snapshot average across compared jobs"
              accent="#2563eb"
            />
            <SummaryCard
              title="Worst Health"
              value={worstHealth}
              note="Weakest job in snapshot"
              accent="#dc2626"
            />
            <SummaryCard
              title="Total Open Ends"
              value={totalOpen}
              note="Combined logic exposure"
              accent="#f59e0b"
            />
            <SummaryCard
              title="Total Negative Float"
              value={totalNeg}
              note="Combined schedule pressure"
              accent="#7c3aed"
            />
          </section>

          <section className="card">
            <h2 className="section-title">AI Copilot Insight</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: formatAI(aiInsight || "No AI insight saved in this snapshot."),
              }}
            />
          </section>

          <section className="card avoid-break">
            <h2 className="section-title">Performance Ranking</h2>
            {ranked.length === 0 ? (
              <p>No ranking data available.</p>
            ) : (
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={ranked}>
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
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="card">
            <h2 className="section-title">Compared Jobs</h2>
            {metrics.length === 0 ? (
              <p>No saved metrics found in this report.</p>
            ) : (
              <div className="jobs-grid">
                {metrics.map((m) => (
                  <div key={m.id} className="job-card avoid-break-inside">
                    <h3 className="job-title">{m.filename}</h3>
                    <p className="job-line">
                      Health: <strong>{m.health}</strong>
                    </p>
                    <p className="job-line">
                      Open Ends: <strong>{m.openEnds}</strong>
                    </p>
                    <p className="job-line">
                      Negative Float: <strong>{m.negativeFloat}</strong>
                    </p>
                    <p className="job-line">
                      Total Activities: <strong>{m.totalActivities}</strong>
                    </p>
                    <p className="job-line">
                      Deterministic Score: <strong>{m.deterministicHealth}</strong>
                    </p>
                    <p className="job-line">
                      AI Score: <strong>{m.aiHealth}</strong>
                    </p>
                    <p className="job-line">
                      Comparison Score: <strong>{m.score}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <h2 className="section-title">Executive Summaries</h2>
            {jobs.length === 0 ? (
              <p>No saved executive summaries found.</p>
            ) : (
              <div className="summary-list">
                {jobs.map((j: any, idx: number) => (
                  <div
                    key={j?.job_id ?? idx}
                    className="summary-item avoid-break-inside"
                  >
                    <h3 className="job-title">
                      {j?.filename || `Job ${j?.job_id ?? idx + 1}`}
                    </h3>
                    <p className="summary-text">
                      {j?.analysis?.executive_summary || "No summary available."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx global>{`
        .report-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 32px;
        }

        .report-wrap {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          gap: 24px;
        }

        .hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%);
          color: #ffffff;
          border-radius: 24px;
          padding: 28px 30px;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
        }

        .hero-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .eyebrow {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #cbd5e1;
        }

        .hero-title {
          margin: 10px 0 8px;
          font-size: 34px;
          line-height: 1.1;
          font-weight: 800;
        }

        .hero-subtitle {
          margin: 0;
          color: #cbd5e1;
          font-size: 15px;
        }

        .meta-grid {
          margin-top: 12px;
          font-size: 13px;
          color: #cbd5e1;
          display: grid;
          gap: 4px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .primary-btn,
        .secondary-btn {
          padding: 12px 16px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .primary-btn {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: #2563eb;
          color: #fff;
        }

        .secondary-btn {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }

        .summary-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 20px;
          min-height: 120px;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
          position: relative;
          overflow: hidden;
        }

        .summary-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
        }

        .summary-card-title {
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 14px;
        }

        .summary-card-value {
          font-size: 34px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        .summary-card-note {
          margin-top: 12px;
          font-size: 13px;
          color: #475569;
        }

        .card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
        }

        .section-title {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        .chart-wrap {
          width: 100%;
          min-height: 320px;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }

        .job-card,
        .summary-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
        }

        .job-title {
          margin-top: 0;
          margin-bottom: 12px;
          color: #0f172a;
        }

        .job-line {
          margin: 6px 0;
          color: #334155;
        }

        .summary-list {
          display: grid;
          gap: 16px;
        }

        .summary-text {
          margin: 0;
          color: #334155;
          line-height: 1.7;
        }

        .avoid-break {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .avoid-break-inside {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 14mm;
          }

          header,
          .no-print,
          button {
            display: none !important;
          }

          body {
            background: #ffffff !important;
          }

          .report-page {
            background: #ffffff !important;
            padding: 0 !important;
          }

          .report-wrap {
            max-width: 100% !important;
            gap: 14px !important;
          }

          .hero {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            color: #0f172a !important;
            background: #ffffff !important;
          }

          .eyebrow,
          .hero-subtitle,
          .meta-grid {
            color: #334155 !important;
          }

          .card,
          .summary-card,
          .job-card,
          .summary-item {
            box-shadow: none !important;
          }

          .summary-grid,
          .jobs-grid {
            gap: 12px !important;
          }

          .chart-wrap {
            min-height: 280px !important;
          }
        }
      `}</style>
    </>
  );
}