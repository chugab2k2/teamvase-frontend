"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type UploadUsage = {
  uploads_used: number;
  upload_limit: number | null;
  reports_used?: number;
  report_limit?: number | null;
};

type UploadCardProps = {
  plan: string;
  usage: UploadUsage;
  onUsageRefresh?: () => Promise<void> | void;
};

function getPlanTone(plan: string) {
  const normalized = (plan || "free").toLowerCase();

  if (normalized === "pro") {
    return {
      label: "PRO",
      bg: "#dcfce7",
      color: "#166534",
      border: "#86efac",
    };
  }

  return {
    label: "FREE",
    bg: "#fef3c7",
    color: "#92400e",
    border: "#fcd34d",
  };
}

export default function UploadCard({
  plan,
  usage,
  onUsageRefresh,
}: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [limitMessage, setLimitMessage] = useState("");

  const router = useRouter();

  const planTone = getPlanTone(plan);

  const isPro = (plan || "").toLowerCase() === "pro";
  const uploadLimit = usage?.upload_limit ?? null;
  const uploadsUsed = usage?.uploads_used ?? 0;

  const atUploadLimit = useMemo(() => {
    if (uploadLimit === null) return false;
    return uploadsUsed >= uploadLimit;
  }, [uploadLimit, uploadsUsed]);

  const usageText =
    uploadLimit === null
      ? `${uploadsUsed} uploads used · Unlimited plan`
      : `${uploadsUsed}/${uploadLimit} uploads used`;

  const handleUpgrade = async () => {
    try {
      setUploadError("");
      const res = await apiFetch("/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Unable to start checkout");
      }

      if (!data?.url) {
        throw new Error("Stripe checkout URL not returned");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert("Unable to open upgrade checkout: " + (err.message || "Unknown error"));
    }
  };

  const handleUpload = async () => {
    setUploadError("");
    setLimitMessage("");

    if (!file) {
      alert("Please select a file");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    if (atUploadLimit && !isPro) {
      setLimitMessage(
        "You’ve reached your free upload limit. Upgrade to Pro for unlimited uploads."
      );
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("version", "baseline 03");

    try {
      const res = await apiFetch("/jobs/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log("STATUS:", res.status);
      console.log("RAW RESPONSE:", text);

      if (res.status === 403) {
        let detailMessage =
          "You’ve reached your free upload limit. Upgrade to Pro for unlimited uploads.";

        try {
          const parsed = JSON.parse(text);
          detailMessage = parsed?.detail || detailMessage;
        } catch {
          if (text) detailMessage = text;
        }

        setLimitMessage(detailMessage);
        return;
      }

      if (!res.ok) {
        throw new Error(text || "Upload failed");
      }

      const data = JSON.parse(text);

      if (onUsageRefresh) {
        await onUsageRefresh();
      }

      router.push(`/dashboard?job_id=${data.job_id}`);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#64748b",
              marginBottom: "10px",
            }}
          >
            TeamVase AI Copilot
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              lineHeight: 1.15,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Upload Primavera P6 Schedule
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              color: "#475569",
              fontSize: "15px",
              maxWidth: "720px",
            }}
          >
            Upload your .xer file to generate schedule diagnostics, risk insights,
            Monte Carlo analysis, and AI-powered project controls interpretation.
          </p>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "999px",
            background: planTone.bg,
            color: planTone.color,
            border: `1px solid ${planTone.border}`,
            fontWeight: 800,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          Plan: {planTone.label}
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "18px",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "10px",
            }}
          >
            Current Plan
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {planTone.label}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "18px",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "10px",
            }}
          >
            Upload Usage
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {usageText}
          </div>
        </div>
      </div>

      {!isPro && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #fde68a",
            background: "#fffbeb",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              color: "#92400e",
              marginBottom: "8px",
            }}
          >
            Upgrade to Pro
          </div>
          <div
            style={{
              color: "#78350f",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            Unlock unlimited schedule uploads, premium AI explanations, and advanced
            comparison workflows.
          </div>
        </div>
      )}

      {atUploadLimit && !isPro && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #fecaca",
            background: "#fef2f2",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              color: "#991b1b",
              marginBottom: "8px",
            }}
          >
            Free upload limit reached
          </div>
          <div
            style={{
              color: "#7f1d1d",
              fontSize: "14px",
              lineHeight: 1.6,
              marginBottom: "14px",
            }}
          >
            You’ve reached your free upload limit. Upgrade to Pro for unlimited
            uploads.
          </div>

          <button
            onClick={handleUpgrade}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 18px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 700,
            color: "#334155",
            marginBottom: "10px",
          }}
        >
          Select .xer file
        </label>

        <input
          type="file"
          accept=".xer"
          disabled={loading || (atUploadLimit && !isPro)}
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setUploadError("");
            setLimitMessage("");
          }}
          style={{
            display: "block",
            width: "100%",
            maxWidth: "520px",
            padding: "12px",
            border: "1px solid #cbd5e1",
            borderRadius: "12px",
            background: atUploadLimit && !isPro ? "#f8fafc" : "#ffffff",
          }}
        />
      </div>

      {file && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "14px",
            color: "#475569",
          }}
        >
          Selected file: <strong>{file.name}</strong>
        </div>
      )}

      {limitMessage && (
        <div
          style={{
            marginTop: "18px",
            color: "#991b1b",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "14px",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {limitMessage}
        </div>
      )}

      {uploadError && (
        <div
          style={{
            marginTop: "18px",
            color: "#991b1b",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "14px",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          Upload failed: {uploadError}
        </div>
      )}

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleUpload}
          disabled={loading || (atUploadLimit && !isPro)}
          style={{
            background:
              loading || (atUploadLimit && !isPro) ? "#94a3b8" : "#0f172a",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            padding: "13px 20px",
            fontWeight: 700,
            cursor:
              loading || (atUploadLimit && !isPro) ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Uploading..." : "Upload XER"}
        </button>

        {!isPro && (
          <button
            onClick={handleUpgrade}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              padding: "13px 20px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </section>
  );
}