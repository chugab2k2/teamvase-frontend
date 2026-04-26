"use client";

import { useEffect, useState } from "react";
import { API, apiFetch } from "@/lib/api";

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

function FeatureRow({
  feature,
  free,
  pro,
}: {
  feature: string;
  free: string;
  pro: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 0.8fr 0.8fr",
        gap: "12px",
        padding: "16px 18px",
        borderBottom: "1px solid #e5e7eb",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
        {feature}
      </div>

      <div style={{ fontSize: "14px", color: "#475569" }}>{free}</div>

      <div style={{ fontSize: "14px", color: "#166534", fontWeight: 700 }}>
        {pro}
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  description,
  accent,
  highlighted = false,
  children,
}: {
  name: string;
  price: string;
  description: string;
  accent: string;
  highlighted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: highlighted ? `2px solid ${accent}` : "1px solid #e5e7eb",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: highlighted
          ? "0 14px 36px rgba(37, 99, 235, 0.14)"
          : "0 6px 20px rgba(15, 23, 42, 0.06)",
        position: "relative",
      }}
    >
      {highlighted ? (
        <div
          style={{
            position: "absolute",
            top: "-12px",
            right: "20px",
            background: accent,
            color: "#ffffff",
            borderRadius: "999px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Best Value
        </div>
      ) : null}

      <div
        style={{
          fontSize: "14px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: accent,
          marginBottom: "10px",
        }}
      >
        {name}
      </div>

      <div
        style={{
          fontSize: "40px",
          fontWeight: 900,
          color: "#0f172a",
          lineHeight: 1,
        }}
      >
        {price}
      </div>

      <div
        style={{
          marginTop: "12px",
          fontSize: "14px",
          color: "#475569",
          lineHeight: 1.7,
          minHeight: "48px",
        }}
      >
        {description}
      </div>

      <div style={{ marginTop: "20px" }}>{children}</div>
    </div>
  );
}

export default function PricingPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMe = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          setMe(null);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          setMe(null);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.detail || data?.error || "Failed to load account.");
        }

        setMe(data);
      } catch (err: any) {
        console.error("PRICING /auth/me ERROR:", err);
        setMe(null);
        setError(err?.message || "");
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, []);

  const currentPlan = String(me?.plan || "free").toLowerCase();
  const uploadsUsed = me?.usage?.uploads_used ?? 0;
  const uploadLimit = me?.usage?.upload_limit ?? null;

  const handleUpgrade = async () => {
    try {
      setCheckoutLoading(true);
      setError("");

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        window.location.href = "/login?next=/billing";
        return;
      }

      const res = await apiFetch("/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Unable to start checkout.");
      }

      if (!data?.url) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error("PRICING CHECKOUT ERROR:", err);
      setError(err?.detail || err?.message || "Unable to start checkout.");
      setCheckoutLoading(false);
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
          maxWidth: "1280px",
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
            padding: "30px 32px",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "24px",
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
                  fontSize: "38px",
                  lineHeight: 1.1,
                  fontWeight: 900,
                }}
              >
                Pricing & Upgrade Plans
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: "16px",
                  maxWidth: "760px",
                  lineHeight: 1.8,
                }}
              >
                Choose the plan that fits your project controls workflow. Start
                free, then unlock advanced AI analysis, unlimited capacity, and
                stronger executive reporting with Pro.
              </p>
            </div>

            <div
              style={{
                minWidth: "260px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "18px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#cbd5e1",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Current Account Status
              </div>

              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                }}
              >
                {loading ? "Loading..." : currentPlan.toUpperCase()}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "14px",
                  color: "#e2e8f0",
                }}
              >
                Upload usage:{" "}
                <strong>
                  {loading ? "..." : uploadsUsed} /{" "}
                  {loading ? "..." : uploadLimit === null ? "Unlimited" : uploadLimit}
                </strong>
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
            gap: "24px",
          }}
        >
          <PlanCard
            name="Free"
            price="$0"
            description="For early validation, light schedule uploads, and basic project controls analysis."
            accent="#f59e0b"
          >
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={bulletItem}>Basic upload workflow</div>
              <div style={bulletItem}>Core dashboard metrics</div>
              <div style={bulletItem}>Limited uploads</div>
              <div style={bulletItem}>Limited saved reports</div>
            </div>

            <button
              disabled
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#64748b",
                fontWeight: 800,
                cursor: "not-allowed",
              }}
            >
              {currentPlan === "free" ? "Current Plan" : "Free Plan"}
            </button>
          </PlanCard>

          <PlanCard
            name="Pro"
            price="$29/mo"
            description="For serious project controls workflows that need AI interpretation, comparison intelligence, and unlimited capacity."
            accent="#2563eb"
            highlighted
          >
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={bulletItem}>Unlimited uploads</div>
              <div style={bulletItem}>AI Explanation Engine</div>
              <div style={bulletItem}>AI portfolio comparison insight</div>
              <div style={bulletItem}>Unlimited saved reports</div>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={checkoutLoading || currentPlan === "pro"}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "1px solid #2563eb",
                background:
                  currentPlan === "pro"
                    ? "#dbeafe"
                    : checkoutLoading
                    ? "#93c5fd"
                    : "#2563eb",
                color: currentPlan === "pro" ? "#1d4ed8" : "#ffffff",
                fontWeight: 800,
                cursor:
                  currentPlan === "pro" || checkoutLoading
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {currentPlan === "pro"
                ? "Already on Pro"
                : checkoutLoading
                ? "Redirecting to Checkout..."
                : "Upgrade to Pro"}
            </button>
          </PlanCard>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "26px",
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              Feature Comparison
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Clear visibility into what unlocks when you move from Free to Pro.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 0.8fr 0.8fr",
              gap: "12px",
              padding: "16px 18px",
              background: "#f8fafc",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            <div>Feature</div>
            <div>Free</div>
            <div>Pro</div>
          </div>

          <FeatureRow feature="Schedule uploads" free="Up to 3" pro="Unlimited" />
          <FeatureRow feature="Dashboard metrics" free="Included" pro="Included" />
          <FeatureRow feature="AI Explanation Engine" free="Locked" pro="Included" />
          <FeatureRow feature="AI Compare insight" free="Locked" pro="Included" />
          <FeatureRow feature="Saved reports" free="Up to 3" pro="Unlimited" />
          <FeatureRow
            feature="Executive workflow continuity"
            free="Limited"
            pro="Included"
          />
        </section>
      </div>
    </div>
  );
}

const bulletItem: React.CSSProperties = {
  fontSize: "14px",
  color: "#334155",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};