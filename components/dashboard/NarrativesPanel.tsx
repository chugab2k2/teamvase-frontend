"use client";

import SectionCard from "./SectionCard";

export default function NarrativesPanel({
  scheduleNarrative,
  riskNarrative,
}: {
  scheduleNarrative?: string;
  riskNarrative?: string;
}) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
      }}
    >
      <SectionCard
        title="Schedule Integrity Assessment"
        subtitle="AI review of deterministic P6 schedule quality, logic integrity, and schedule health."
      >
        <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.8 }}>
          {scheduleNarrative || "No schedule integrity narrative available."}
        </p>
      </SectionCard>

      <SectionCard
        title="Forecast Risk Interpretation"
        subtitle="AI explanation of Monte Carlo forecast risk, driver sensitivity, and P80/P90 exposure."
      >
        <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.8 }}>
          {riskNarrative || "No risk and forecast narrative available."}
        </p>
      </SectionCard>
    </section>
  );
}
