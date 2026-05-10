"use client";

export default function InsightList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (!items || items.length === 0) {
    return (
      <p
        style={{
          margin: 0,
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        {emptyText}
      </p>
    );
  }

  return (
    <ul
      style={{
        margin: 0,
        paddingLeft: "18px",
        color: "#0f172a",
        display: "grid",
        gap: "10px",
      }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
