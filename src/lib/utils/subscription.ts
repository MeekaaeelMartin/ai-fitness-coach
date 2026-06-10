import type { Subscription } from "@/lib/types/auth";
import { MONTHLY_PRICE, TRIAL_DAYS, formatZARPerMonth } from "./currency";

export function getSubscriptionAccess(subscription: Subscription): {
  hasFullAccess: boolean;
  status: Subscription["status"];
  daysRemaining: number;
  message: string;
} {
  const now = new Date();

  if (subscription.status === "active" && subscription.currentPeriodEnd) {
    const periodEnd = new Date(subscription.currentPeriodEnd);
    if (periodEnd > now) {
      const days = Math.ceil(
        (periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        hasFullAccess: true,
        status: "active",
        daysRemaining: days,
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
        status: "trial",
        daysRemaining: days,
        message: `${days} day${days === 1 ? "" : "s"} of free access left`,
      };
    }
  }

  return {
    hasFullAccess: false,
    status: "expired",
    daysRemaining: 0,
    message: `Subscribe for ${formatZARPerMonth(MONTHLY_PRICE)} to keep full access`,
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

export { MONTHLY_PRICE, TRIAL_DAYS };
