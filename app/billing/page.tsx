"use client";

import { useEffect, useState } from "react";
import { API, apiFetch } from "@/lib/api";

type MeResponse = {
  email: string;
  plan: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
};

export default function BillingPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        if (!token) {
          window.location.href = "/login?next=/billing";
          return;
        }

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login?next=/billing";
          return;
        }

        const data = await res.json();
        setMe(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load billing info");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleUpgrade = async () => {
    try {
      setCheckoutLoading(true);
      setError("");

      const res = await apiFetch("/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!data?.url) {
        throw new Error("Checkout URL missing");
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.detail || err?.message || "Unable to start checkout");
      setCheckoutLoading(false);
    }
  };

  const handleManage = async () => {
    try {
      setPortalLoading(true);
      setError("");

      const res = await apiFetch("/billing/create-portal-session", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!data?.url) {
        throw new Error("Portal URL missing");
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.detail || err?.message || "Unable to open billing portal");
      setPortalLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading billing...</div>;
  }

  const plan = (me?.plan || "free").toLowerCase();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 32 }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Billing</h1>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 12,
              background: "#fee2e2",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 14, color: "#64748b" }}>Account</div>
          <div style={{ fontWeight: 800 }}>{me?.email}</div>

          <div style={{ marginTop: 16, fontSize: 14, color: "#64748b" }}>
            Current Plan
          </div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>
            {plan.toUpperCase()}
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          {plan !== "pro" && (
            <button
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              style={primaryButton}
            >
              {checkoutLoading
                ? "Redirecting..."
                : "Upgrade to Pro ($29/mo)"}
            </button>
          )}

          {plan === "pro" && (
            <button
              onClick={handleManage}
              disabled={portalLoading}
              style={secondaryButton}
            >
              {portalLoading
                ? "Opening..."
                : "Manage Subscription"}
            </button>
          )}
        </div>

        {plan === "pro" && (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 16,
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              color: "#0369a1",
            }}
          >
            You can manage your subscription, update payment method,
            or cancel anytime via the Stripe customer portal.
          </div>
        )}
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