export interface ClientUser {
  id: string;
  name: string;
  email: string;
  company?: string | null;
}

export interface ClientProject {
  id: string;
  name: string;
  status: string;
  summary?: string | null;
  progress: number;
  nextMilestone?: string | null;
  updatedAt: string;
}

export interface ClientMessage {
  id: string;
  projectId?: string | null;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface ClientOverview {
  user: ClientUser;
  projects: ClientProject[];
  messages: ClientMessage[];
  unreadMessages: number;
}
