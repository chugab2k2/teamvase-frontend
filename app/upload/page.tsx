"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type MeResponse = {
  id: number;
  email: string;
  plan: string;
  usage?: {
    uploads_used: number;
    upload_limit: number | null;
    reports_used: number;
    report_limit: number | null;
  };
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState("baseline 01");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successText, setSuccessText] = useState("");
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const loadMe = async () => {
    try {
      setLoadingMe(true);

      const res = await apiFetch("/auth/me");
      if (!res) {
        throw new Error("No response from API.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Failed to load account usage.");
      }

      setMe(data);
    } catch (err: any) {
      console.error("LOAD /auth/me ERROR:", err);
      setError(err?.message || "Failed to load account usage.");
    } finally {
      setLoadingMe(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const currentPlan = String(me?.plan || "free").toLowerCase();
  const uploadsUsed = me?.usage?.uploads_used ?? 0;
  const uploadLimit = me?.usage?.upload_limit ?? null;

  const limitReached = useMemo(() => {
    if (uploadLimit === null) return false;
    return uploadsUsed >= uploadLimit;
  }, [uploadsUsed, uploadLimit]);

  const handleUpload = async () => {
    try {
      setError("");
      setSuccessText("");

      if (!file) {
        setError("Please choose a Primavera .xer file first.");
        return;
      }

      if (!version.trim()) {
        setError("Please enter a version.");
        return;
      }

      if (limitReached) {
        setError("You’ve reached your free upload limit. Upgrade to Pro for unlimited uploads.");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("version", version);

      const res = await apiFetch("/jobs/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.detail || data?.error || "Upload failed. Please try again."
        );
      }

      const jobId = data?.job_id;
      if (!jobId) {
        throw new Error("Upload succeeded but no job_id was returned.");
      }

      await loadMe();

      setSuccessText("Upload successful. Redirecting to dashboard...");

      window.location.href = `/dashboard?job_id=${jobId}`;
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);
      setError(err?.message || "Upload failed.");

      if (String(err?.message || "").toLowerCase().includes("upload limit")) {
        try {
          await loadMe();
        } catch (refreshErr) {
          console.error("REFRESH /auth/me AFTER LIMIT ERROR:", refreshErr);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gap: "24px",
        }}
      >
        <section
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
            color: "#ffffff",
            borderRadius: "24px",
            padding: "28px 30px",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#cbd5e1",
                }}
              >
                TeamVase AI Copilot
              </div>

              <h1
                style={{
                  margin: "10px 0 8px",
                  fontSize: "34px",
                  lineHeight: 1.1,
                  fontWeight: 800,
                }}
              >
                Upload Primavera Schedule
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: "15px",
                }}
              >
                Upload your Primavera P6 `.xer` file to generate instant project controls insights.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "18px",
                padding: "14px 16px",
                minWidth: "260px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                }}
              >
                Current Plan
              </div>

              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  marginBottom: "10px",
                }}
              >
                {loadingMe ? "Loading..." : currentPlan.toUpperCase()}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#e2e8f0",
                }}
              >
                Uploads used:{" "}
                <strong>
                  {loadingMe ? "..." : uploadsUsed} /{" "}
                  {loadingMe ? "..." : uploadLimit === null ? "Unlimited" : uploadLimit}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {currentPlan === "free" ? (
          <section
            style={{
              background: limitReached ? "#fff7ed" : "#eff6ff",
              border: limitReached ? "1px solid #fdba74" : "1px solid #bfdbfe",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "6px",
                }}
              >
                {limitReached
                  ? "Free upload limit reached"
                  : "You are on the Free plan"}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  lineHeight: 1.7,
                }}
              >
                {limitReached
                  ? "You’ve used all free uploads available on your plan. Upgrade to Pro to continue uploading schedules."
                  : "Free users can upload up to 3 schedules. Upgrade to Pro for unlimited uploads and uninterrupted analysis workflow."}
              </div>
            </div>

            <button
              onClick={() => {
                window.location.href = "/pricing";
              }}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                border: "1px solid #2563eb",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Upgrade to Pro
            </button>
          </section>
        ) : null}

        {error ? (
          <div
            style={{
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#991b1b",
              borderRadius: "18px",
              padding: "18px",
            }}
          >
            {error}
          </div>
        ) : null}

        {successText ? (
          <div
            style={{
              border: "1px solid #bbf7d0",
              background: "#f0fdf4",
              color: "#166534",
              borderRadius: "18px",
              padding: "18px",
            }}
          >
            {successText}
          </div>
        ) : null}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "18px",
                color: "#0f172a",
                fontSize: "26px",
                fontWeight: 800,
              }}
            >
              Upload Schedule File
            </h2>

            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Version
                </label>

                <input
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="Enter schedule version"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Primavera File
                </label>

                <input
                  type="file"
                  accept=".xer"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={limitReached || uploading}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    background: limitReached ? "#f8fafc" : "#ffffff",
                  }}
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading || loadingMe || limitReached}
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "1px solid #2563eb",
                  background: uploading || loadingMe || limitReached ? "#93c5fd" : "#2563eb",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "15px",
                  cursor:
                    uploading || loadingMe || limitReached ? "not-allowed" : "pointer",
                }}
              >
                {limitReached
                  ? "Upgrade Required"
                  : uploading
                  ? "Uploading..."
                  : "Upload and Analyze"}
              </button>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "18px",
                color: "#0f172a",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              Plan Benefits
            </h2>

            <div style={{ display: "grid", gap: "12px" }}>
              <div style={featureItem}>Upload Primavera P6 `.xer` files</div>
              <div style={featureItem}>Instant schedule analysis</div>
              <div style={featureItem}>Portfolio and report workflows</div>
              <div style={featureItem}>Billing-backed upgrade path</div>
            </div>

            <div
              style={{
                marginTop: "24px",
                padding: "18px",
                borderRadius: "18px",
                background: currentPlan === "pro" ? "#f0fdf4" : "#eff6ff",
                border:
                  currentPlan === "pro"
                    ? "1px solid #bbf7d0"
                    : "1px solid #bfdbfe",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                {currentPlan === "pro" ? "You are on Pro" : "Upgrade to Pro"}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: "14px",
                }}
              >
                {currentPlan === "pro"
                  ? "Your account has unlimited upload access and unlimited saved report capacity."
                  : "Pro unlocks unlimited uploads and removes the free plan ceiling from your working workflow."}
              </div>

              {currentPlan !== "pro" ? (
                <button
                  onClick={() => {
                    window.location.href = "/pricing";
                  }}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #2563eb",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  View Pricing
                </button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const featureItem: React.CSSProperties = {
  fontSize: "14px",
  color: "#334155",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};