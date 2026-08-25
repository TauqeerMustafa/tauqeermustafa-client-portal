"use client";

import { ReactNode, useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { PortalRole } from "@/lib/portal-config";
import { clearPortalToken, getPortalToken } from "@/lib/portal-auth";

type Props = { role: PortalRole; children: ReactNode };

function tokenIsExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

const emptySubscribe = () => () => undefined;

export default function PortalGuard({ role, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const authorized = useSyncExternalStore(
    emptySubscribe,
    () => {
      const token = getPortalToken(role);
      return Boolean(token && !tokenIsExpired(token));
    },
    () => false,
  );

  useEffect(() => {
    if (!authorized) {
      clearPortalToken(role);
      router.replace(`/${role}/login?next=${encodeURIComponent(pathname || `/${role}/dashboard`)}`);
    }
  }, [authorized, pathname, role, router]);

  if (!authorized) return <div className="portal-loading" aria-live="polite">Checking secure access…</div>;
  return <>{children}</>;
}
