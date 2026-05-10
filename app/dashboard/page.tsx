"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import MonteCarloChart from "../../components/charts/monte-carlo";
import FloatDistribution from "../../components/charts/float-distribution";
import TornadoChart from "../../components/charts/tornado";
import DriverImpactPanel from "../../components/DriverImpactPanel";
import SectionCard from "../../components/dashboard/SectionCard";
import KpiCard from "../../components/dashboard/KpiCard";
import InsightList from "../../components/dashboard/InsightList";
import RiskDriversPanel from "../../components/dashboard/RiskDriversPanel";
import ProcessingPanel from "../../components/dashboard/ProcessingPanel";
import NarrativesPanel from "../../components/dashboard/NarrativesPanel";
import ExecutiveSummaryPanel from "../../components/dashboard/ExecutiveSummaryPanel";
import AdvancedAiDiagnosticPanel from "../../components/dashboard/AdvancedAiDiagnosticPanel";
import { apiFetch, ApiError } from "../../lib/api";

type Explanation = {
  root_causes: string[];
  key_risks: string[];
  recommended_actions: string[];
  executive_summary: string;
};

function getHealthTone(score: number) {
  if (score >= 75) {
    return {
      label: "Good",
      color: "#166534",
      bg: "#dcfce7",
      border: "#86efac",
    };
  }

  if (score >= 60) {
    return {
      label: "Moderate",
      color: "#92400e",
      bg: "#fef3c7",
      border: "#fcd34d",
    };
  }

  return {
    label: "Critical",
    color: "#991b1b",
    bg: "#fee2e2",
    border: "#fca5a5",
  };
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job_id");

  const [data, setData] = useState<any>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState("");
  const [explanationLocked, setExplanationLocked] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    let interval: any;

    const fetchData = async () => {
      try {
        const res = await apiFetch(`/jobs/${jobId}`);
        const json = await res.json();
        setData(json);

        if (json.status === "done" || json.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("FETCH DASHBOARD ERROR:", err);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  useEffect(() => {
    if (!jobId || !data || data.status !== "done") return;
    if (explanation || explanationLoading || explanationLocked) return;

    const fetchExplanation = async () => {
      try {
        setExplanationLoading(true);
        setExplanationError("");

        const res = await apiFetch("/ai/explain", {
          method: "POST",
          body: JSON.stringify({
            job_id: Number(jobId),
          }),
        });

        const json = await res.json();
        setExplanation(json);
        setExplanationLocked(false);
      } catch (err: any) {
        if (err instanceof ApiError && err.status === 403) {
          setExplanationLocked(true);
          setExplanationError("");
          return;
        }

        console.error("EXPLANATION ERROR:", err);
        setExplanationError("Failed to load AI explanation.");
      } finally {
        setExplanationLoading(false);
      }
    };

    fetchExplanation();
  }, [jobId, data, explanation, explanationLoading, explanationLocked]);

  if (!data) {
    return <div style={{ padding: "32px", color: "#0f172a" }}>Loading dashboard...</div>;
  }

  if (data.status === "failed") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "32px",
        }}
      >
        <SectionCard title="Project Dashboard">
          <p style={{ margin: 0, color: "#b91c1c", fontWeight: 600 }}>
            Analysis failed: {data.error || "Unknown error"}
          </p>
        </SectionCard>
      </div>
    );
  }

  if (data.status !== "done") {
    return (
      <ProcessingPanel
        progress={data?.progress ?? 0}
        stage={data?.stage || "Processing schedule"}
      />
    );
  }

  const analysis = data.analysis || {};

  const monteCarloData =
    analysis?.monte_carlo
      ?.map((item: any) => {
        if (item?.x !== undefined && item?.y !== undefined) {
          return { x: item.x, y: item.y };
        }

        if (item?.bin_start !== undefined && item?.bin_end !== undefined) {
          return {
            x: (item.bin_start + item.bin_end) / 2,
            y: item.count,
          };
        }

        return null;
      })
      .filter(Boolean) || [];

  const floatMetrics = {
    total_activities: analysis?.total_activities ?? 0,
    open_ends: analysis?.open_ends ?? 0,
    negative_float_activities: analysis?.negative_float ?? 0,
  };

  const healthScore = Number(analysis?.health_score ?? 0);
  const healthTone = getHealthTone(healthScore);

  const fileName = data?.filename || "Schedule Analysis";
  const version = data?.version || "N/A";
  const headerSummary = `${fileName} · Version ${version}`;

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
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
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
                Project Dashboard
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: "15px",
                }}
              >
                {headerSummary}
              </p>
            </div>

            <div
              style={{
                padding: "12px 16px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                minWidth: "220px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#cbd5e1",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                Overall Assessment
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: healthTone.bg,
                  color: healthTone.color,
                  fontWeight: 800,
                  border: `1px solid ${healthTone.border}`,
                }}
              >
                <span>Health {healthScore}</span>
                <span>·</span>
                <span>{healthTone.label}</span>
              </div>
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
          <KpiCard
            title="Health Score"
            value={healthScore}
            note="Composite schedule condition"
            accent={healthTone.color}
          />
          <KpiCard
            title="Total Activities"
            value={analysis?.total_activities ?? 0}
            note="Analysed activity population"
            accent="#2563eb"
          />
          <KpiCard
            title="Open Ends"
            value={analysis?.open_ends ?? 0}
            note="Logic continuity concerns"
            accent="#d97706"
          />
          <KpiCard
            title="Negative Float"
            value={analysis?.negative_float ?? 0}
            note="Schedule pressure indicator"
            accent="#dc2626"
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 1fr",
            gap: "24px",
          }}
        >
          <SectionCard
            title="Monte Carlo Finish Distribution"
            subtitle="Probabilistic view of completion spread and schedule uncertainty."
          >
            <div style={{ minHeight: "320px" }}>
              {monteCarloData.length > 0 ? (
                <MonteCarloChart
                  data={monteCarloData}
                  markers={{
                    p10: analysis?.p10,
                    p30: analysis?.p30,
                    p50: analysis?.p50,
                    p70: analysis?.p70,
                    p80: analysis?.p80,
                    p90: analysis?.p90,
                    p10_date: analysis?.p10_date,
                    p30_date: analysis?.p30_date,
                    p50_date: analysis?.p50_date,
                    p70_date: analysis?.p70_date,
                    p80_date: analysis?.p80_date,
                    p90_date: analysis?.p90_date,
                    schedule_anchor_date: analysis?.schedule_anchor_date,
                    calendar_basis: analysis?.calendar_basis,
                  }}
                />
              ) : (
                <p style={{ margin: 0, color: "#64748b" }}>No Monte Carlo data available.</p>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Schedule Health Distribution"
            subtitle="Quick visual view of current schedule condition metrics."
          >
            <div style={{ minHeight: "320px" }}>
              <FloatDistribution metrics={floatMetrics} />
            </div>
          </SectionCard>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <SectionCard
            title="Top Criticality Drivers"
            subtitle="Activities most frequently appearing on the simulated critical path."
          >
            <RiskDriversPanel data={analysis?.risk_drivers || []} />
          </SectionCard>

          <SectionCard
            title="Schedule Sensitivity / Tornado Drivers"
            subtitle="Activities most correlated with finish-date uncertainty and forecast spread."
          >
            <TornadoChart data={analysis?.tornado_chart || []} />
          </SectionCard>
        </section>

        <DriverImpactPanel
          data={analysis?.driver_date_impacts || []}
          uncertaintyWindowDays={analysis?.uncertainty_window_days}
        />

        <NarrativesPanel
          scheduleNarrative={analysis?.schedule_narrative}
          riskNarrative={analysis?.risk_narrative}
        />

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <SectionCard
            title="Key Findings"
            subtitle="Primary schedule conditions detected in the core analysis."
          >
            <InsightList
              items={analysis?.key_findings || []}
              emptyText="No key findings available."
            />
          </SectionCard>

          <SectionCard
            title="Recommended Actions"
            subtitle="Immediate actions already identified from the base schedule review."
          >
            <InsightList
              items={analysis?.immediate_actions || []}
              emptyText="No recommended actions available."
            />
          </SectionCard>
        </section>

        <ExecutiveSummaryPanel summary={analysis?.executive_summary} />

        <div
          style={{
            fontSize: "12px",
            fontWeight: 800,
            color: "#1d4ed8",
            marginBottom: "10px",
            letterSpacing: "0.06em",
            background: "#eff6ff",
            padding: "6px 12px",
            borderRadius: "8px",
            display: "inline-block",
            border: "1px solid #bfdbfe",
          }}
        >
          PRO ANALYTICS LAYER
        </div>

        <AdvancedAiDiagnosticPanel
          explanation={explanation}
          loading={explanationLoading}
          error={explanationError}
          locked={explanationLocked}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32 }}>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
