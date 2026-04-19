"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function FloatDistribution({ metrics }: any) {
  if (!metrics) return null;

  const data = [
    { name: "Negative Float", value: metrics.negative_float_activities || 0 },
    { name: "Open Ends", value: metrics.open_ends || 0 },
    { name: "Total Activities", value: metrics.total_activities || 0 },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
      }}
    >
      <h3>Schedule Health Distribution</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />
          <YAxis />

          <Tooltip />

          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}