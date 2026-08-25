import { portalApiUrl, portalFetch, clearPortalToken, getPortalToken, setPortalToken } from "@/lib/portal-auth";

import type { ClientOverview } from "@/types/client";

export const CLIENT_ROLE = "client" as const;
export const getClientToken = () => getPortalToken(CLIENT_ROLE);
export const setClientToken = (token: string) => setPortalToken(CLIENT_ROLE, token);
export const clearClientToken = () => clearPortalToken(CLIENT_ROLE);
export const clientApiUrl = (path: string) => portalApiUrl(CLIENT_ROLE, path);
export const clientFetch = <T>(path: string, init?: RequestInit) => portalFetch<T>(CLIENT_ROLE, path, init);
export type ClientApiOverview = ClientOverview;
