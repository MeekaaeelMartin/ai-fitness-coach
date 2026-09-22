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

/** Paystack signs webhooks with the secret key (not a separate whsec). */
export function getPaystackWebhookSecret(): string | undefined {
  return cleanEnv(process.env.PAYSTACK_WEBHOOK_SECRET) ?? getPaystackSecretKey();
}

export function getSiteUrl(): string {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export function isPaystackConfigured(): boolean {
  return Boolean(getPaystackSecretKey() && getPaystackPlanCode());
}

export function getPaystackDiagnostics() {
  const key = getPaystackSecretKey();
  const plan = getPaystackPlanCode();
  return {
    configured: Boolean(key && plan),
    keyMode: key?.startsWith("sk_live_")
      ? "live"
      : key?.startsWith("sk_test_")
        ? "test"
        : key
          ? "unknown"
          : "missing",
    keyPrefix: key ? `${key.slice(0, 8)}…` : null,
    planCode: plan ?? null,
    siteUrl: getSiteUrl(),
  };
}

/** Paystack amounts for ZAR are in cents (e.g. R100 → 10000). */
export function monthlyAmountInCents(): number {
  return MONTHLY_PRICE * 100;
}
