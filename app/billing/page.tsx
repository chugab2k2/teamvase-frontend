"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type MeResponse = {
  id: number;
  email: string;
  plan: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  usage?: {
    uploads_used: number;
    upload_limit: number | null;
    reports_used: number;
    report_limit: number | null;
  };
};

export default function BillingPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMe = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch("/auth/me");

        if (!res) {
          throw new Error("No response from API.");
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.detail || data?.error || "Failed to load billing details.");
        }

        setMe(data);
      } catch (err: any) {
        console.error("BILLING LOAD ERROR:", err);
        setError(err?.message || "Failed to load billing details.");
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, []);

  const handleUpgrade = async () => {
    try {
      setCheckoutLoading(true);
      setError("");

      const res = await apiFetch("/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!res) {
        throw new Error("No response from API.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Failed to create checkout session.");
      }

      if (!data?.url) {
        throw new Error("Checkout URL not returned by backend.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error("CHECKOUT ERROR:", err);
      setError(err?.message || "Failed to start checkout.");
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      setError("");

      const res = await apiFetch("/billing/create-portal-session", {
        method: "POST",
      });

      if (!res) {
        throw new Error("No response from API.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Failed to open billing portal.");
      }

      if (!data?.url) {
        throw new Error("Portal URL not returned by backend.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error("PORTAL ERROR:", err);
      setError(err?.message || "Failed to open billing portal.");
      setPortalLoading(false);
    }
  };

  const currentPlan = String(me?.plan || "free").toLowerCase();
  const isPro = currentPlan === "pro";

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
          maxWidth: "1100px",
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
                Billing & Subscription
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: "15px",
                  lineHeight: 1.7,
                }}
              >
                Manage your current plan, monitor usage, and upgrade to Pro when you are
                ready to unlock the full AI project controls workflow.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "18px",
                padding: "14px 16px",
                minWidth: "220px",
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
                }}
              >
                {loading ? "Loading..." : currentPlan.toUpperCase()}
              </div>
            </div>
          </div>
        </section>

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

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div style={card}>
            <h2 style={cardTitle}>Account Summary</h2>

            {loading ? (
              <p style={mutedText}>Loading account usage...</p>
            ) : me ? (
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <div style={labelStyle}>Email</div>
                  <div style={valueStyle}>{me.email}</div>
                </div>

                <div>
                  <div style={labelStyle}>Plan</div>
                  <div style={valueStyle}>{me.plan.toUpperCase()}</div>
                </div>

                <div>
                  <div style={labelStyle}>Uploads Used</div>
                  <div style={valueStyle}>
                    {me.usage?.uploads_used ?? 0} /{" "}
                    {me.usage?.upload_limit == null ? "Unlimited" : me.usage.upload_limit}
                  </div>
                </div>

                <div>
                  <div style={labelStyle}>Reports Used</div>
                  <div style={valueStyle}>
                    {me.usage?.reports_used ?? 0} /{" "}
                    {me.usage?.report_limit == null ? "Unlimited" : me.usage.report_limit}
                  </div>
                </div>

                <div>
                  <div style={labelStyle}>Stripe Customer</div>
                  <div style={valueStyle}>
                    {me.stripe_customer_id || "Not created yet"}
                  </div>
                </div>

                <div>
                  <div style={labelStyle}>Stripe Subscription</div>
                  <div style={valueStyle}>
                    {me.stripe_subscription_id || "No active subscription yet"}
                  </div>
                </div>
              </div>
            ) : (
              <p style={mutedText}>No billing data available.</p>
            )}
          </div>

          <div style={card}>
            <h2 style={cardTitle}>TeamVase Pro</h2>

            <div style={{ display: "grid", gap: "10px", marginBottom: "18px" }}>
              <div style={featureItem}>Unlimited uploads</div>
              <div style={featureItem}>Unlimited saved reports</div>
              <div style={featureItem}>AI explanation engine</div>
              <div style={featureItem}>AI portfolio comparison insight</div>
              <div style={featureItem}>Manage subscription via Stripe portal</div>
            </div>

            <div
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              Pro
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "20px",
                lineHeight: 1.7,
              }}
            >
              Monthly subscription billed through Stripe Checkout.
              Use this page to upgrade or manage an existing subscription.
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading || loading || isPro}
                style={{
                  ...primaryBtn,
                  opacity: checkoutLoading || loading || isPro ? 0.7 : 1,
                  cursor:
                    checkoutLoading || loading || isPro ? "not-allowed" : "pointer",
                }}
              >
                {isPro
                  ? "Already on Pro"
                  : checkoutLoading
                  ? "Redirecting..."
                  : "Upgrade to Pro"}
              </button>

              <button
                onClick={handleManageSubscription}
                disabled={portalLoading || loading || !me?.stripe_customer_id}
                style={{
                  ...secondaryBtn,
                  opacity: portalLoading || loading || !me?.stripe_customer_id ? 0.7 : 1,
                  cursor:
                    portalLoading || loading || !me?.stripe_customer_id
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {portalLoading ? "Opening..." : "Manage Subscription"}
              </button>
            </div>

            <div
              style={{
                marginTop: "16px",
                fontSize: "13px",
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              {!me?.stripe_customer_id
                ? "A Stripe customer record will be created automatically when you first start checkout."
                : "You already have a Stripe customer record linked to this account."}
            </div>
          </div>
        </section>

        <section style={card}>
          <h2 style={cardTitle}>Need a clearer comparison first?</h2>

          <p
            style={{
              marginTop: 0,
              marginBottom: "16px",
              color: "#475569",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            Review the Free vs Pro comparison before deciding. The pricing page gives
            a cleaner breakdown of feature availability and upgrade value.
          </p>

          <button
            onClick={() => {
              window.location.href = "/pricing";
            }}
            style={{
              ...secondaryBtn,
              border: "1px solid #2563eb",
              background: "#eff6ff",
              color: "#1d4ed8",
              cursor: "pointer",
            }}
          >
            View Pricing Page
          </button>
        </section>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
};

const cardTitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "18px",
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: 800,
};

const mutedText: React.CSSProperties = {
  color: "#64748b",
  margin: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "#64748b",
  marginBottom: "4px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#0f172a",
  fontWeight: 600,
};

const featureItem: React.CSSProperties = {
  fontSize: "14px",
  color: "#334155",
  padding: "10px 12px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const primaryBtn: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 700,
};

const secondaryBtn: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontWeight: 700,
};