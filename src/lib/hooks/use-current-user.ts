"use client";

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
  return useAuthStore((state) => {
    const user = state.currentUserId ? (state.users[state.currentUserId] ?? null) : null;
    return user ? normalizeUser(user) : null;
  });
}
