"use client";

import { useEffect } from "react";
import { useAppHydrated } from "@/lib/hooks/use-app-hydrated";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useAuthStore } from "@/lib/store/auth-store";
import { syncUserToRegistry } from "@/lib/registry/sync-client";

export function RegistrySync() {
  const hydrated = useAppHydrated();
  const user = useCurrentUser();
  const syncBillingFromServer = useAuthStore((state) => state.syncBillingFromServer);

  useEffect(() => {
    if (!hydrated || !user) return;

    syncBillingFromServer();
    syncUserToRegistry(user);

    const interval = setInterval(() => {
      syncBillingFromServer();
      syncUserToRegistry(user);
    }, 60_000);

    return () => clearInterval(interval);
  }, [hydrated, user, syncBillingFromServer]);

  return null;
}
