"use client";

export default function AppNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(248, 250, 252, 0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "#0f172a",
            fontWeight: 900,
            fontSize: "18px",
            letterSpacing: "0.02em",
          }}
        >
          TeamVase AI Copilot
        </a>

        <nav
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/upload">Upload</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/billing">Billing</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        textDecoration: "none",
        color: "#334155",
        fontWeight: 700,
        fontSize: "14px",
        padding: "10px 14px",
        borderRadius: "12px",
      }}
    >
      {children}
    </a>
  );
}