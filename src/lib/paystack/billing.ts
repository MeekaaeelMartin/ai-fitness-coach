import type { RegistryUser } from "@/lib/registry/types";
import {
  findRegistryUser,
  updateUserBilling,
  upsertRegistryUser,
} from "@/lib/registry/server-store";
import type { ServerBilling } from "./types";
import {
  assertSuccessfulPayment,
  emailFromPaystackPayload,
  PaymentValidationError,
  userIdFromPaystackPayload,
} from "./validate-payment";

function addOneMonth(isoDate?: string): string {
  const date = isoDate ? new Date(isoDate) : new Date();
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  return next.toISOString();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function registryUserToBilling(user: RegistryUser): ServerBilling {
  return {
    subscriptionStatus: user.subscriptionStatus,
    subscribedAt: user.subscribedAt,
    currentPeriodEnd: user.currentPeriodEnd,
    trialEndsAt: user.trialEndsAt,
    paystackCustomerCode: user.paystackCustomerCode,
    paystackSubscriptionCode: user.paystackSubscriptionCode,
  };
}

export async function activateUserBilling(params: {
  userId: string;
  email?: string;
  name?: string;
  paystackCustomerCode?: string;
  paystackSubscriptionCode?: string;
  currentPeriodEnd?: string;
  subscribedAt?: string;
}): Promise<RegistryUser | null> {
  // Hard requirement: a paid activation must include proof of Paystack customer OR paid timestamp
  if (!params.subscribedAt) {
    return null;
  }

  const existing = await findRegistryUser(params.userId, params.email);
  const base: RegistryUser =
    existing ??
    ({
      id: params.userId,
      email: (params.email ?? "").trim().toLowerCase(),
      name: params.name ?? params.email ?? "Member",
      createdAt: new Date().toISOString(),
      subscriptionStatus: "trial",
      points: 0,
      hasPlan: false,
      assessmentComplete: false,
      workoutsLogged: 0,
      mealsLogged: 0,
      daysActive: 0,
      lastSeenAt: new Date().toISOString(),
      fitnessGoals: [],
    } satisfies RegistryUser);

  if (!existing) {
    await upsertRegistryUser(base);
  }

  return updateUserBilling(base.id, {
    subscriptionStatus: "active",
    subscribedAt: params.subscribedAt,
    currentPeriodEnd: params.currentPeriodEnd ?? addOneMonth(params.subscribedAt),
    paystackCustomerCode: params.paystackCustomerCode ?? base.paystackCustomerCode,
    paystackSubscriptionCode:
      params.paystackSubscriptionCode ?? base.paystackSubscriptionCode,
  });
}

export async function expireUserBilling(userId: string): Promise<RegistryUser | null> {
  return updateUserBilling(userId, {
    subscriptionStatus: "expired",
    currentPeriodEnd: new Date().toISOString(),
  });
}

export async function handlePaystackWebhookEvent(
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  switch (event) {
    case "charge.success":
      await handleChargeSuccess(data);
      break;
    case "subscription.create":
      await handleSubscriptionCreate(data);
      break;
    case "subscription.disable":
    case "subscription.not_renew":
      await handleSubscriptionEnded(data);
      break;
    case "invoice.payment_failed":
      await handlePaymentFailed(data);
      break;
    default:
      break;
  }
}

async function handleChargeSuccess(data: Record<string, unknown>): Promise<void> {
  const userId = userIdFromPaystackPayload(data);
  const email = emailFromPaystackPayload(data);
  if (!userId || !email) return;

  try {
    const payment = assertSuccessfulPayment(data, { userId, email });
    await activateUserBilling({
      userId: payment.userId,
      email,
      paystackCustomerCode: payment.customerCode,
      subscribedAt: payment.paidAt,
      currentPeriodEnd: addOneMonth(payment.paidAt),
    });
  } catch (error) {
    if (error instanceof PaymentValidationError) return;
    throw error;
  }
}

/**
 * Attach subscription code only — never grant access here.
 * Access is granted solely by a validated charge.success / verify.
 */
async function handleSubscriptionCreate(data: Record<string, unknown>): Promise<void> {
  const customer = asRecord(data.customer);
  const email = readString(customer?.email)?.toLowerCase();
  const metadata = asRecord(data.metadata) ?? asRecord(customer?.metadata);
  const userId = readString(metadata?.userId);
  const user = await findRegistryUser(userId, email);
  if (!user) return;

  // Only enrich an already-paid active subscription
  if (user.subscriptionStatus !== "active" || !user.subscribedAt) return;

  const subscriptionCode = readString(data.subscription_code);
  if (!subscriptionCode) return;

  await updateUserBilling(user.id, {
    paystackSubscriptionCode: subscriptionCode,
    paystackCustomerCode:
      readString(customer?.customer_code) ?? user.paystackCustomerCode,
    currentPeriodEnd:
      readString(data.next_payment_date) ?? user.currentPeriodEnd ?? addOneMonth(user.subscribedAt),
  });
}

async function handleSubscriptionEnded(data: Record<string, unknown>): Promise<void> {
  const customer = asRecord(data.customer);
  const email = readString(customer?.email)?.toLowerCase();
  const user = await findRegistryUser(undefined, email);
  if (!user) return;
  await expireUserBilling(user.id);
}

async function handlePaymentFailed(data: Record<string, unknown>): Promise<void> {
  const customer = asRecord(data.customer);
  const email = readString(customer?.email)?.toLowerCase();
  const user = await findRegistryUser(undefined, email);
  if (!user) return;

  const periodEnd = user.currentPeriodEnd ? new Date(user.currentPeriodEnd) : null;
  if (periodEnd && periodEnd > new Date()) return;

  await expireUserBilling(user.id);
}

function hasPaidProof(user: RegistryUser): boolean {
  return Boolean(user.paystackCustomerCode || user.paystackSubscriptionCode);
}

/**
 * Client sync must never grant paid access.
 * Billing fields are server-owned (Paystack verify/webhook only).
 * Active without Paystack proof is treated as illegitimate and demoted.
 */
export function preserveServerBilling(
  incoming: RegistryUser,
  existing?: RegistryUser
): RegistryUser {
  const preserved: RegistryUser = {
    ...incoming,
    // Strip any client-claimed paid status
    subscriptionStatus:
      incoming.subscriptionStatus === "active" ? "trial" : incoming.subscriptionStatus,
    subscribedAt: undefined,
    currentPeriodEnd: undefined,
    paystackCustomerCode: undefined,
    paystackSubscriptionCode: undefined,
  };

  if (!existing) {
    return preserved;
  }

  const existingIsLegitActive =
    existing.subscriptionStatus === "active" &&
    Boolean(existing.subscribedAt) &&
    hasPaidProof(existing);

  if (existingIsLegitActive) {
    preserved.subscriptionStatus = "active";
    preserved.subscribedAt = existing.subscribedAt;
    preserved.currentPeriodEnd = existing.currentPeriodEnd;
    preserved.paystackCustomerCode = existing.paystackCustomerCode;
    preserved.paystackSubscriptionCode = existing.paystackSubscriptionCode;
  } else if (existing.subscriptionStatus === "active" && !hasPaidProof(existing)) {
    // Close the loophole: demote fake "active" rows that were never paid
    preserved.subscriptionStatus =
      preserved.subscriptionStatus === "trial" ? "trial" : "expired";
  } else if (existing.subscriptionStatus) {
    preserved.subscriptionStatus = existing.subscriptionStatus;
    if (existing.subscribedAt) preserved.subscribedAt = existing.subscribedAt;
    if (existing.currentPeriodEnd) preserved.currentPeriodEnd = existing.currentPeriodEnd;
    if (existing.paystackCustomerCode) {
      preserved.paystackCustomerCode = existing.paystackCustomerCode;
    }
    if (existing.paystackSubscriptionCode) {
      preserved.paystackSubscriptionCode = existing.paystackSubscriptionCode;
    }
  }

  if (existing.trialEndsAt) preserved.trialEndsAt = existing.trialEndsAt;

  return preserved;
}

export async function ensureRegistryUser(entry: RegistryUser): Promise<RegistryUser> {
  const existing = await findRegistryUser(entry.id, entry.email);
  const merged = preserveServerBilling(entry, existing ?? undefined);
  await upsertRegistryUser(merged);
  return merged;
}
