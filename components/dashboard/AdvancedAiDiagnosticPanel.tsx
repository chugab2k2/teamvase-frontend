"use client";

import InsightList from "./InsightList";

type Explanation = {
  root_causes?: string[];
  key_risks?: string[];
  recommended_actions?: string[];
  executive_summary?: string;
};

export default function AdvancedAiDiagnosticPanel({
  explanation,
  loading,
  error,
  locked,
}: {
  explanation: Explanation | null;
  loading: boolean;
  error: string;
  locked: boolean;
}) {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid #dbeafe",
        borderRadius: "24px",
        padding: "26px",
        boxShadow: "0 10px 30px rgba(37, 99, 235, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
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
            Advanced AI Diagnostic Review
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "#475569",
              fontSize: "14px",
            }}
          >
            Deep-dive diagnostic layer providing root-cause analysis, risk interpretation, and
            execution strategy.
          </p>
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderRadius: "999px",
            background: "#dbeafe",
            color: "#1d4ed8",
            fontWeight: 700,
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Executive Lens
        </div>
      </div>

      {loading && !locked ? (
        <p style={{ margin: 0, color: "#475569" }}>Generating executive explanation...</p>
      ) : null}

      {error ? <p style={{ margin: 0, color: "#b91c1c", fontWeight: 600 }}>{error}</p> : null}

      {locked ? (
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px",
              color: "#1e3a8a",
              fontSize: "18px",
              fontWeight: 800,
            }}
          >
            AI Explanation is a Pro feature
          </h3>

          <p
            style={{
              margin: "0 0 16px",
              color: "#334155",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            Upgrade to Pro to unlock root-cause interpretation, executive risk analysis, strategic
            recommendations, and management-level schedule explanations.
          </p>

          <button
            onClick={() => {
              window.location.href = "/billing";
            }}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #2563eb",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      ) : null}

      {!loading && !error && explanation && !locked ? (
        <div style={{ display: "grid", gap: "20px" }}>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  fontSize: "18px",
                  color: "#0f172a",
                }}
              >
                Root Cause Analysis
              </h3>

              <InsightList
                items={explanation.root_causes || []}
                emptyText="No root cause analysis available."
              />
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  fontSize: "18px",
                  color: "#0f172a",
                }}
              >
                Key Risks
              </h3>

              <InsightList
                items={explanation.key_risks || []}
                emptyText="No key risks available."
              />
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  fontSize: "18px",
                  color: "#0f172a",
                }}
              >
                Recommended Actions
              </h3>

              <InsightList
                items={explanation.recommended_actions || []}
                emptyText="No recommended actions available."
              />
            </div>

            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "18px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  fontSize: "18px",
                  color: "#1e3a8a",
                }}
              >
                Executive Interpretation
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#1e293b",
                  fontSize: "15px",
                  lineHeight: 1.8,
                }}
              >
                {explanation.executive_summary || "No executive interpretation available."}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
