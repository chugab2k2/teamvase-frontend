"use client";

import InsightList from "./InsightList";

export default function AdvancedAiDiagnosticPanel({ explanation, loading, error, locked }: any) {
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
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800 }}>
          Advanced AI Diagnostic Review
        </h2>
      </div>

      {loading && <p>Generating executive explanation...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {locked && (
        <div>
          <p>This is a Pro feature</p>
        </div>
      )}

      {explanation && !locked && (
        <div style={{ display: "grid", gap: "20px" }}>
          <InsightList items={explanation.root_causes || []} emptyText="No root cause analysis" />
          <InsightList items={explanation.key_risks || []} emptyText="No key risks" />
          <InsightList
            items={explanation.recommended_actions || []}
            emptyText="No recommended actions"
          />
        </div>
      )}
    </section>
  );
}
