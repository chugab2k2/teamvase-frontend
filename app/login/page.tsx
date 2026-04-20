"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API =
    process.env.NEXT_PUBLIC_API_URL || "https://api.teamvase.com";

  const nextUrl = searchParams.get("next") || "/upload";

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      localStorage.setItem("token", data.access_token);

      router.push(nextUrl);
    } catch (err: any) {
      setError(err.message || "Login failed");
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
        />

        <button onClick={handleLogin} disabled={loading} style={buttonStyle}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

        <p style={{ marginTop: 16, fontSize: 14, color: "#64748b" }}>
          Don’t have an account yet? Registration will be added next.
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