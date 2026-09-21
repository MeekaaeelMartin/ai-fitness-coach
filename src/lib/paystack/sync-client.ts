import type { Subscription } from "@/lib/types/auth";
import type { ServerBilling } from "@/lib/paystack/types";

/** Server billing always wins — never keep a client-side "active" over server state. */
export function applyBillingToSubscription(
  subscription: Subscription,
  billing: ServerBilling
): Subscription {
  return {
    ...subscription,
    status: billing.subscriptionStatus,
    subscribedAt: billing.subscribedAt,
    currentPeriodEnd: billing.currentPeriodEnd,
    trialEndsAt: billing.trialEndsAt ?? subscription.trialEndsAt,
    paystackCustomerCode: billing.paystackCustomerCode,
    paystackSubscriptionCode: billing.paystackSubscriptionCode,
  };
}

/** Clear any client-claimed paid access when server has no billing record. */
export function demoteUnverifiedSubscription(subscription: Subscription): Subscription {
  const now = new Date();
  const trialEnd = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  const trialStillValid = Boolean(trialEnd && trialEnd > now);

  return {
    ...subscription,
    status: trialStillValid ? "trial" : "expired",
    subscribedAt: undefined,
    currentPeriodEnd: undefined,
    paystackCustomerCode: undefined,
    paystackSubscriptionCode: undefined,
  };
}

export async function fetchServerBilling(
  userId: string,
  email: string
): Promise<ServerBilling | null> {
  const params = new URLSearchParams({ userId, email });
  const response = await fetch(`/api/paystack/status?${params.toString()}`);
  if (!response.ok) return null;

  const data = (await response.json()) as { billing?: ServerBilling | null };
  return data.billing ?? null;
}
