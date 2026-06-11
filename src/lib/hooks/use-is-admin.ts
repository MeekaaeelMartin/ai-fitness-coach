"use client";

import { useAppHydrated } from "@/lib/hooks/use-app-hydrated";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { isAdminEmail } from "@/lib/constants/admin";

export function useIsAdmin(): boolean {
  const hydrated = useAppHydrated();
  const user = useCurrentUser();
  return hydrated && isAdminEmail(user?.email);
}
