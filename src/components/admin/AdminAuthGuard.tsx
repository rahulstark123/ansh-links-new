"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/admin/me");
        if (cancelled) return;
        if (res.ok) {
          setAuthenticated(true);
        } else {
          router.replace(`/adminpanel/login?from=${encodeURIComponent(pathname)}`);
        }
      } catch {
        if (!cancelled) {
          router.replace("/adminpanel/login");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Verifying session…</div>
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
