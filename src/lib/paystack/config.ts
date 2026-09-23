import { MONTHLY_PRICE } from "@/lib/utils/currency";

/** Hostinger/hPanel often wraps values in quotes or trailing spaces. */
function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v || undefined;
}

export function getPaystackSecretKey(): string | undefined {
  return cleanEnv(process.env.PAYSTACK_SECRET_KEY);
}

export function getPaystackPlanCode(): string | undefined {
  return cleanEnv(process.env.PAYSTACK_PLAN_CODE);
}

/** Hosted Paystack payment page (shop link). Preferred over API plan checkout. */
export function getPaystackPaymentPageUrl(): string {
  return (
    cleanEnv(process.env.NEXT_PUBLIC_PAYSTACK_PAYMENT_PAGE_URL) ??
    cleanEnv(process.env.PAYSTACK_PAYMENT_PAGE_URL) ??
    "https://paystack.shop/pay/znz8s4i5yd"
  );
}

/** Paystack signs webhooks with the secret key (not a separate whsec). */
export function getPaystackWebhookSecret(): string | undefined {
  return cleanEnv(process.env.PAYSTACK_WEBHOOK_SECRET) ?? getPaystackSecretKey();
}

export function getSiteUrl(): string {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export function isPaystackConfigured(): boolean {
  // Payment-page checkout works with the shop URL alone; webhooks still need the secret key.
  return Boolean(getPaystackPaymentPageUrl());
}

export function getPaystackDiagnostics() {
  const key = getPaystackSecretKey();
  const plan = getPaystackPlanCode();
  return {
    configured: isPaystackConfigured(),
    keyMode: key?.startsWith("sk_live_")
      ? "live"
      : key?.startsWith("sk_test_")
        ? "test"
        : key
          ? "unknown"
          : "missing",
    keyPrefix: key ? `${key.slice(0, 8)}…` : null,
    planCode: plan ?? null,
    paymentPage: getPaystackPaymentPageUrl(),
    siteUrl: getSiteUrl(),
  };
}

/** Paystack amounts for ZAR are in cents (e.g. R100 → 10000). */
export function monthlyAmountInCents(): number {
  return MONTHLY_PRICE * 100;
}

/** Build checkout URL with the member email prefilled when possible. */
export function buildPaymentPageCheckoutUrl(email?: string): string {
  const base = getPaystackPaymentPageUrl();
  if (!email?.trim()) return base;
  try {
    const url = new URL(base);
    url.searchParams.set("email", email.trim().toLowerCase());
    return url.toString();
  } catch {
    return base;
  }
}
