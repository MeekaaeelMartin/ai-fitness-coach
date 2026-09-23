import { NextResponse } from "next/server";
import { buildPaymentPageCheckoutUrl, isPaystackConfigured } from "@/lib/paystack/config";

export const runtime = "nodejs";

/**
 * Starts checkout by sending the member to the hosted Paystack payment page.
 * Pro access is unlocked via webhook (and optional verify) matched to account email.
 */
export async function POST(request: Request) {
  if (!isPaystackConfigured()) {
    return NextResponse.json(
      { error: "Paystack is not configured on the server" },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as {
      userId?: string;
      email?: string;
      name?: string;
    };

    const userId = body.userId?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!userId || !email) {
      return NextResponse.json({ error: "userId and email are required" }, { status: 400 });
    }

    return NextResponse.json({
      authorizationUrl: buildPaymentPageCheckoutUrl(email),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
