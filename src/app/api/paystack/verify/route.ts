import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack/api";
import { activateUserBilling } from "@/lib/paystack/billing";
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
      reference?: string;
      userId?: string;
      email?: string;
      name?: string;
    };

    const reference = body.reference?.trim();
    const userId = body.userId?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!reference || !userId || !email) {
      return NextResponse.json(
        { error: "reference, userId, and email are required" },
        { status: 400 }
      );
    }

    const result = await verifyTransaction(reference);
    const data = result.data;

    if (!result.status || data?.status !== "success") {
      return NextResponse.json(
        { error: result.message ?? "Payment not successful" },
        { status: 400 }
      );
    }

    const metadata = data.metadata ?? {};
    if (metadata.userId && metadata.userId !== userId) {
      return NextResponse.json({ error: "Payment does not match this account" }, { status: 403 });
    }

    const updated = await activateUserBilling({
      userId,
      email,
      name: body.name?.trim(),
      paystackCustomerCode: data.customer?.customer_code,
      subscribedAt: data.paid_at ?? new Date().toISOString(),
    });

    if (!updated) {
      return NextResponse.json({ error: "Could not update subscription" }, { status: 500 });
    }

    return NextResponse.json({
      billing: {
        subscriptionStatus: updated.subscriptionStatus,
        subscribedAt: updated.subscribedAt,
        currentPeriodEnd: updated.currentPeriodEnd,
        trialEndsAt: updated.trialEndsAt,
        paystackCustomerCode: updated.paystackCustomerCode,
        paystackSubscriptionCode: updated.paystackSubscriptionCode,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
