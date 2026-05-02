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

type MonteCarloChartProps = {
  data: any[];
  markers?: MarkerSet;
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

function normalizeChartData(data: any[]) {
  if (!Array.isArray(data)) return [];

  const rows = data
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      if (item.x !== undefined && item.y !== undefined) {
        return {
          x: Number(item.x),
          hits: Number(item.y),
        };
      }

      if (
        item.bin_start !== undefined &&
        item.bin_end !== undefined &&
        item.count !== undefined
      ) {
        return {
          x: (Number(item.bin_start) + Number(item.bin_end)) / 2,
          hits: Number(item.count),
        };
      }

      return null;
    })
    .filter((item) => {
      if (!item) return false;
      return !Number.isNaN(item.x) && !Number.isNaN(item.hits);
    })
    .sort((a, b) => a.x - b.x);

  const totalHits = rows.reduce((sum, row) => sum + row.hits, 0);
  let runningHits = 0;

  return rows.map((row) => {
    runningHits += row.hits;

    return {
      ...row,
      cumulative: totalHits > 0 ? Number(((runningHits / totalHits) * 100).toFixed(2)) : 0,
    };
  });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const hits = payload.find((p: any) => p.dataKey === "hits")?.value;
  const cumulative = payload.find((p: any) => p.dataKey === "cumulative")?.value;

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

      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
        Simulation hits: <strong>{hits ?? 0}</strong>
        <br />
        Cumulative probability: <strong>{cumulative ?? 0}%</strong>
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
  p10,
  p30,
  p50,
  p70,
  p80,
  p90,
}: MonteCarloChartProps) {
  const chartData = normalizeChartData(data);

  if (!chartData || chartData.length === 0) {
    return <p>No Monte Carlo data</p>;
  }

  const markerP10 = markers?.p10 ?? p10 ?? null;
  const markerP30 = markers?.p30 ?? p30 ?? null;
  const markerP50 = markers?.p50 ?? p50 ?? null;
  const markerP70 = markers?.p70 ?? p70 ?? null;
  const markerP80 = markers?.p80 ?? p80 ?? null;
  const markerP90 = markers?.p90 ?? p90 ?? null;

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
          <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, color: "#0f172a" }}>
            Integrated Monte Carlo Schedule Risk Analysis
          </h3>

          <p style={{ margin: "0 0 18px", fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
            Orange bars show frequency of simulated finishes. The blue curve shows cumulative
            probability against the right-hand percentage axis.
          </p>

          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="x"
                type="number"
                domain={["dataMin", "dataMax"]}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatValue(v)}
              />

              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Hits",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                label={{
                  value: "Cumulative Probability",
                  angle: 90,
                  position: "insideRight",
                  style: { textAnchor: "middle" },
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                yAxisId="left"
                dataKey="hits"
                fill="#f97316"
                opacity={0.85}
                barSize={28}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />

              {markerP10 !== null ? (
                <ReferenceLine
                  x={markerP10}
                  stroke="#16a34a"
                  strokeWidth={2}
                  label={{ value: "P10", position: "top", fill: "#16a34a" }}
                />
              ) : null}

              {markerP50 !== null ? (
                <ReferenceLine
                  x={markerP50}
                  stroke="#2563eb"
                  strokeWidth={2}
                  label={{ value: "P50", position: "top", fill: "#2563eb" }}
                />
              ) : null}

              {markerP80 !== null ? (
                <ReferenceLine
                  x={markerP80}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  label={{ value: "P80", position: "top", fill: "#f59e0b" }}
                />
              ) : null}

              {markerP90 !== null ? (
                <ReferenceLine
                  x={markerP90}
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
            The bars show how often the project finished within each simulated range. The blue
            cumulative curve shows the probability of finishing by each point. P80 and P90 are
            useful for safer management commitment dates.
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
            <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
              Confidence Ladder
            </h4>

            <p style={{ margin: "0 0 10px", fontSize: 12, lineHeight: 1.5, color: "#64748b" }}>
              Higher P-values represent safer, more conservative finish positions.
            </p>
          </div>

          <MarkerCard label="P10" value={markerP10} color="#16a34a" description="Optimistic position. 10% confidence level." />
          <MarkerCard label="P30" value={markerP30} color="#22c55e" description="Early probable position. Better-case planning range." />
          <MarkerCard label="P50" value={markerP50} color="#2563eb" description="Median / realistic position. 50% confidence level." />
          <MarkerCard label="P70" value={markerP70} color="#a855f7" description="Moderately conservative position. Internal planning confidence." />
          <MarkerCard label="P80" value={markerP80} color="#f59e0b" description="Safer management commitment position. 80% confidence level." />
          <MarkerCard label="P90" value={markerP90} color="#dc2626" description="Conservative risk position. 90% confidence level." />
        </aside>
      </div>
    </div>
  );
}