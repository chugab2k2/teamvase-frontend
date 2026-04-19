"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function TornadoChart({ data }: any) {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 8).map((d: any) => ({
    name: d.activity_name,
    impact: d.impact_score
  }));

  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      marginTop: 20,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>
      <h3>Top Risk Drivers (Tornado)</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={200} />
          <Tooltip />
          <Bar dataKey="impact" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}