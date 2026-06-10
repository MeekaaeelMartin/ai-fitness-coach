import type { UserAccount } from "@/lib/types/auth";
import { createDefaultProgress, createTrialSubscription } from "@/lib/types/auth";
import { normalizePlan } from "@/lib/utils/normalize-plan";

export function normalizeUser(user: UserAccount): UserAccount {
  return {
    ...user,
    points: user.points ?? 0,
    exerciseSelections: user.exerciseSelections ?? {},
    subscription: user.subscription ?? createTrialSubscription(),
    progress: user.progress?.byDate ? user.progress : createDefaultProgress(),
    generatedPlan: user.generatedPlan ? normalizePlan(user.generatedPlan) : null,
  };
}
