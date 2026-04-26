"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";

type MeResponse = {
  email: string;
  plan: string;
};

export default function BillingSuccessPage() {
  const [status, setStatus] = useState("Confirming your subscription...");
  const [plan, setPlan] = useState("");
  const [email, setEmail] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const confirmSubscription = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setNeedsLogin(true);
        setStatus(
          "Your payment was successful. Please log in again to refresh your Pro access."
        );
        return;
      }

      for (let attempt = 1; attempt <= 8; attempt++) {
        try {
          const res = await fetch(`${API}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 401) {
            localStorage.removeItem("token");
            setNeedsLogin(true);
            setStatus(
              "Your payment was successful. Please log in again to refresh your Pro access."
            );
            return;
          }

          const data: MeResponse = await res.json();

          setPlan(data.plan);
          setEmail(data.email);

          if (String(data.plan).toLowerCase() === "pro") {
            setStatus("Your Pro subscription is active.");
            return;
          }

          setStatus("Payment received. Waiting for Stripe to confirm your Pro access...");
        } catch {
          setStatus("Payment received. Still confirming your account status...");
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setStatus("Payment received. Your plan may take a short moment to update.");
    };

    confirmSubscription();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 32 }}>
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Subscription successful</h1>

        <p style={{ color: "#475569", lineHeight: 1.8 }}>{status}</p>

        {email ? (
          <div
            style={{
              marginTop: 18,
              padding: 18,
              borderRadius: 18,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 800 }}>
              ACCOUNT
            </div>
            <div style={{ marginTop: 6, fontWeight: 800 }}>{email}</div>

            <div
              style={{
                marginTop: 14,
                fontSize: 13,
                color: "#64748b",
                fontWeight: 800,
              }}
            >
              CURRENT PLAN
            </div>
            <div style={{ marginTop: 6, fontWeight: 900 }}>
              {plan ? plan.toUpperCase() : "CONFIRMING..."}
            </div>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          {needsLogin ? (
            <button
              onClick={() => {
                window.location.href = "/login?next=/billing";
              }}
              style={primaryButton}
            >
              Log in to Continue
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  window.location.href = "/billing";
                }}
                style={primaryButton}
              >
                Go to Billing
              </button>

              <button
                onClick={() => {
                  window.location.href = "/upload";
                }}
                style={secondaryButton}
              >
                Go to Upload
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  fontWeight: 700,
  cursor: "pointer",
};