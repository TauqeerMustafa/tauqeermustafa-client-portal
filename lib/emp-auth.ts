import { portalApiUrl, portalFetch, clearPortalToken, getPortalToken, setPortalToken } from "@/lib/portal-auth";

import type { EmpOverview } from "@/types/emp";

export const EMP_ROLE = "emp" as const;
export const getEmpToken = () => getPortalToken(EMP_ROLE);
export const setEmpToken = (token: string) => setPortalToken(EMP_ROLE, token);
export const clearEmpToken = () => clearPortalToken(EMP_ROLE);
export const empApiUrl = (path: string) => portalApiUrl(EMP_ROLE, path);
export const empFetch = <T>(path: string, init?: RequestInit) => portalFetch<T>(EMP_ROLE, path, init);
export type EmpApiOverview = EmpOverview;
