import { NextResponse } from "next/server";
import { isPaystackConfigured } from "@/lib/paystack/config";

export const runtime = "nodejs";

/** Minimal health — does not expose keys, plan codes, or URLs. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    paystackConfigured: isPaystackConfigured(),
  });
}
