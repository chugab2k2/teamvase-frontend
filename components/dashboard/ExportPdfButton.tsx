"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ExportPdfButton() {
  const exportPdf = async () => {
    const dashboard = document.getElementById("executive-dashboard");

    if (!dashboard) {
      alert("Dashboard not found");
      return;
    }

    const canvas = await html2canvas(dashboard, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pdfHeight;
    }

    pdf.save("TeamVase-Executive-Report.pdf");
  };

  return (
    <button
      onClick={exportPdf}
      style={{
        padding: "12px 18px",
        borderRadius: "12px",
        border: "1px solid #2563eb",
        background: "#2563eb",
        color: "#ffffff",
        fontWeight: 800,
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      Export Executive PDF
    </button>
  );
}
