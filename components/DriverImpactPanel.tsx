"use client";

type DriverImpactItem = {
  activity?: string;
  activity_name?: string;
  impact_score?: number | null;
  correlation?: number | null;
  estimated_p80_day_impact?: number | null;
  estimated_p90_day_impact?: number | null;
  severity?: string | null;
  interpretation?: string | null;
};

function formatNumber(value: any, decimals = 3) {
  const n = Number(value);
  if (Number.isNaN(n)) return "N/A";
  return n.toFixed(decimals);
}

function formatDays(value: any) {
  const n = Number(value);
  if (Number.isNaN(n)) return "N/A";
  return `+${Math.round(n)} days`;
}

function getSeverityTone(severity?: string | null) {
  const s = String(severity || "").toLowerCase();

  if (s === "high") {
    return {
      bg: "#fee2e2",
      color: "#991b1b",
      border: "#fca5a5",
      label: "High",
    };
  }

  if (s === "medium") {
    return {
      bg: "#fef3c7",
      color: "#92400e",
      border: "#fcd34d",
      label: "Medium",
    };
  }

  return {
    bg: "#dbeafe",
    color: "#1d4ed8",
    border: "#93c5fd",
    label: severity || "Low",
  };
}

export default function DriverImpactPanel({
  data,
  uncertaintyWindowDays,
}: {
  data: DriverImpactItem[];
  uncertaintyWindowDays?: number | string | null;
}) {
  const items = Array.isArray(data) ? data.slice(0, 8) : [];

  if (items.length === 0) {
    return (
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "24px",
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Driver Impact on Forecast Dates
        </h2>

        <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 14 }}>
          No driver-date impact data available for this schedule.
        </p>
      </section>
    );
  }

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "18px",
          flexWrap: "wrap",
          alignItems: "flex-start",
          marginBottom: "18px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Driver Impact on Forecast Dates
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "#64748b",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Sensitivity-based estimate, in calendar days, showing how strongly each 
            driver contributes to P80/P90 finish-date uncertainty.
          </p>
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: "999px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
            fontSize: 13,
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          Base uncertainty window: {uncertaintyWindowDays ?? "N/A"} calendar days · Sensitivity-scaled
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "14px",
        }}
      >
        {items.map((item, idx) => {
          const tone = getSeverityTone(item.severity);
          const activity = item.activity || item.activity_name || "Unnamed activity";

          return (
            <div
              key={`${activity}-${idx}`}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "16px",
                background: "#f8fafc",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: 1.35,
                  }}
                >
                  {activity}
                </div>

                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: tone.bg,
                    color: tone.color,
                    border: `1px solid ${tone.border}`,
                    fontSize: 12,
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                  }}
                >
                  {tone.label}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 12,
                      fontWeight: 800,
                      marginBottom: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    P80 Impact
                  </div>

                  <div
                    style={{
                      color: "#0f172a",
                      fontSize: 22,
                      fontWeight: 900,
                    }}
                  >
                    {formatDays(item.estimated_p80_day_impact)}
                  </div>
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 12,
                      fontWeight: 800,
                      marginBottom: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    P90 Impact
                  </div>

                  <div
                    style={{
                      color: "#0f172a",
                      fontSize: 22,
                      fontWeight: 900,
                    }}
                  >
                    {formatDays(item.estimated_p90_day_impact)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.6,
                  marginBottom: "10px",
                }}
              >
                {item.interpretation ||
                  "This driver contributes to finish-date uncertainty and should be monitored."}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                <span>Impact score: {formatNumber(item.impact_score)}</span>
                <span>·</span>
                <span>Correlation: {formatNumber(item.correlation)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "16px",
          padding: "14px",
          borderRadius: "14px",
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          color: "#9a3412",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        Estimated date impact is sensitivity-based and shown in calendar days.
        It indicates how strongly each activity contributes to forecast-date uncertainty; 
        it is not a deterministic delay claim and should not be treated as cumulative delay.
      </div>
    </section>
  );
}