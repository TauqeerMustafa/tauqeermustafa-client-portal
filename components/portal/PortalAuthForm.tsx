"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, KeyRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PortalRole } from "@/lib/portal-config";
import { isPendingActivationError, portalFetch, setPortalToken } from "@/lib/portal-auth";

const roleCopy: Record<PortalRole, { heading: string; note: string }> = {
  emp: { heading: "Employee sign in", note: "Access assignments, priorities, and internal team updates." },
  client: { heading: "Client sign in", note: "Access project progress, milestones, and your TMI conversations." },
  member: { heading: "Member sign in", note: "Access your membership standing, benefits, and resources." },
  manager: { heading: "Manager sign in", note: "Access team capacity, assignments, and approvals." },
};

type LoginResponse = { access_token: string };

type Props = { role: PortalRole };

export default function PortalAuthForm({ role }: Props) {
  const router = useRouter();
  const copy = roleCopy[role];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await portalFetch<LoginResponse>(role, `/auth/${role}/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!result?.access_token) throw new Error("The login response did not include an access token.");
      setPortalToken(role, result.access_token);
      router.replace(`/${role}/dashboard`);
    } catch (requestError) {
      if (isPendingActivationError(requestError)) {
        setError("Your account is pending admin activation. Please contact an administrator on the main admin portal.");
      } else if ((requestError as { status?: number })?.status === 401) {
        setError("The email or password is not correct. Check your credentials and try again.");
      } else {
        setError(requestError instanceof Error ? requestError.message : "Sign in could not be completed.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="portal-login-card">
      <div className="portal-login-card__topline">
        <span className="portal-label">Authorized access</span>
        <ShieldCheck aria-hidden className="h-5 w-5 text-[var(--portal-blue)]" />
      </div>
      <h2 className="portal-section-title">{copy.heading}</h2>
      <p className="portal-muted mt-3">{copy.note}</p>
      <form className="mt-8 space-y-5" onSubmit={submit}>
        <div>
          <label className="portal-field-label" htmlFor={`${role}-email`}><Mail aria-hidden className="h-3.5 w-3.5" /> Email address</label>
          <input className="portal-input" id={`${role}-email`} name="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required />
        </div>
        <div>
          <label className="portal-field-label" htmlFor={`${role}-password`}><KeyRound aria-hidden className="h-3.5 w-3.5" /> Password</label>
          <input className="portal-input" id={`${role}-password`} name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
        </div>
        {error ? <div className="portal-alert" role="alert"><LockKeyhole aria-hidden className="h-4 w-4 shrink-0" /><span>{error}</span></div> : null}
        <button className="portal-button w-full" disabled={busy} type="submit">{busy ? "Signing in…" : "Sign in"}<ArrowRight aria-hidden className="h-4 w-4" /></button>
      </form>
      <p className="portal-microcopy mt-6">Accounts are created and activated by an administrator. Self-registration is not available.</p>
    </div>
  );
}
