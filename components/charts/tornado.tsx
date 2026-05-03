"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

type TornadoItem = {
  activity?: string;
  activity_name?: string;
  impact_score?: number;
  impact?: number;
  correlation?: number;
};

function formatScore(value: any) {
  const n = Number(value);
  if (Number.isNaN(n)) return "N/A";
  return n.toFixed(3);
}

function formatPercent(value: any) {
  const n = Number(value);
  if (Number.isNaN(n)) return "N/A";
  return `${(n * 100).toFixed(0)}%`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload?.[0]?.payload;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
      }}
    >
      <div style={{ fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>
        {label}
      </div>

      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
        Impact score: <strong>{formatScore(item?.impact)}</strong>
        <br />
        Impact strength: <strong>{formatPercent(item?.impact)}</strong>
        <br />
        Correlation: <strong>{formatScore(item?.correlation)}</strong>
      </div>
    </div>
  );
}

export default function TornadoChart({ data }: { data: TornadoItem[] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
        No tornado sensitivity data available for this schedule.
      </p>
    );
  }

  const chartData = data
    .slice(0, 10)
    .map((d: TornadoItem) => ({
      name: d.activity || d.activity_name || "Unnamed activity",
      impact: Number(d.impact_score ?? d.impact ?? 0),
      correlation: Number(d.correlation ?? 0),
    }))
    .filter((d) => !Number.isNaN(d.impact))
    .sort((a, b) => b.impact - a.impact);

  return (
    <div>
      <div style={{ width: "100%", height: 380 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 60, left: 40, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatScore(value)}
            />

            <YAxis
              dataKey="name"
              type="category"
              width={260}
              tick={{ fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="impact" fill="#2563eb" radius={[0, 8, 8, 0]}>
              <LabelList
                dataKey="impact"
                position="right"
                formatter={(value: any) => formatScore(value)}
                style={{
                  fill: "#0f172a",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: 14,
          padding: 14,
          borderRadius: 14,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#475569",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        This chart shows activities most correlated with finish-date uncertainty.
        Higher impact scores mean the activity is more likely to influence the
        P50/P80/P90 forecast dates.
      </div>
    </div>
  );
}