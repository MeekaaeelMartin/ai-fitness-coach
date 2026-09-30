import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack/api";
import { activateUserBilling } from "@/lib/paystack/billing";
import { getPaystackSecretKey, isPaystackConfigured } from "@/lib/paystack/config";
import {
  assertSuccessfulPayment,
  emailFromPaystackPayload,
  PaymentValidationError,
} from "@/lib/paystack/validate-payment";
import { findRegistryUser } from "@/lib/registry/server-store";
import { verifyAccountToken } from "@/lib/auth/account-token";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isPaystackConfigured() || !getPaystackSecretKey()) {
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
      accountToken?: string;
    };

    const reference = body.reference?.trim();
    const claimedEmail = body.email?.trim().toLowerCase();
    const accountToken = body.accountToken?.trim();

    if (!reference || !claimedEmail) {
      return NextResponse.json(
        { error: "reference and email are required" },
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

    const payload = result.data as unknown as Record<string, unknown>;
    const paymentEmail = emailFromPaystackPayload(payload);
    if (!paymentEmail) {
      return NextResponse.json({ error: "Payment is missing customer email" }, { status: 402 });
    }
    if (paymentEmail !== claimedEmail) {
      return NextResponse.json(
        { error: "Payment email does not match this account" },
        { status: 402 }
      );
    }

    // Ownership is always resolved from the paid email — never trust client userId.
    const registryUser = await findRegistryUser(undefined, paymentEmail);
    if (!registryUser) {
      return NextResponse.json(
        {
          error:
            "No account found for the payment email. Sign up with that email, then contact support if you already paid.",
        },
        { status: 404 }
      );
    }

    if (!verifyAccountToken(accountToken, registryUser.id, registryUser.email)) {
      return NextResponse.json(
        { error: "Please log in again to confirm this payment" },
        { status: 401 }
      );
    }

    const payment = assertSuccessfulPayment(payload, {
      userId: registryUser.id,
      email: registryUser.email,
    });

    const updated = await activateUserBilling({
      userId: registryUser.id,
      email: registryUser.email,
      name: body.name?.trim() || registryUser.name,
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
