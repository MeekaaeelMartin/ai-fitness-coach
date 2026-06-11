"use client";

import { useEffect } from "react";
import { useAppHydrated } from "@/lib/hooks/use-app-hydrated";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { syncUserToRegistry } from "@/lib/registry/sync-client";

export function RegistrySync() {
  const hydrated = useAppHydrated();
  const user = useCurrentUser();

  useEffect(() => {
    if (!hydrated || !user) return;
    syncUserToRegistry(user);
    const interval = setInterval(() => syncUserToRegistry(user), 60_000);
    return () => clearInterval(interval);
  }, [hydrated, user]);

  return null;
}
