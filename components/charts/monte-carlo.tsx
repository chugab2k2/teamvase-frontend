"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type MarkerSet = {
  p10?: number | null;
  p30?: number | null;
  p50?: number | null;
  p70?: number | null;
  p80?: number | null;
  p90?: number | null;
};

function formatValue(value: any) {
  const n = Number(value);
  if (Number.isNaN(n)) return "N/A";
  return n.toFixed(2);
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

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
      <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
        Finish point: {formatValue(label)}
      </div>

      <div style={{ fontSize: 13, color: "#475569" }}>
        Simulation hits: <strong>{payload?.[0]?.value ?? 0}</strong>
      </div>
    </div>
  );
}

function MarkerCard({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value?: number | null;
  description: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        background: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: color,
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 900, color: "#0f172a" }}>
          {label}
        </span>
      </div>

      <div style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>
        {value === null || value === undefined ? "N/A" : formatValue(value)}
      </div>

      <div style={{ fontSize: 12, lineHeight: 1.5, color: "#64748b" }}>
        {description}
      </div>
    </div>
  );
}

export default function MonteCarloChart({
  data,
  markers,
}: {
  data: any[];
  markers?: MarkerSet;
}) {
  if (!data || data.length === 0) {
    return <p>No Monte Carlo data</p>;
  }

  const p10 = markers?.p10 ?? null;
  const p30 = markers?.p30 ?? null;
  const p50 = markers?.p50 ?? null;
  const p70 = markers?.p70 ?? null;
  const p80 = markers?.p80 ?? null;
  const p90 = markers?.p90 ?? null;

  return (
    <div style={{ background: "#ffffff", borderRadius: 12 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 280px",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 22,
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            Integrated Monte Carlo Schedule Risk Analysis
          </h3>

          <p
            style={{
              margin: "0 0 18px",
              fontSize: 14,
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Predicts possible completion outcomes and highlights confidence
            points for optimistic, realistic, management, and conservative
            finish positions.
          </p>

          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="x"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatValue(v)}
              />

              <YAxis tick={{ fontSize: 12 }} />

              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="y" fill="#f97316" opacity={0.85} barSize={28} />

              <Line
                type="monotone"
                dataKey="y"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />

              {p10 !== null ? (
                <ReferenceLine
                  x={p10}
                  stroke="#16a34a"
                  strokeWidth={2}
                  label={{ value: "P10", position: "top", fill: "#16a34a" }}
                />
              ) : null}

              {p50 !== null ? (
                <ReferenceLine
                  x={p50}
                  stroke="#2563eb"
                  strokeWidth={2}
                  label={{ value: "P50", position: "top", fill: "#2563eb" }}
                />
              ) : null}

              {p80 !== null ? (
                <ReferenceLine
                  x={p80}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  label={{ value: "P80", position: "top", fill: "#f59e0b" }}
                />
              ) : null}

              {p90 !== null ? (
                <ReferenceLine
                  x={p90}
                  stroke="#dc2626"
                  strokeWidth={2}
                  label={{ value: "P90", position: "top", fill: "#dc2626" }}
                />
              ) : null}
            </ComposedChart>
          </ResponsiveContainer>

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
            The orange bars show how often the simulated project finished within
            each range. The blue line shows the shape of the finish distribution.
            The vertical markers show key confidence positions used for
            schedule-risk decisions.
          </div>
        </div>

        <aside
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            padding: 16,
            display: "grid",
            gap: 12,
          }}
        >
          <div>
            <h4
              style={{
                margin: "0 0 6px",
                fontSize: 16,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              Confidence Ladder
            </h4>

            <p
              style={{
                margin: "0 0 10px",
                fontSize: 12,
                lineHeight: 1.5,
                color: "#64748b",
              }}
            >
              Higher P-values represent safer, more conservative finish
              positions.
            </p>
          </div>

          <MarkerCard
            label="P10"
            value={p10}
            color="#16a34a"
            description="Optimistic position. Only 10% of simulations finish by this point."
          />

          <MarkerCard
            label="P30"
            value={p30}
            color="#22c55e"
            description="Early probable position. Useful for understanding the better-case range."
          />

          <MarkerCard
            label="P50"
            value={p50}
            color="#2563eb"
            description="Median / realistic position. Half the simulations finish by this point."
          />

          <MarkerCard
            label="P70"
            value={p70}
            color="#a855f7"
            description="Moderately conservative position. Useful for internal planning confidence."
          />

          <MarkerCard
            label="P80"
            value={p80}
            color="#f59e0b"
            description="Safer management commitment position. 80% confidence level."
          />

          <MarkerCard
            label="P90"
            value={p90}
            color="#dc2626"
            description="Conservative risk position. High-confidence finish allowance."
          />
        </aside>
      </div>
    </div>
  );
}