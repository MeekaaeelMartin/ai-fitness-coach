import type { Subscription } from "@/lib/types/auth";
import type { ServerBilling } from "@/lib/paystack/types";

export function applyBillingToSubscription(
  subscription: Subscription,
  billing: ServerBilling
): Subscription {
  return {
    ...subscription,
    status: billing.subscriptionStatus,
    subscribedAt: billing.subscribedAt ?? subscription.subscribedAt,
    currentPeriodEnd: billing.currentPeriodEnd ?? subscription.currentPeriodEnd,
    trialEndsAt: billing.trialEndsAt ?? subscription.trialEndsAt,
    paystackCustomerCode: billing.paystackCustomerCode ?? subscription.paystackCustomerCode,
    paystackSubscriptionCode:
      billing.paystackSubscriptionCode ?? subscription.paystackSubscriptionCode,
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
