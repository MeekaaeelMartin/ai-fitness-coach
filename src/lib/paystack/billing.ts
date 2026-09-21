import type { RegistryUser } from "@/lib/registry/types";
import {
  findRegistryUser,
  updateUserBilling,
  upsertRegistryUser,
} from "@/lib/registry/server-store";
import type { ServerBilling } from "./types";

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
    subscribedAt: params.subscribedAt ?? new Date().toISOString(),
    currentPeriodEnd: params.currentPeriodEnd ?? addOneMonth(),
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
  const metadata = asRecord(data.metadata);
  const userId = readString(metadata?.userId);
  const customer = asRecord(data.customer);
  const email = readString(customer?.email);
  const user = await findRegistryUser(userId, email);
  if (!user && !userId) return;

  await activateUserBilling({
    userId: userId ?? user!.id,
    email: email ?? user?.email,
    paystackCustomerCode: readString(customer?.customer_code),
    subscribedAt: readString(data.paid_at) ?? new Date().toISOString(),
    currentPeriodEnd: addOneMonth(readString(data.paid_at)),
  });
}

async function handleSubscriptionCreate(data: Record<string, unknown>): Promise<void> {
  const customer = asRecord(data.customer);
  const email = readString(customer?.email);
  const metadata = asRecord(customer?.metadata);
  const userId = readString(metadata?.userId);
  const user = await findRegistryUser(userId, email);
  if (!user && !userId) return;

  await activateUserBilling({
    userId: userId ?? user!.id,
    email: email ?? user?.email,
    paystackCustomerCode: readString(customer?.customer_code),
    paystackSubscriptionCode: readString(data.subscription_code),
    currentPeriodEnd:
      readString(data.next_payment_date) ??
      addOneMonth(readString(data.createdAt)),
    subscribedAt: readString(data.createdAt) ?? new Date().toISOString(),
  });
}

async function handleSubscriptionEnded(data: Record<string, unknown>): Promise<void> {
  const customer = asRecord(data.customer);
  const email = readString(customer?.email);
  const user = await findRegistryUser(undefined, email);
  if (!user) return;
  await expireUserBilling(user.id);
}

async function handlePaymentFailed(data: Record<string, unknown>): Promise<void> {
  const customer = asRecord(data.customer);
  const email = readString(customer?.email);
  const user = await findRegistryUser(undefined, email);
  if (!user) return;

  const periodEnd = user.currentPeriodEnd ? new Date(user.currentPeriodEnd) : null;
  if (periodEnd && periodEnd > new Date()) return;

  await expireUserBilling(user.id);
}

export function preserveServerBilling(
  incoming: RegistryUser,
  existing?: RegistryUser
): RegistryUser {
  const serverManaged = Boolean(
    existing?.paystackCustomerCode ||
      existing?.paystackSubscriptionCode ||
      (existing?.subscriptionStatus === "active" && existing?.subscribedAt)
  );

  if (!existing || !serverManaged) {
    return incoming;
  }

  const preserved: RegistryUser = { ...incoming };
  if (existing.subscriptionStatus) {
    preserved.subscriptionStatus = existing.subscriptionStatus;
  }
  if (existing.subscribedAt) preserved.subscribedAt = existing.subscribedAt;
  if (existing.currentPeriodEnd) preserved.currentPeriodEnd = existing.currentPeriodEnd;
  if (existing.trialEndsAt) preserved.trialEndsAt = existing.trialEndsAt;
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
