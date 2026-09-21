import { NextResponse } from "next/server";
import { getPaystackSecretKey, isPaystackConfigured } from "@/lib/paystack/config";

export const runtime = "nodejs";

/** Minimal health — exposes mode so you can confirm live vs test without leaking secrets. */
export async function GET() {
  const key = getPaystackSecretKey();
  const mode = key?.startsWith("sk_live_")
    ? "live"
    : key?.startsWith("sk_test_")
      ? "test"
      : "none";

  return NextResponse.json({
    ok: true,
    paystackConfigured: isPaystackConfigured(),
    mode,
  });
}
