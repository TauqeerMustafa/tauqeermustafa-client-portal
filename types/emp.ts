export interface EmpUser {
  id: string;
  name: string;
  email: string;
  department?: string | null;
  teamName?: string | null;
}

export interface EmpTask {
  id: string;
  title: string;
  projectName?: string | null;
  priority: "low" | "medium" | "high" | "urgent" | string;
  status: "todo" | "in_progress" | "review" | "blocked" | "done" | string;
  dueDate?: string | null;
}

export interface EmpAnnouncement {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface EmpOverview {
  user: EmpUser;
  tasks: EmpTask[];
  announcements: EmpAnnouncement[];
  openTasks: number;
}
