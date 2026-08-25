"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CheckCircle2, Clock3, FileCheck2, ListChecks, Mail, Megaphone, Users2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PortalRole } from "@/lib/portal-config";
import { PORTAL_CONFIG } from "@/lib/portal-config";
import { clearPortalToken, isExpiredTokenError, portalFetch } from "@/lib/portal-auth";
import type { EmpOverview } from "@/types/emp";
import type { ClientOverview } from "@/types/client";
import type { MemberOverview } from "@/types/member";
import type { ManagerOverview } from "@/types/manager";
import PortalGuard from "@/components/portal/PortalGuard";
import PortalShell from "@/components/portal/PortalShell";

type PortalData = EmpOverview | ClientOverview | MemberOverview | ManagerOverview;

function dateLabel(value?: string | null) {
  if (!value) return "No date set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function metric(label: string, value: string | number, icon: React.ReactNode) {
  return <div className="portal-card"><div className="flex items-center justify-between gap-4"><p className="portal-card-title">{label}</p><span className="text-[var(--portal-blue)]">{icon}</span></div><p className="portal-card-value">{value}</p></div>;
}

export default function PortalDashboard({ role }: { role: PortalRole }) {
  const router = useRouter();
  const config = PORTAL_CONFIG[role];
  const [overview, setOverview] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    portalFetch<PortalData>(role, `/${role}/overview`)
      .then(setOverview)
      .catch((requestError: unknown) => {
        if (isExpiredTokenError(requestError)) {
          clearPortalToken(role);
          router.replace(`/${role}/login`);
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Unable to load your workspace.");
      })
      .finally(() => setLoading(false));
  }, [role, router]);

  const userName = useMemo(() => {
    if (!overview) return "there";
    return overview.user.name.split(" ")[0] || "there";
  }, [overview]);

  async function submitWrite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    setSending(true); setNotice(""); setError("");
    const path = role === "emp" ? "/emp/announcements" : role === "client" ? "/client/messages" : "/manager/tasks/assign";
    const body = role === "manager" ? { note: draft.trim() } : { body: draft.trim() };
    try {
      await portalFetch(role, path, { method: "POST", body: JSON.stringify(body) });
      setDraft("");
      setNotice(role === "manager" ? "Assignment request submitted." : "Your note was sent.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "That update could not be sent.");
    } finally {
      setSending(false);
    }
  }

  function content() {
    if (!overview) return null;
    if (role === "emp") {
      const data = overview as EmpOverview;
      return <>
        <div className="portal-card-grid">{metric("Assigned tasks", data.tasks.length, <ListChecks aria-hidden className="h-5 w-5" />)}{metric("Open tasks", data.openTasks, <Clock3 aria-hidden className="h-5 w-5" />)}{metric("Access", "Active", <CheckCircle2 aria-hidden className="h-5 w-5" />)}</div>
        <section className="portal-section" id="tasks"><div className="portal-section-head"><div><p className="portal-section-kicker">Assigned work</p><h2>Your tasks</h2></div><ListChecks aria-hidden className="h-6 w-6 text-[var(--portal-muted)]" /></div><div className="portal-list">{data.tasks.length ? data.tasks.map((task) => <article className="portal-list-item" key={task.id}><div className="portal-list-item__row"><div><h3>{task.title}</h3><p>{task.projectName || "Unassigned project"} · Due {dateLabel(task.dueDate)}</p></div><span className="portal-pill">{task.priority}</span></div><div className="mt-4"><span className="portal-pill portal-pill--green">{task.status.replaceAll("_", " ")}</span></div></article>) : <div className="portal-empty">No assignments have been added yet.</div>}</div></section>
        <section className="portal-section" id="announcements"><div className="portal-section-head"><div><p className="portal-section-kicker">Team line</p><h2>Announcements</h2></div><Megaphone aria-hidden className="h-6 w-6 text-[var(--portal-muted)]" /></div><div className="portal-list">{data.announcements.length ? data.announcements.map((item) => <article className="portal-list-item" key={item.id}><div className="portal-list-item__row"><h3>{item.authorName}</h3><span className="portal-card-title">{dateLabel(item.createdAt)}</span></div><p>{item.body}</p></article>) : <div className="portal-empty">No team announcements yet.</div>}</div><WriteBox role={role} draft={draft} setDraft={setDraft} sending={sending} notice={notice} submitWrite={submitWrite} label="Post a team note" /></section>
      </>;
    }
    if (role === "client") {
      const data = overview as ClientOverview;
      return <>
        <div className="portal-card-grid">{metric("Active projects", data.projects.length, <BriefcaseBusiness aria-hidden className="h-5 w-5" />)}{metric("Unread messages", data.unreadMessages, <Mail aria-hidden className="h-5 w-5" />)}{metric("Access", "Active", <CheckCircle2 aria-hidden className="h-5 w-5" />)}</div>
        <section className="portal-section" id="projects"><div className="portal-section-head"><div><p className="portal-section-kicker">Project signal</p><h2>Your projects</h2></div><BriefcaseBusiness aria-hidden className="h-6 w-6 text-[var(--portal-muted)]" /></div><div className="portal-list">{data.projects.length ? data.projects.map((project) => <article className="portal-list-item" key={project.id}><div className="portal-list-item__row"><div><h3>{project.name}</h3><p>{project.summary || "Your TMI team will add the next project update here."}</p></div><span className="portal-pill">{project.status}</span></div><div className="portal-progress" aria-label={`${project.progress}% complete`}><span style={{ width: `${Math.max(0, Math.min(project.progress, 100))}%` }} /></div><div className="mt-3 flex flex-wrap justify-between gap-3 text-xs text-[var(--portal-muted)]"><span>{project.progress}% complete</span><span>Next milestone: {project.nextMilestone || "To be confirmed"}</span></div></article>) : <div className="portal-empty">Your projects will appear here once an administrator assigns them.</div>}</div></section>
        <section className="portal-section" id="messages"><div className="portal-section-head"><div><p className="portal-section-kicker">TMI conversation</p><h2>Messages</h2></div><Mail aria-hidden className="h-6 w-6 text-[var(--portal-muted)]" /></div><div className="portal-list">{data.messages.length ? data.messages.map((message) => <article className="portal-list-item" key={message.id}><div className="portal-list-item__row"><h3>{message.authorName}</h3><span className="portal-card-title">{dateLabel(message.createdAt)}</span></div><p>{message.body}</p></article>) : <div className="portal-empty">No messages yet.</div>}</div><WriteBox role={role} draft={draft} setDraft={setDraft} sending={sending} notice={notice} submitWrite={submitWrite} label="Message the TMI team" /></section>
      </>;
    }
    if (role === "member") {
      const data = overview as MemberOverview;
      return <>
        <div className="portal-card-grid">{metric("Membership", data.membershipStatus, <CheckCircle2 aria-hidden className="h-5 w-5" />)}{metric("Benefits", data.benefits.length, <BriefcaseBusiness aria-hidden className="h-5 w-5" />)}{metric("Resources", data.resources.length, <FileCheck2 aria-hidden className="h-5 w-5" />)}</div>
        <section className="portal-section" id="benefits"><div className="portal-section-head"><div><p className="portal-section-kicker">Member value</p><h2>Benefits & resources</h2></div><BriefcaseBusiness aria-hidden className="h-6 w-6 text-[var(--portal-muted)]" /></div><div className="portal-list">{[...data.benefits.map((benefit) => ({ ...benefit, kind: "Benefit" })), ...data.resources.map((resource) => ({ ...resource, kind: "Resource", status: "available" }))].map((item) => <article className="portal-list-item" key={item.id}><div className="portal-list-item__row"><div><h3>{item.title}</h3><p>{item.description}</p></div><span className="portal-pill">{item.kind}</span></div></article>)}</div></section>
        <section className="portal-section" id="updates"><div className="portal-section-head"><div><p className="portal-section-kicker">Member signal</p><h2>Updates</h2></div><Megaphone aria-hidden className="h-6 w-6 text-[var(--portal-muted)]" /></div><div className="portal-list">{data.updates.length ? data.updates.map((update) => <article className="portal-list-item" key={update.id}><div className="portal-list-item__row"><h3>{update.title}</h3><span className="portal-card-title">{dateLabel(update.createdAt)}</span></div><p>{update.body}</p></article>) : <div className="portal-empty">No member updates yet.</div>}</div></section>
      </>;
    }
    const data = overview as ManagerOverview;
    return <>
      <div className="portal-card-grid">{metric("Team members", data.team.length, <Users2 aria-hidden className="h-5 w-5" />)}{metric("Open tasks", data.tasks.length, <ListChecks aria-hidden className="h-5 w-5" />)}{metric("Approvals", data.approvals.length, <FileCheck2 aria-hidden className="h-5 w-5" />)}</div>
      <section className="portal-section" id="team"><div className="portal-section-head"><div><p className="portal-section-kicker">Team overview</p><h2>Capacity & work</h2></div><Users2 aria-hidden className="h-6 w-6 text-[var(--portal-muted)]" /></div><div className="portal-list">{data.team.length ? data.team.map((member) => <article className="portal-list-item" key={member.id}><div className="portal-list-item__row"><div><h3>{member.name}</h3><p>{member.role || "Team member"} · {member.status}</p></div><span className="portal-pill">{member.workload}% load</span></div><div className="portal-progress" aria-label={`${member.workload}% workload`}><span style={{ width: `${Math.max(0, Math.min(member.workload, 100))}%` }} /></div></article>) : <div className="portal-empty">Your team roster will appear here.</div>}</div></section>
      <section className="portal-section" id="approvals"><div className="portal-section-head"><div><p className="portal-section-kicker">Decision queue</p><h2>Approvals</h2></div><FileCheck2 aria-hidden className="h-6 w-6 text-[var(--portal-muted)]" /></div><div className="portal-list">{data.approvals.length ? data.approvals.map((approval) => <article className="portal-list-item" key={approval.id}><div className="portal-list-item__row"><div><h3>{approval.title}</h3><p>{approval.kind} requested by {approval.requestedBy}</p></div><span className="portal-card-title">{dateLabel(approval.createdAt)}</span></div></article>) : <div className="portal-empty">No approvals are waiting for review.</div>}</div><WriteBox role={role} draft={draft} setDraft={setDraft} sending={sending} notice={notice} submitWrite={submitWrite} label="Start an assignment request" /></section>
    </>;
  }

  return <PortalGuard role={role}><PortalShell role={role}><main><section className="portal-hero"><div className="portal-hero-inner"><p className="portal-label">{config.eyebrow}</p><h1 className="portal-hero-title">{config.title.split(",")[0]}<br /><span>{config.title.split(",")[1]?.trim() || "clearly in view."}</span></h1><p className="portal-hero-copy">Good to see you, {userName}. {config.description}</p></div></section><div className="portal-main">{loading ? <div className="portal-card">Loading your workspace…</div> : error && !overview ? <div className="portal-alert" role="alert">{error}</div> : content()}<p className="portal-footer-note">Private workspace · Account access is administered centrally · Sign out when you are finished.</p></div></main></PortalShell></PortalGuard>;
}

function WriteBox({ role, draft, setDraft, sending, notice, submitWrite, label }: { role: PortalRole; draft: string; setDraft: (value: string) => void; sending: boolean; notice: string; submitWrite: (event: FormEvent<HTMLFormElement>) => void; label: string }) {
  if (role === "member") return null;
  return <form className="portal-form-inline mt-6" onSubmit={submitWrite}><label className="portal-field-label" htmlFor={`${role}-write`}>{label}</label><textarea className="portal-textarea" id={`${role}-write`} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a concise update…" required /><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><button className="portal-button" disabled={sending} type="submit">{sending ? "Sending…" : "Submit update"}<Mail aria-hidden className="h-4 w-4" /></button>{notice ? <span className="text-xs text-[var(--portal-green)]" role="status">{notice}</span> : null}</div></form>;
}
