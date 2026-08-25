import { portalApiUrl, portalFetch, clearPortalToken, getPortalToken, setPortalToken } from "@/lib/portal-auth";

import type { ManagerOverview } from "@/types/manager";

export const MANAGER_ROLE = "manager" as const;
export const getManagerToken = () => getPortalToken(MANAGER_ROLE);
export const setManagerToken = (token: string) => setPortalToken(MANAGER_ROLE, token);
export const clearManagerToken = () => clearPortalToken(MANAGER_ROLE);
export const managerApiUrl = (path: string) => portalApiUrl(MANAGER_ROLE, path);
export const managerFetch = <T>(path: string, init?: RequestInit) => portalFetch<T>(MANAGER_ROLE, path, init);
export type ManagerApiOverview = ManagerOverview;
