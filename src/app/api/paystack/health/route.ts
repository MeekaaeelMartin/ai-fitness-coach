import { NextResponse } from "next/server";
import {
  getPaystackPaymentPageUrl,
  getPaystackSecretKey,
  isPaystackConfigured,
} from "@/lib/paystack/config";

export const runtime = "nodejs";

/** Minimal health — exposes mode so you can confirm live vs test without leaking secrets. */
export async function GET() {
  const key = getPaystackSecretKey();
  const mode = key?.startsWith("sk_live_")
    ? "live"
    : key?.startsWith("sk_test_")
      ? "test"
      : "none";

  const registryPersistent = Boolean(process.env.REGISTRY_DATA_PATH?.trim());

  return NextResponse.json({
    ok: true,
    paystackConfigured: isPaystackConfigured(),
    mode,
    checkout: "payment_page",
    paymentPageConfigured: Boolean(getPaystackPaymentPageUrl()),
    secretConfigured: Boolean(key),
    registryPersistent,
    launchReady: isPaystackConfigured() && registryPersistent && mode === "live",
  });
}
