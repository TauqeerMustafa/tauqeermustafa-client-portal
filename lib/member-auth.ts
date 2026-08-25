import { portalApiUrl, portalFetch, clearPortalToken, getPortalToken, setPortalToken } from "@/lib/portal-auth";

import type { MemberOverview } from "@/types/member";

export const MEMBER_ROLE = "member" as const;
export const getMemberToken = () => getPortalToken(MEMBER_ROLE);
export const setMemberToken = (token: string) => setPortalToken(MEMBER_ROLE, token);
export const clearMemberToken = () => clearPortalToken(MEMBER_ROLE);
export const memberApiUrl = (path: string) => portalApiUrl(MEMBER_ROLE, path);
export const memberFetch = <T>(path: string, init?: RequestInit) => portalFetch<T>(MEMBER_ROLE, path, init);
export type MemberApiOverview = MemberOverview;
