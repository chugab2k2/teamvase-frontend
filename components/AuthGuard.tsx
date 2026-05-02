"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (pathname === "/login" || pathname === "/register") {
      setLoading(false);
      return;
    }

    if (!token) {
      const query = searchParams.toString();
      const currentUrl = query ? `${pathname}?${query}` : pathname;

      router.replace(`/login?next=${encodeURIComponent(currentUrl)}`);
      return;
    }

    setLoading(false);
  }, [pathname, router, searchParams]);

  if (loading) {
    return <div style={{ padding: 40 }}>Checking authentication...</div>;
  }

  return <>{children}</>;
}