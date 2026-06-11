import type { UserAccount } from "@/lib/types/auth";
import { userToRegistryEntry } from "@/lib/registry/types";

export async function syncUserToRegistry(user: UserAccount): Promise<void> {
  try {
    const entry = userToRegistryEntry(user);
    await fetch("/api/registry/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // Non-blocking background sync
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
