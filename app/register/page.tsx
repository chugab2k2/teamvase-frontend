"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextUrl = searchParams.get("next") || "/upload";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successText, setSuccessText] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccessText("");

    try {
      if (!email.trim()) {
        throw new Error("Please enter your email.");
      }

      if (!password.trim()) {
        throw new Error("Please enter a password.");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Registration failed.");
      }

      setSuccessText("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
      }, 800);
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: 400,
          padding: 30,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: 10 }}>Create TeamVase Account</h2>

        <p
          style={{
            marginTop: 0,
            marginBottom: 20,
            color: "#64748b",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Create your account to start uploading Primavera schedules and using
          TeamVase AI Copilot.
        </p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {error && (
          <p style={{ color: "#dc2626", marginTop: 10 }}>{error}</p>
        )}

        {successText && (
          <p style={{ color: "#16a34a", marginTop: 10 }}>{successText}</p>
        )}

        <p
          style={{
            marginTop: 18,
            fontSize: 14,
            color: "#475569",
          }}
        >
          Already have an account?{" "}
          <a
            href={`/login?next=${encodeURIComponent(nextUrl)}`}
            style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ddd",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};