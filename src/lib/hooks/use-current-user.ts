"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import type { UserAccount } from "@/lib/types/auth";
import { createTrialSubscription } from "@/lib/types/auth";

function normalizeUser(user: UserAccount): UserAccount {
  return {
    ...user,
    points: user.points ?? 0,
    exerciseSelections: user.exerciseSelections ?? {},
    subscription: user.subscription ?? createTrialSubscription(),
    progress: user.progress ?? { byDate: {} },
  };
}

export function useCurrentUser(): UserAccount | null {
  const user = useAuthStore((state) =>
    state.currentUserId ? (state.users[state.currentUserId] ?? null) : null
  );

  return useMemo(() => (user ? normalizeUser(user) : null), [user]);
}
