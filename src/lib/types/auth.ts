import type { AssessmentData } from "./assessment";
import type { GeneratedPlan } from "./plan";
import { TRIAL_DAYS } from "@/lib/utils/currency";

export type SubscriptionStatus = "trial" | "active" | "expired";

export interface Subscription {
  status: SubscriptionStatus;
  trialStartedAt: string;
  trialEndsAt: string;
  subscribedAt?: string;
  currentPeriodEnd?: string;
  paystackCustomerCode?: string;
  paystackSubscriptionCode?: string;
}

export interface CustomMealLog {
  description: string;
  calories?: number;
}

export interface DayProgress {
  workouts: string[];
  meals: string[];
  /** Legacy string values are normalized on read. */
  customMeals: Record<string, CustomMealLog | string>;
  mealSubstitutions: Record<string, string>;
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
  points: number;
  exerciseSelections: Record<string, string>;
}

export function createDefaultProgress(): UserProgress {
  return { byDate: {} };
}

export function createEmptyDayProgress(): DayProgress {
  return { workouts: [], meals: [], customMeals: {}, mealSubstitutions: {} };
}

export function normalizeCustomMeal(
  value: CustomMealLog | string | undefined | null
): CustomMealLog | null {
  if (!value) return null;
  if (typeof value === "string") {
    const description = value.trim();
    return description ? { description } : null;
  }
  const description = value.description?.trim();
  if (!description) return null;
  const calories =
    typeof value.calories === "number" && Number.isFinite(value.calories) && value.calories >= 0
      ? Math.round(value.calories)
      : undefined;
  return { description, calories };
}

export function createTrialSubscription(): Subscription {
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);

  return {
    status: "trial",
    trialStartedAt: now.toISOString(),
    trialEndsAt: trialEnd.toISOString(),
  };
}
