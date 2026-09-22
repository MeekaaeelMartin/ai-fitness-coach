/** Shared auth DTO types safe for client imports (no Node fs). */

import type { AssessmentData } from "@/lib/types/assessment";
import type { GeneratedPlan } from "@/lib/types/plan";
import type { Subscription, UserProgress } from "@/lib/types/auth";

export interface AccountSnapshot {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  assessment: AssessmentData | null;
  generatedPlan: GeneratedPlan | null;
  progress: UserProgress;
  subscription: Subscription;
  points: number;
  exerciseSelections: Record<string, string>;
}
