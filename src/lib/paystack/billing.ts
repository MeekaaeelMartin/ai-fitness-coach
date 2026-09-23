import { TRIAL_DAYS } from "@/lib/utils/currency";
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

function addTrialDays(fromIso: string, days: number = TRIAL_DAYS): string {
  const date = new Date(fromIso);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function hasPaidProof(user: Pick<RegistryUser, "paystackCustomerCode" | "paystackSubscriptionCode">): boolean {
  return Boolean(user.paystackCustomerCode || user.paystackSubscriptionCode);
}

export function registryUserToBilling(user: RegistryUser): ServerBilling {
  const now = new Date();
  let status = user.subscriptionStatus;

  // Recompute trial expiry from server-owned trialEndsAt
  if (status === "trial") {
    const trialEnd = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
    if (!trialEnd || trialEnd <= now) status = "expired";
  }

  if (status === "active") {
    const periodEnd = user.currentPeriodEnd ? new Date(user.currentPeriodEnd) : null;
    if (!periodEnd || periodEnd <= now || !user.subscribedAt || !hasPaidProof(user)) {
      status = "expired";
    }
  }

  return {
    subscriptionStatus: status,
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
  if (!params.subscribedAt) return null;
  // Require Paystack customer proof — no anonymous "active"
  if (!params.paystackCustomerCode && !params.paystackSubscriptionCode) {
    return null;
  }

  const existing = await findRegistryUser(params.userId, params.email);
  const createdAt = existing?.createdAt ?? new Date().toISOString();
  const base: RegistryUser =
    existing ??
    ({
      id: params.userId,
      email: (params.email ?? "").trim().toLowerCase(),
      name: params.name ?? params.email ?? "Member",
      createdAt,
      subscriptionStatus: "trial",
      trialEndsAt: addTrialDays(createdAt),
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
  const email = emailFromPaystackPayload(data);
  if (!email) return;

  const metadataUserId = userIdFromPaystackPayload(data);
  const registryUser = await findRegistryUser(metadataUserId, email);
  if (!registryUser) return;

  try {
    const payment = assertSuccessfulPayment(data, {
      userId: registryUser.id,
      email: registryUser.email,
    });

    await activateUserBilling({
      userId: payment.userId,
      email: registryUser.email,
      paystackCustomerCode: payment.customerCode,
      subscribedAt: payment.paidAt,
      currentPeriodEnd: addOneMonth(payment.paidAt),
    });
  } catch (error) {
    if (error instanceof PaymentValidationError) return;
    throw error;
  }
}

/** Attach subscription code only — never grant access here. */
async function handleSubscriptionCreate(data: Record<string, unknown>): Promise<void> {
  const customer = asRecord(data.customer);
  const email = readString(customer?.email)?.toLowerCase();
  const metadata = asRecord(data.metadata) ?? asRecord(customer?.metadata);
  const userId = readString(metadata?.userId);
  const user = await findRegistryUser(userId, email);
  if (!user) return;

  if (user.subscriptionStatus !== "active" || !user.subscribedAt || !hasPaidProof(user)) {
    return;
  }

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

/**
 * Client sync must never grant paid access or extend trials.
 * trialEndsAt is server-owned (set once on first sync).
 */
export function preserveServerBilling(
  incoming: RegistryUser,
  existing?: RegistryUser
): RegistryUser {
  const createdAt = existing?.createdAt ?? incoming.createdAt ?? new Date().toISOString();

  const preserved: RegistryUser = {
    ...incoming,
    createdAt,
    // Credentials are server-owned — never take a password hash from client sync
    passwordHash: existing?.passwordHash,
    subscriptionStatus: "trial",
    subscribedAt: undefined,
    currentPeriodEnd: undefined,
    paystackCustomerCode: undefined,
    paystackSubscriptionCode: undefined,
    // Never trust client trial end — server sets it
    trialEndsAt: existing?.trialEndsAt ?? addTrialDays(createdAt),
  };

  // Expire trial if past server trialEndsAt
  if (preserved.trialEndsAt && new Date(preserved.trialEndsAt) <= new Date()) {
    preserved.subscriptionStatus = "expired";
  }

  if (!existing) {
    return preserved;
  }

  const existingIsLegitActive =
    existing.subscriptionStatus === "active" &&
    Boolean(existing.subscribedAt) &&
    hasPaidProof(existing);

  if (existingIsLegitActive) {
    const periodEnd = existing.currentPeriodEnd ? new Date(existing.currentPeriodEnd) : null;
    if (periodEnd && periodEnd > new Date()) {
      preserved.subscriptionStatus = "active";
      preserved.subscribedAt = existing.subscribedAt;
      preserved.currentPeriodEnd = existing.currentPeriodEnd;
      preserved.paystackCustomerCode = existing.paystackCustomerCode;
      preserved.paystackSubscriptionCode = existing.paystackSubscriptionCode;
      return preserved;
    }
    preserved.subscriptionStatus = "expired";
    preserved.subscribedAt = existing.subscribedAt;
    preserved.currentPeriodEnd = existing.currentPeriodEnd;
    preserved.paystackCustomerCode = existing.paystackCustomerCode;
    preserved.paystackSubscriptionCode = existing.paystackSubscriptionCode;
    return preserved;
  }

  if (existing.subscriptionStatus === "expired") {
    preserved.subscriptionStatus = "expired";
  }

  if (existing.subscribedAt) preserved.subscribedAt = existing.subscribedAt;
  if (existing.currentPeriodEnd) preserved.currentPeriodEnd = existing.currentPeriodEnd;
  if (existing.paystackCustomerCode) {
    preserved.paystackCustomerCode = existing.paystackCustomerCode;
  }
  if (existing.paystackSubscriptionCode) {
    preserved.paystackSubscriptionCode = existing.paystackSubscriptionCode;
  }

  return preserved;
}

export async function ensureRegistryUser(entry: RegistryUser): Promise<RegistryUser> {
  const existing = await findRegistryUser(entry.id, entry.email);
  const merged = preserveServerBilling(entry, existing ?? undefined);
  await upsertRegistryUser(merged);
  return merged;
}
