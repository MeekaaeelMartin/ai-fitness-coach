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
  const applyServerBilling = useAuthStore((state) => state.applyServerBilling);

  useEffect(() => {
    if (!hydrated || !user) return;

    let cancelled = false;

    async function sync() {
      // Registry sync returns server-owned billing (incl. trialEndsAt)
      const billingFromSync = await syncUserToRegistry(user!);
      if (cancelled) return;
      if (billingFromSync) {
        applyServerBilling(billingFromSync);
      }
      await syncBillingFromServer();
    }

    sync();

    const interval = setInterval(() => {
      sync();
    }, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [hydrated, user, syncBillingFromServer, applyServerBilling]);

  return null;
}
