import type { Subscription } from "@/lib/types/auth";
import type { GeneratedPlan } from "@/lib/types/plan";
import { MONTHLY_PRICE, TRIAL_DAYS, formatZARPerMonth } from "./currency";

export function getSubscriptionAccess(subscription: Subscription): {
  hasFullAccess: boolean;
  hasFullPlan: boolean;
  status: Subscription["status"];
  daysRemaining: number;
  message: string;
  accessibleWeeks: number;
  totalWeeks: number;
} {
  const now = new Date();
  const totalWeeks = 4;

  if (subscription.status === "active" && subscription.currentPeriodEnd) {
    const periodEnd = new Date(subscription.currentPeriodEnd);
    if (periodEnd > now) {
      const days = Math.ceil(
        (periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        hasFullAccess: true,
        hasFullPlan: true,
        status: "active",
        daysRemaining: days,
        accessibleWeeks: totalWeeks,
        totalWeeks,
        message: `Pro member · ${days} day${days === 1 ? "" : "s"} remaining`,
      };
    }
  }

  if (subscription.status === "trial") {
    const trialEnd = new Date(subscription.trialEndsAt);
    if (trialEnd > now) {
      const days = Math.ceil(
        (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        hasFullAccess: true,
        hasFullPlan: false,
        status: "trial",
        daysRemaining: days,
        accessibleWeeks: 1,
        totalWeeks,
        message: `${days} day${days === 1 ? "" : "s"} of free trial left · Week 1 plan included`,
      };
    }
  }

  return {
    hasFullAccess: false,
    hasFullPlan: false,
    status: "expired",
    daysRemaining: 0,
    accessibleWeeks: 0,
    totalWeeks,
    message: `Subscribe for ${formatZARPerMonth(MONTHLY_PRICE)} to unlock your full plan`,
  };
}

export function activateSubscription(subscription: Subscription): Subscription {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  return {
    ...subscription,
    status: "active",
    subscribedAt: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
  };
}

export function filterPlanByAccess(plan: GeneratedPlan, accessibleWeeks: number): GeneratedPlan {
  if (accessibleWeeks >= (plan.weeks?.length ?? 1)) return plan;

  const weeks = plan.weeks ?? [];
  const visibleWeeks = weeks.slice(0, accessibleWeeks);

  if (visibleWeeks.length === 0) {
    return {
      ...plan,
      fitnessPlan: { ...plan.fitnessPlan, dailyWorkouts: [], progressiveOverload: [] },
      nutritionPlan: { ...plan.nutritionPlan, meals: [] },
      progressTracking: {
        ...plan.progressTracking,
        weeklyMilestones: plan.progressTracking.weeklyMilestones.slice(0, accessibleWeeks),
        monthlyTargets: [],
      },
    };
  }

  return {
    ...plan,
    fitnessPlan: {
      ...plan.fitnessPlan,
      dailyWorkouts: visibleWeeks.flatMap((w) => w.dailyWorkouts),
      progressiveOverload: plan.fitnessPlan.progressiveOverload.slice(0, accessibleWeeks * 2),
    },
    nutritionPlan: {
      ...plan.nutritionPlan,
      meals: visibleWeeks[visibleWeeks.length - 1]?.meals ?? plan.nutritionPlan.meals,
    },
    progressTracking: {
      ...plan.progressTracking,
      weeklyMilestones: plan.progressTracking.weeklyMilestones.slice(0, accessibleWeeks),
      monthlyTargets: accessibleWeeks >= 4 ? plan.progressTracking.monthlyTargets : [],
    },
  };
}

export { MONTHLY_PRICE, TRIAL_DAYS };
