import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack/api";
import { activateUserBilling } from "@/lib/paystack/billing";
import { isPaystackConfigured } from "@/lib/paystack/config";
import {
  assertSuccessfulPayment,
  PaymentValidationError,
} from "@/lib/paystack/validate-payment";

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
    if (!result.status || !result.data) {
      return NextResponse.json(
        { error: result.message ?? "Could not verify payment" },
        { status: 400 }
      );
    }

    const payment = assertSuccessfulPayment(
      result.data as unknown as Record<string, unknown>,
      { userId, email }
    );

    const updated = await activateUserBilling({
      userId: payment.userId,
      email,
      name: body.name?.trim(),
      paystackCustomerCode: payment.customerCode,
      subscribedAt: payment.paidAt,
    });

    if (!updated || updated.subscriptionStatus !== "active") {
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
    if (error instanceof PaymentValidationError) {
      return NextResponse.json({ error: error.message }, { status: 402 });
    }
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
