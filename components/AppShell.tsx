"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "Upload" },
  { href: "/my-analyses", label: "My Analyses" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/reports", label: "Reports" },
];

function isAuthPage(pathname: string) {
  return pathname === "/login" || pathname === "/register";
}

function isDetailPage(pathname: string) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/compare") || pathname.startsWith("/reports/");
}

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const hideShell = isAuthPage(pathname);

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
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
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

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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