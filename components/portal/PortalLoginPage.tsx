import type { PortalRole } from "@/lib/portal-config";
import { PORTAL_CONFIG } from "@/lib/portal-config";
import PortalAuthForm from "@/components/portal/PortalAuthForm";

export default function PortalLoginPage({ role }: { role: PortalRole }) {
  const config = PORTAL_CONFIG[role];
  return (
    <main className="portal-main portal-login-layout">
      <section aria-labelledby={`${role}-login-heading`}>
        <p className="portal-kicker">{config.eyebrow}</p>
        <h1 className="portal-login-hero-title" id={`${role}-login-heading`}>{config.title.split(",")[0]}<br /><span>{config.title.split(",")[1]?.trim() || "securely."}</span></h1>
        <p className="portal-hero-copy" style={{ color: "var(--portal-muted)" }}>{config.description} This workspace is private and available only to accounts created and activated by an administrator.</p>
      </section>
      <PortalAuthForm role={role} />
    </main>
  );
}
