"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import type { UserAccount } from "@/lib/types/auth";
import { normalizeUser } from "@/lib/utils/normalize-user";

export function useCurrentUser(): UserAccount | null {
  const user = useAuthStore((state) =>
    state.currentUserId ? (state.users[state.currentUserId] ?? null) : null
  );

  return useMemo(() => (user ? normalizeUser(user) : null), [user]);
}
