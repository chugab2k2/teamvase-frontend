"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (pathname === "/login" || pathname === "/register") {
      setLoading(false);
      return;
    }

    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return <div style={{ padding: 40 }}>Checking authentication...</div>;
  }

  return <>{children}</>;
}