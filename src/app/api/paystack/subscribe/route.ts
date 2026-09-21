import { NextResponse } from "next/server";
import { initializeSubscriptionCheckout } from "@/lib/paystack/api";
import { isPaystackConfigured } from "@/lib/paystack/config";

export const runtime = "nodejs";

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

    const result = await initializeSubscriptionCheckout({
      userId,
      email,
      name: body.name?.trim(),
    });

    if (!result.status || !result.data?.authorization_url) {
      return NextResponse.json(
        { error: result.message ?? "Could not start checkout" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
