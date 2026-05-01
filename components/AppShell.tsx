"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const navItems = [
  { href: "/", label: "Upload" },
  { href: "/my-analyses", label: "My Analyses" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/reports", label: "Reports" },
];

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

function isAuthPage(pathname: string) {
  return pathname === "/login" || pathname === "/register";
}

function isDetailPage(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/reports/")
  );
}

function UsageBadge({ me }: { me: MeResponse | null }) {
  const plan = String(me?.plan || "free").toLowerCase();
  const uploadsUsed = me?.usage?.uploads_used ?? 0;
  const uploadLimit = me?.usage?.upload_limit ?? null;

  if (!me) return null;

  if (plan === "pro" || uploadLimit === null) {
    return (
      <div
        style={{
          padding: "9px 12px",
          borderRadius: "999px",
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #86efac",
          fontWeight: 800,
          fontSize: 12,
          whiteSpace: "nowrap",
        }}
      >
        PRO · Unlimited uploads
      </div>
    );
  }

  const ratio = uploadLimit > 0 ? uploadsUsed / uploadLimit : 0;
  const nearLimit = ratio >= 0.8;
  const limitReached = uploadsUsed >= uploadLimit;

  return (
    <div
      style={{
        padding: "9px 12px",
        borderRadius: "999px",
        background: limitReached ? "#fee2e2" : nearLimit ? "#fef3c7" : "#e0f2fe",
        color: limitReached ? "#991b1b" : nearLimit ? "#92400e" : "#075985",
        border: limitReached
          ? "1px solid #fca5a5"
          : nearLimit
          ? "1px solid #fcd34d"
          : "1px solid #7dd3fc",
        fontWeight: 800,
        fontSize: 12,
        whiteSpace: "nowrap",
      }}
    >
      {limitReached
        ? `Limit reached · ${uploadsUsed}/${uploadLimit}`
        : nearLimit
        ? `Upgrade soon · ${uploadsUsed}/${uploadLimit}`
        : `Free · ${uploadsUsed}/${uploadLimit} uploads`}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [me, setMe] = useState<MeResponse | null>(null);

  const hideShell = isAuthPage(pathname);

  const activePlan = useMemo(() => String(me?.plan || "free").toLowerCase(), [me]);

  useEffect(() => {
    if (hideShell) return;

    const loadMe = async () => {
      try {
        const res = await apiFetch("/auth/me");
        const data = await res.json();

        if (res.ok) {
          setMe(data);
        }
      } catch (err) {
        console.error("APP SHELL /auth/me ERROR:", err);
      }
    };

    loadMe();
  }, [hideShell, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(15, 23, 42, 0.96)",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "0.01em",
              }}
            >
              TeamVase AI Copilot
            </Link>

            <nav
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      padding: "10px 14px",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      color: active ? "#0f172a" : "#e2e8f0",
                      background: active ? "#ffffff" : "transparent",
                      border: active
                        ? "1px solid #ffffff"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {isDetailPage(pathname) && (
                <span
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0f172a",
                    background: "#bfdbfe",
                    border: "1px solid #93c5fd",
                  }}
                >
                  Detail View
                </span>
              )}
            </nav>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <UsageBadge me={me} />

            {activePlan !== "pro" ? (
              <button
                onClick={() => router.push("/pricing")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid #93c5fd",
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Upgrade
              </button>
            ) : null}

            <button
              onClick={() => router.push("/compare")}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Compare
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}