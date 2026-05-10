"use client";

export default function KpiCard({
  title,
  value,
  note,
  accent,
}: {
  title: string;
  value: string | number;
  note?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "20px",
        minHeight: "124px",
        boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: accent || "#2563eb",
        }}
      />

      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#64748b",
          marginBottom: "14px",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "34px",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1,
        }}
      >
        {value}
      </div>

      {note ? (
        <div
          style={{
            marginTop: "14px",
            fontSize: "13px",
            color: "#475569",
          }}
        >
          {note}
        </div>
      ) : null}
    </div>
  );
}
