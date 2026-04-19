"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MonteCarloChart({ data }: any) {
  if (!data || data.length === 0) {
    return <p>No Monte Carlo data</p>;
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
      }}
    >
      <h3>Monte Carlo Finish Distribution</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* ✅ CATEGORY AXIS */}
          <XAxis dataKey="x" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="y"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}