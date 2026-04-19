"use client";

import { useEffect, useMemo, useState } from "react";
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

function formatDate(value?: string) {
  if (!value) return "N/A";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleString();
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

function inferSavedJobsCount(snapshot: any) {
  if (!snapshot) return 0;
  if (Array.isArray(snapshot.selected_ids)) return snapshot.selected_ids.length;
  if (Array.isArray(snapshot.jobs)) return snapshot.jobs.length;
  if (Array.isArray(snapshot.metrics)) return snapshot.metrics.length;
  return 0;
}

function inferAverageHealth(snapshot: any) {
  const metrics = Array.isArray(snapshot?.metrics) ? snapshot.metrics : [];
  if (!metrics.length) return 0;

  const values = metrics
    .map((m: any) => Number(m?.health))
    .filter((v: number) => !Number.isNaN(v));

  if (!values.length) return 0;

  return Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length);
}

export default function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingReport, setEditingReport] = useState<SavedReport | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [reportsRes, meRes] = await Promise.all([
        apiFetch("/reports/my"),
        apiFetch("/auth/me"),
      ]);

      const reportsData = await reportsRes.json();
      const meData = await meRes.json();

      if (!reportsRes.ok) {
        throw new Error(reportsData?.detail || reportsData?.error || "Failed to load reports.");
      }

      if (!Array.isArray(reportsData)) {
        throw new Error("Invalid reports response format.");
      }

      setReports(reportsData);
      setMe(meData);
    } catch (err: any) {
      console.error("REPORTS FETCH ERROR:", err);
      setReports([]);
      setError(err?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const comparisonReports = useMemo(
    () => reports.filter((r) => String(r.report_type).toLowerCase() === "comparison"),
    [reports]
  );

  const totalSavedJobs = useMemo(
    () =>
      reports.reduce((sum, r) => sum + inferSavedJobsCount(r.snapshot_json), 0),
    [reports]
  );

  const averageHealthAcrossReports = useMemo(() => {
    const values = reports
      .map((r) => inferAverageHealth(r.snapshot_json))
      .filter((v) => v > 0);

    if (!values.length) return 0;

    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [reports]);

  const currentPlan = String(me?.plan || "free").toLowerCase();
  const reportsUsed = me?.usage?.reports_used ?? 0;
  const reportLimit = me?.usage?.report_limit ?? null;
  const reportLimitReached =
    reportLimit !== null ? reportsUsed >= reportLimit : false;

  const deleteReport = async (reportId: number) => {
    const ok = window.confirm("Delete this saved report snapshot?");
    if (!ok) return;

    try {
      setDeletingId(reportId);

      const res = await apiFetch(`/reports/${reportId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Failed to delete report.");
      }

      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err: any) {
      console.error("DELETE REPORT ERROR:", err);
      alert(`Delete failed: ${err?.message || "Unknown error"}`);
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (report: SavedReport) => {
    setEditingReport(report);
    setEditTitle(report.title || "");
    setEditDescription(report.description || "");
  };

  const closeEdit = () => {
    setEditingReport(null);
    setEditTitle("");
    setEditDescription("");
    setSavingEdit(false);
  };

  const saveEdit = async () => {
    if (!editingReport) return;

    try {
      setSavingEdit(true);

      const res = await apiFetch(`/reports/${editingReport.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Failed to update report.");
      }

      setReports((prev) =>
        prev.map((r) =>
          r.id === editingReport.id
            ? {
                ...r,
                title: data.title,
                description: data.description,
                updated_at: data.updated_at,
              }
            : r
        )
      );

      closeEdit();
    } catch (err: any) {
      console.error("UPDATE REPORT ERROR:", err);
      alert(`Update failed: ${err?.message || "Unknown error"}`);
      setSavingEdit(false);
    }
  };

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
                Saved Reports
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: "15px",
                }}
              >
                Review saved comparison snapshots and reopen management-ready report states.
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
                  window.location.href = "/compare";
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
                Go to Compare
              </button>

              <button
                onClick={() => {
                  window.location.href = "/my-analyses";
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
                Back to Analyses
              </button>
            </div>
          </div>
        </section>

        {currentPlan === "free" ? (
          <section
            style={{
              background: reportLimitReached ? "#fff7ed" : "#eff6ff",
              border: reportLimitReached ? "1px solid #fdba74" : "1px solid #bfdbfe",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "6px",
                }}
              >
                {reportLimitReached
                  ? "Saved report limit reached"
                  : "You are on the Free plan"}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  lineHeight: 1.7,
                }}
              >
                {reportLimitReached
                  ? `You’ve used ${reportsUsed}/${reportLimit} saved reports. Upgrade to Pro to continue saving comparison snapshots.`
                  : `Free users can save up to ${reportLimit ?? 3} reports. Upgrade to Pro for expanded snapshot history and uninterrupted reporting workflow.`}
              </div>
            </div>

            <button
              onClick={() => {
                window.location.href = "/pricing";
              }}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                border: "1px solid #2563eb",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Upgrade to Pro
            </button>
          </section>
        ) : null}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          <SummaryCard
            title="Saved Reports"
            value={reports.length}
            note="All snapshots linked to your account"
            accent="#2563eb"
          />
          <SummaryCard
            title="Comparison Reports"
            value={comparisonReports.length}
            note="Comparison-type saved snapshots"
            accent="#7c3aed"
          />
          <SummaryCard
            title="Saved Jobs Referenced"
            value={totalSavedJobs}
            note="Jobs represented across snapshots"
            accent="#16a34a"
          />
          <SummaryCard
            title="Avg Snapshot Health"
            value={averageHealthAcrossReports}
            note="Average across saved report metrics"
            accent="#f59e0b"
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
                Snapshot Library
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "14px",
                  color: "#64748b",
                }}
              >
                Saved comparison states for future review, sharing, and portfolio reporting.
              </p>
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#475569",
                fontWeight: 600,
              }}
            >
              {loading ? "Loading reports..." : `${reports.length} item(s) found`}
            </div>
          </div>

          {loading ? (
            <p style={{ margin: 0, color: "#475569" }}>Loading saved reports...</p>
          ) : error ? (
            <div
              style={{
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#991b1b",
                borderRadius: "18px",
                padding: "18px",
              }}
            >
              {error}
            </div>
          ) : reports.length === 0 ? (
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
              No saved reports found yet.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              {reports.map((report) => {
                const savedJobsCount = inferSavedJobsCount(report.snapshot_json);
                const avgHealth = inferAverageHealth(report.snapshot_json);

                return (
                  <div
                    key={report.id}
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
                      <div>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          {report.title}
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
                              background: "#ede9fe",
                              color: "#6d28d9",
                              border: "1px solid #c4b5fd",
                            }}
                          >
                            {report.report_type}
                          </span>

                          <span
                            style={{
                              fontSize: "13px",
                              color: "#64748b",
                              fontWeight: 600,
                            }}
                          >
                            Report #{report.id}
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
                          <div>Created: {formatDate(report.created_at)}</div>
                          <div>Updated: {formatDate(report.updated_at)}</div>
                          {report.description ? (
                            <div>Description: {report.description}</div>
                          ) : null}
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
                            (window.location.href = `/reports/${report.id}`)
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
                          Open Report
                        </button>

                        <button
                          onClick={() => openEdit(report)}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "1px solid #bfdbfe",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteReport(report.id)}
                          disabled={deletingId === report.id}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "1px solid #fecaca",
                            background: deletingId === report.id ? "#fecaca" : "#fef2f2",
                            color: "#991b1b",
                            fontWeight: 700,
                            cursor: deletingId === report.id ? "not-allowed" : "pointer",
                          }}
                        >
                          {deletingId === report.id ? "Deleting..." : "Delete"}
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
                          Jobs Included
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          {savedJobsCount}
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
                          Average Health
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          {avgHealth}
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "14px",
                          gridColumn: "span 2",
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
                          Snapshot Preview
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.6,
                            color: "#334155",
                          }}
                        >
                          {Array.isArray(report.snapshot_json?.selected_ids)
                            ? `Selected job IDs: ${report.snapshot_json.selected_ids.join(", ")}`
                            : "Saved comparison snapshot available for reopening."}
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

      {editingReport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "620px",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 20px 50px rgba(15, 23, 42, 0.20)",
              padding: "24px",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "8px",
                color: "#0f172a",
              }}
            >
              Edit Report Metadata
            </h2>

            <p
              style={{
                marginTop: 0,
                marginBottom: "20px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Update the saved report title and description.
            </p>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Title
                </label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={closeEdit}
                disabled={savingEdit}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 700,
                  cursor: savingEdit ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                disabled={savingEdit}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid #2563eb",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: savingEdit ? "not-allowed" : "pointer",
                }}
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}