import type { PortalRole } from "@/lib/portal-config";

export type PortalApiError = Error & {
  code?: string;
  status?: number;
};

function tokenKey(role: PortalRole): string {
  return `tmi_${role}_token`;
}

export function getPortalToken(role: PortalRole): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(tokenKey(role));
}

export function setPortalToken(role: PortalRole, token: string): void {
  window.localStorage.setItem(tokenKey(role), token);
}

export function clearPortalToken(role: PortalRole): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(tokenKey(role));
}

export function portalApiUrl(role: PortalRole, path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${base.replace(/\/$/, "")}${path}`;
}

export async function portalFetch<T>(role: PortalRole, path: string, init: RequestInit = {}): Promise<T> {
  const token = getPortalToken(role);
  const response = await fetch(portalApiUrl(role, path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null) as { data?: T; detail?: string; message?: string; code?: string } | null;
  if (!response.ok) {
    const error = new Error(payload?.detail || payload?.message || "The portal request could not be completed.") as PortalApiError;
    error.code = payload?.code || payload?.detail;
    error.status = response.status;
    throw error;
  }
  return payload?.data ?? payload as T;
}

export function isPendingActivationError(error: unknown): boolean {
  const candidate = error as PortalApiError | undefined;
  return candidate?.code === "pending_activation" || candidate?.message === "pending_activation";
}

export function isExpiredTokenError(error: unknown): boolean {
  const candidate = error as PortalApiError | undefined;
  return candidate?.status === 401 || candidate?.status === 403;
}
