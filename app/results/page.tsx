"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import MetricCard from "@/components/metric-card";
import RiskDrivers from "@/components/risk-drivers";
import IssuesTable from "@/components/issues-table";
import MonteCarloChart from "@/components/charts/monte-carlo";
import TornadoChart from "@/components/charts/tornado";
import FloatChart from "@/components/charts/float-distribution";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Card({ title, value, color }: any) {
  return (
    <div style={{
      background: "#fff",
      padding: 16,
      borderRadius: 10,
      borderLeft: `4px solid ${color}`,
      border: "1px solid #e5e7eb"
    }}>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function RiskSummary({ risk }: any) {
  if (!risk) return null;

  const range = (risk.p90 - risk.p10).toFixed(0);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
      marginTop: 20
    }}>
      <Card title="P50" value={risk.p50?.toFixed(0)} color="#2563eb" />
      <Card title="P90" value={risk.p90?.toFixed(0)} color="#dc2626" />
      <Card title="Range" value={`${range} hrs`} color="#f59e0b" />
      <Card title="Risk" value="HIGH" color="#ef4444" />
    </div>
  );
}

export default function ResultsPage() {
  const params = useSearchParams();
  const jobId = params.get("job_id");

  const [result, setResult] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!jobId) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login.");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://207.154.218.184:8000/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          alert("Session expired. Please login again.");
          clearInterval(interval);
          return;
        }

        const data = await res.json();

        if (data.status === "done") {
          clearInterval(interval);
          setResult(data.analysis);
        }

      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  const exportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
    pdf.save("TeamVase_Report.pdf");
  };

  if (!result) {
    return <div style={{ padding: 40 }}>Processing...</div>;
  }

  return (
    <div style={{ padding: 24, background: "#f4f6f8" }}>

      <button onClick={exportPDF}>Export PDF</button>

      <div ref={reportRef}>

        <h1>Project Dashboard</h1>

        <div style={{ display: "flex", gap: 10 }}>
          <MetricCard title="Health" value={result.health_score} />
          <MetricCard title="Open Ends" value={result.metrics?.open_ends} />
          <MetricCard title="Neg Float" value={result.metrics?.negative_float_activities} />
        </div>

        <RiskSummary risk={result.risk_analysis} />

        <MonteCarloChart
          data={result.risk_analysis?.finish_probability_curve}
          p50={result.risk_analysis?.p50}
          p90={result.risk_analysis?.p90}
        />

        <RiskDrivers drivers={result.risk_drivers} />
        <TornadoChart data={result.risk_analysis?.tornado_chart} />
        <FloatChart metrics={result} />

        <IssuesTable issues={result.issues} />

      </div>
    </div>
  );
}