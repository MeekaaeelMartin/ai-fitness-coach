import type { UserAccount } from "@/lib/types/auth";
import { userToRegistryEntry } from "@/lib/registry/types";
import type { ServerBilling } from "@/lib/paystack/types";

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
    return data.billing ?? null;
  } catch {
    return null;
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
