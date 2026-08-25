export type PortalRole = "emp" | "client" | "member" | "manager";

export type PortalConfig = {
  role: PortalRole;
  label: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  nav: Array<{ id: string; label: string }>;
};

export const PORTAL_CONFIG: Record<PortalRole, PortalConfig> = {
  emp: {
    role: "emp",
    label: "Employee portal",
    eyebrow: "Internal workspace",
    title: "Your work, clearly in view.",
    accent: "Assigned work",
    description: "Review assignments, priorities, due dates, and the latest team signal.",
    nav: [
      { id: "tasks", label: "Tasks" },
      { id: "announcements", label: "Announcements" },
    ],
  },
  client: {
    role: "client",
    label: "Client portal",
    eyebrow: "Private workspace",
    title: "Your project, clearly in view.",
    accent: "Project signal",
    description: "Track progress, milestones, and the conversations moving your work forward.",
    nav: [
      { id: "projects", label: "Projects" },
      { id: "messages", label: "Messages" },
    ],
  },
  member: {
    role: "member",
    label: "Member portal",
    eyebrow: "Member workspace",
    title: "Your membership, clearly in view.",
    accent: "Member benefits",
    description: "See your membership standing, available resources, and the latest updates.",
    nav: [
      { id: "benefits", label: "Benefits" },
      { id: "updates", label: "Updates" },
    ],
  },
  manager: {
    role: "manager",
    label: "Manager portal",
    eyebrow: "Leadership workspace",
    title: "Your team, clearly in view.",
    accent: "Team signal",
    description: "Monitor team capacity, assign work, and move approvals through the queue.",
    nav: [
      { id: "team", label: "Team overview" },
      { id: "approvals", label: "Approvals" },
    ],
  },
};

export function isPortalRole(value: string): value is PortalRole {
  return value in PORTAL_CONFIG;
}
