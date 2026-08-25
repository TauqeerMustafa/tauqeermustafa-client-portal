"use client";

import { ReactNode } from "react";
import { LogOut, Menu, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PortalRole } from "@/lib/portal-config";
import { clearPortalToken } from "@/lib/portal-auth";
import { PORTAL_CONFIG } from "@/lib/portal-config";

export default function PortalShell({ role, children }: { role: PortalRole; children: ReactNode }) {
  const router = useRouter();
  const config = PORTAL_CONFIG[role];

  function signOut() {
    clearPortalToken(role);
    router.replace(`/${role}/login`);
  }

  return (
    <div className="portal-app-shell">
      <div className="portal-stripe" aria-hidden />
      <header className="portal-header">
        <Link className="portal-brand" href={`/${role}/dashboard`} aria-label={`${config.label} dashboard`}>
          <span className="portal-brand-mark"><Shield aria-hidden className="h-4 w-4" /></span>
          <span>TAUQEER MUSTAFA INC.</span>
        </Link>
        <nav className="portal-nav" aria-label={`${config.label} navigation`}>
          <Menu aria-hidden className="h-4 w-4 text-white/45 lg:hidden" />
          {config.nav.map((item) => <a key={item.id} href={`/${role}/dashboard#${item.id}`} className="portal-nav-link">{item.label}</a>)}
          <button className="portal-signout" onClick={signOut} type="button"><LogOut aria-hidden className="h-3.5 w-3.5" /> Sign out</button>
        </nav>
      </header>
      {children}
    </div>
  );
}
