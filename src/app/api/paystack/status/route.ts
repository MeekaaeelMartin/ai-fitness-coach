import { NextResponse } from "next/server";
import { findRegistryUser, updateUserBilling } from "@/lib/registry/server-store";
import { registryUserToBilling } from "@/lib/paystack/billing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!userId || !email) {
    return NextResponse.json({ error: "userId and email are required" }, { status: 400 });
  }

  let user = await findRegistryUser(userId, email);
  if (!user || user.email !== email) {
    return NextResponse.json({ billing: null });
  }

  // Demote illegitimate "active" without Paystack payment proof
  const hasPaidProof = Boolean(user.paystackCustomerCode || user.paystackSubscriptionCode);
  if (user.subscriptionStatus === "active" && (!user.subscribedAt || !hasPaidProof)) {
    const demoted = await updateUserBilling(user.id, {
      subscriptionStatus: "expired",
      currentPeriodEnd: new Date().toISOString(),
    });
    user = demoted ?? user;
  }

  return NextResponse.json({ billing: registryUserToBilling(user) });
}
