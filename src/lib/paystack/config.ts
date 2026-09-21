import { MONTHLY_PRICE } from "@/lib/utils/currency";

export function getPaystackSecretKey(): string | undefined {
  return process.env.PAYSTACK_SECRET_KEY;
}

export function getPaystackPlanCode(): string | undefined {
  return process.env.PAYSTACK_PLAN_CODE;
}

/** Paystack signs webhooks with the secret key (not a separate whsec). */
export function getPaystackWebhookSecret(): string | undefined {
  return process.env.PAYSTACK_WEBHOOK_SECRET ?? process.env.PAYSTACK_SECRET_KEY;
}

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export function isPaystackConfigured(): boolean {
  return Boolean(getPaystackSecretKey() && getPaystackPlanCode());
}

/** Paystack amounts for ZAR are in cents (e.g. R500 → 50000). */
export function monthlyAmountInCents(): number {
  return MONTHLY_PRICE * 100;
}
