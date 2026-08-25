export interface ManagerUser {
  id: string;
  name: string;
  email: string;
  teamName?: string | null;
}

export interface ManagerTeamMember {
  id: string;
  name: string;
  role?: string | null;
  workload: number;
  status: "available" | "busy" | "away" | string;
}

export interface ManagerTask {
  id: string;
  title: string;
  assigneeName?: string | null;
  priority: "low" | "medium" | "high" | "urgent" | string;
  status: string;
  dueDate?: string | null;
}

export interface ManagerApproval {
  id: string;
  title: string;
  requestedBy: string;
  kind: string;
  createdAt: string;
}

export interface ManagerOverview {
  user: ManagerUser;
  team: ManagerTeamMember[];
  tasks: ManagerTask[];
  approvals: ManagerApproval[];
}
