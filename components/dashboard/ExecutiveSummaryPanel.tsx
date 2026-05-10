"use client";

import SectionCard from "./SectionCard";

export default function ExecutiveSummaryPanel({ summary }: { summary?: string }) {
  return (
    <SectionCard
      title="Executive Summary"
      subtitle="Management-level view of current schedule condition."
    >
      <p
        style={{
          margin: 0,
          color: "#0f172a",
          fontSize: "15px",
          lineHeight: 1.8,
        }}
      >
        {summary || "No summary available."}
      </p>

      <p
        style={{
          marginTop: "12px",
          color: "#475569",
          fontSize: "13px",
          lineHeight: 1.7,
        }}
      >
        This summary integrates deterministic schedule health and probabilistic risk exposure to
        support informed management decisions.
      </p>
    </SectionCard>
  );
}
