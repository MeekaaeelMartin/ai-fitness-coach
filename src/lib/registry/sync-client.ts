import type { UserAccount } from "@/lib/types/auth";
import { userToRegistryEntry } from "@/lib/registry/types";
import type { ServerBilling } from "@/lib/paystack/types";
import type { AccountSnapshot } from "@/lib/auth/types";

export interface AuthApiResult {
  ok: boolean;
  user?: AccountSnapshot;
  billing?: ServerBilling | null;
  error?: string;
}

export async function syncUserToRegistry(
  user: UserAccount
): Promise<ServerBilling | null> {
  try {
    const entry = userToRegistryEntry(user);
    const response = await fetch("/api/registry/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { billing?: ServerBilling };
    // Best-effort cloud snapshot for cross-device login restore
    void fetch("/api/auth/snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    }).catch(() => null);
    return data.billing ?? null;
  } catch {
    return null;
  }
}

export async function signupOnServer(
  email: string,
  password: string,
  name: string,
  account?: Partial<UserAccount>
): Promise<AuthApiResult> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, account }),
    });
    const data = (await response.json()) as AuthApiResult & { error?: string };
    if (!response.ok) {
      return { ok: false, error: data.error ?? "Could not create account" };
    }
    return { ok: true, user: data.user, billing: data.billing };
  } catch {
    return { ok: false, error: "Could not reach the server. Check your connection." };
  }
}

export async function loginOnServer(
  email: string,
  password: string
): Promise<AuthApiResult> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await response.json()) as AuthApiResult & { error?: string };
    if (!response.ok) {
      return { ok: false, error: data.error ?? "Invalid email or password" };
    }
    return { ok: true, user: data.user, billing: data.billing };
  } catch {
    return { ok: false, error: "Could not reach the server. Check your connection." };
  }
}

export async function fetchAdminRegistry(adminEmail: string, adminKey: string) {
  const res = await fetch("/api/admin/users", {
    headers: {
      "x-admin-email": adminEmail,
      "x-admin-key": adminKey,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to load admin data" }));
    throw new Error(err.error ?? "Failed to load admin data");
  }
  return res.json();
}
