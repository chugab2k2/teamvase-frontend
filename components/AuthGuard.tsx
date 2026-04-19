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

    // Allow login page
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    // No token → redirect
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}