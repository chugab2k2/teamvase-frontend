"use client";

export default function RiskDriversPanel({ data }: { data: any[] }) {
  const items = Array.isArray(data) ? data : [];

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {items.length === 0 ? (
        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          No major risk drivers detected in the current analysis.
        </p>
      ) : (
        items.map((item: any, idx: number) => {
          const impact = Number(item?.impact ?? 0);
          const impactLabel = Number.isNaN(impact) ? "N/A" : `${(impact * 100).toFixed(0)}%`;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                alignItems: "center",
                padding: "14px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                background: "#f8fafc",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#0f172a",
                    fontSize: "14px",
                  }}
                >
                  {item?.activity || "Unnamed Driver"}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  Simulated critical-path frequency
                </div>
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  whiteSpace: "nowrap",
                }}
              >
                {impactLabel}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
