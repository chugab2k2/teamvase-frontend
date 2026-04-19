"use client";

export default function BillingSuccessPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 32 }}>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Subscription successful</h1>
        <p style={{ color: "#475569", lineHeight: 1.8 }}>
          Your payment was completed successfully. Stripe will notify TeamVase through the webhook,
          and your plan should update shortly.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
          <button
            onClick={() => (window.location.href = "/billing")}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #2563eb",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back to Billing
          </button>

          <button
            onClick={() => (window.location.href = "/reports")}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              background: "#fff",
              color: "#0f172a",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Go to Reports
          </button>
        </div>
      </div>
    </div>
  );
}