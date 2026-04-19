"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type JobItem = {
  id: number;
  project_id: number;
  filename: string;
  version: string;
  status: string;
  created_at?: string;
  analysis?: any;
  error?: string | null;
};

function getStatusTone(status: string) {
  const s = String(status || "").toLowerCase();

  if (s === "done") {
    return {
      label: "Completed",
      bg: "#dcfce7",
      color: "#166534",
      border: "#86efac",
    };
  }

  if (s === "processing" || s === "queued") {
    return {
      label: s === "queued" ? "Queued" : "Processing",
      bg: "#dbeafe",
      color: "#1d4ed8",
      border: "#93c5fd",
    };
  }

  if (s === "failed") {
    return {
      label: "Failed",
      bg: "#fee2e2",
      color: "#991b1b",
      border: "#fca5a5",
    };
  }

  return {
    label: status || "Unknown",
    bg: "#f1f5f9",
    color: "#334155",
    border: "#cbd5e1",
  };
}

function getHealthTone(score: number) {
  if (score >= 75) {
    return {
      label: "Good",
      bg: "#dcfce7",
      color: "#166534",
      border: "#86efac",
    };
  }

  if (score >= 60) {
    return {
      label: "Moderate",
      bg: "#fef3c7",
      color: "#92400e",
      border: "#fcd34d",
    };
  }

  return {
    label: "Critical",
    bg: "#fee2e2",
    color: "#991b1b",
    border: "#fca5a5",
  };
}

function formatDate(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
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
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "20px",
        minHeight: "120px",
        boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: accent,
        }}
      />
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: "14px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "34px",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: "12px",
          fontSize: "13px",
          color: "#475569",
        }}
      >
        {note}
      </div>
    </div>
  );
}

export default function MyAnalysesPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await apiFetch("/jobs/my");
        const data = await res.json();

        if (Array.isArray(data)) {
          setJobs(data);
        } else if (Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error("FETCH JOBS ERROR:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const completedJobs = useMemo(
    () => jobs.filter((j) => String(j.status).toLowerCase() === "done").length,
    [jobs]
  );

  const failedJobs = useMemo(
    () => jobs.filter((j) => String(j.status).toLowerCase() === "failed").length,
    [jobs]
  );

  const avgHealthScore = useMemo(() => {
    const valid = jobs
      .map((j) => Number(j.analysis?.health_score))
      .filter((v) => !Number.isNaN(v) && v > 0);

    if (valid.length === 0) return 0;

    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
  }, [jobs]);

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
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gap: "24px",
        }}
      >
        <section
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
            color: "#ffffff",
            borderRadius: "24px",
            padding: "28px 30px",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#cbd5e1",
                }}
              >
                TeamVase AI Copilot
              </div>

              <h1
                style={{
                  margin: "10px 0 8px",
                  fontSize: "34px",
                  lineHeight: 1.1,
                  fontWeight: 800,
                }}
              >
                My Saved Analyses
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: "15px",
                }}
              >
                Review saved dashboards, reopen analyses, and compare completed jobs.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  if (selected.length < 2) {
                    alert("Select at least 2 completed jobs to compare");
                    return;
                  }

                  window.location.href = `/compare?ids=${selected.join(",")}`;
                }}
                style={{
                  padding: "12px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Compare Selected ({selected.length})
              </button>

              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                style={{
                  padding: "12px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                New Upload
              </button>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          <SummaryCard
            title="Total Saved Jobs"
            value={jobs.length}
            note="All analyses linked to your account"
            accent="#2563eb"
          />
          <SummaryCard
            title="Completed"
            value={completedJobs}
            note="Dashboards ready for review"
            accent="#16a34a"
          />
          <SummaryCard
            title="Failed"
            value={failedJobs}
            note="Analyses requiring attention"
            accent="#dc2626"
          />
          <SummaryCard
            title="Average Health"
            value={avgHealthScore}
            note="Across saved analysed jobs"
            accent="#7c3aed"
          />
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Dashboard Library
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "14px",
                  color: "#64748b",
                }}
              >
                Saved project analyses available for reopening and comparison.
              </p>
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#475569",
                fontWeight: 600,
              }}
            >
              {loading ? "Loading analyses..." : `${jobs.length} item(s) found`}
            </div>
          </div>

          {loading ? (
            <p style={{ margin: 0, color: "#475569" }}>Loading saved analyses...</p>
          ) : jobs.length === 0 ? (
            <div
              style={{
                border: "1px dashed #cbd5e1",
                borderRadius: "18px",
                padding: "28px",
                textAlign: "center",
                color: "#64748b",
                background: "#f8fafc",
              }}
            >
              No saved analyses found yet.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              {jobs.map((job) => {
                const statusTone = getStatusTone(job.status);
                const healthScore = Number(job.analysis?.health_score ?? 0);
                const healthTone = getHealthTone(healthScore);
                const isDone = String(job.status).toLowerCase() === "done";

                return (
                  <div
                    key={job.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "20px",
                      padding: "20px",
                      background: "#ffffff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "18px",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                        <input
                          type="checkbox"
                          checked={selected.includes(job.id)}
                          disabled={!isDone}
                          onChange={() => toggleSelect(job.id)}
                          style={{
                            marginTop: "6px",
                            width: "16px",
                            height: "16px",
                            cursor: isDone ? "pointer" : "not-allowed",
                          }}
                        />

                        <div>
                          <div
                            style={{
                              fontSize: "18px",
                              fontWeight: 800,
                              color: "#0f172a",
                            }}
                          >
                            {job.filename}
                          </div>

                          <div
                            style={{
                              marginTop: "6px",
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                padding: "6px 10px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: 700,
                                background: statusTone.bg,
                                color: statusTone.color,
                                border: `1px solid ${statusTone.border}`,
                              }}
                            >
                              {statusTone.label}
                            </span>

                            {isDone ? (
                              <span
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "999px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  background: healthTone.bg,
                                  color: healthTone.color,
                                  border: `1px solid ${healthTone.border}`,
                                }}
                              >
                                Health {healthScore} · {healthTone.label}
                              </span>
                            ) : null}

                            <span
                              style={{
                                fontSize: "13px",
                                color: "#64748b",
                                fontWeight: 600,
                              }}
                            >
                              Job #{job.id}
                            </span>
                          </div>

                          <div
                            style={{
                              marginTop: "10px",
                              display: "grid",
                              gap: "6px",
                              color: "#475569",
                              fontSize: "14px",
                            }}
                          >
                            <div>Version: {job.version || "N/A"}</div>
                            <div>Created: {formatDate(job.created_at)}</div>
                            <div>Project ID: {job.project_id}</div>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() =>
                            (window.location.href = `/dashboard?job_id=${job.id}`)
                          }
                          style={{
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            color: "#0f172a",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Open Dashboard
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "18px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            marginBottom: "8px",
                          }}
                        >
                          Activities
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          {job.analysis?.total_activities ?? "-"}
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            marginBottom: "8px",
                          }}
                        >
                          Open Ends
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          {job.analysis?.open_ends ?? "-"}
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            marginBottom: "8px",
                          }}
                        >
                          Negative Float
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          {job.analysis?.negative_float ?? "-"}
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            marginBottom: "8px",
                          }}
                        >
                          Summary
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.6,
                            color: "#334155",
                          }}
                        >
                          {job.analysis?.executive_summary
                            ? String(job.analysis.executive_summary).slice(0, 140) + "..."
                            : job.error || "Analysis not available yet."}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}