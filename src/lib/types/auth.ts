import type { AssessmentData } from "./assessment";
import type { GeneratedPlan } from "./plan";

export type SubscriptionStatus = "trial" | "active" | "expired";

export interface Subscription {
  status: SubscriptionStatus;
  trialStartedAt: string;
  trialEndsAt: string;
  subscribedAt?: string;
  currentPeriodEnd?: string;
}

export interface DayProgress {
  workouts: string[];
  meals: string[];
}

export interface UserProgress {
  byDate: Record<string, DayProgress>;
}

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
  assessment: AssessmentData | null;
  generatedPlan: GeneratedPlan | null;
  progress: UserProgress;
  subscription: Subscription;
}

export function createDefaultProgress(): UserProgress {
  return { byDate: {} };
}

export function createTrialSubscription(): Subscription {
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + 7);

  return {
    status: "trial",
    trialStartedAt: now.toISOString(),
    trialEndsAt: trialEnd.toISOString(),
  };
}
