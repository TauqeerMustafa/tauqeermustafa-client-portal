export interface MemberUser {
  id: string;
  name: string;
  email: string;
  membershipLevel?: string | null;
}

export interface MemberBenefit {
  id: string;
  title: string;
  description: string;
  status: "available" | "claimed" | "restricted" | string;
}

export interface MemberResource {
  id: string;
  title: string;
  description?: string | null;
  url?: string | null;
}

export interface MemberUpdate {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface MemberOverview {
  user: MemberUser;
  membershipStatus: "active" | "pending" | "expired" | "suspended" | string;
  benefits: MemberBenefit[];
  resources: MemberResource[];
  updates: MemberUpdate[];
}
