"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API } from "@/lib/api";

function getSafeNext(nextUrl: string | null) {
  if (!nextUrl) return "/upload";
  if (!nextUrl.startsWith("/")) return "/upload";
  if (nextUrl.startsWith("//")) return "/upload";
  return nextUrl;
}

function LoginContent() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nextUrl = getSafeNext(searchParams.get("next"));

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      if (!email.trim()) throw new Error("Please enter your email.");
      if (!password.trim()) throw new Error("Please enter your password.");

      const res = await fetch(`${API.replace(/\/+$/, "")}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Invalid credentials");
      }

      if (!data?.access_token) {
        throw new Error("Login succeeded but no access token was returned.");
      }

      localStorage.setItem("token", data.access_token);
      window.location.href = nextUrl;
    } catch (err: any) {
      setError(err.message || "Login failed");
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
          width: 360,
          padding: 30,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>TeamVase Login</h2>

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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        />

        <button onClick={handleLogin} disabled={loading} style={buttonStyle}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error ? <p style={{ color: "red", marginTop: 10 }}>{error}</p> : null}

        <p style={{ marginTop: 16, fontSize: 14, color: "#475569" }}>
          Don’t have an account yet?{" "}
          <a
            href={`/register?next=${encodeURIComponent(nextUrl)}`}
            style={{
              color: "#2563eb",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading login...</div>}>
      <LoginContent />
    </Suspense>
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