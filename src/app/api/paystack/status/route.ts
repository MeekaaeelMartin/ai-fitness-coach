import { NextResponse } from "next/server";
import { findRegistryUser, updateUserBilling } from "@/lib/registry/server-store";
import { hasPaidProof, registryUserToBilling } from "@/lib/paystack/billing";

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
  if (user.subscriptionStatus === "active" && (!user.subscribedAt || !hasPaidProof(user))) {
    const demoted = await updateUserBilling(user.id, {
      subscriptionStatus: "expired",
      currentPeriodEnd: new Date().toISOString(),
    });
    user = demoted ?? { ...user, subscriptionStatus: "expired" };
  }

  // Expire lapsed trials on read
  if (user.subscriptionStatus === "trial" && user.trialEndsAt) {
    if (new Date(user.trialEndsAt) <= new Date()) {
      const demoted = await updateUserBilling(user.id, {
        subscriptionStatus: "expired",
      });
      user = demoted ?? { ...user, subscriptionStatus: "expired" };
    }
  }

  return NextResponse.json({ billing: registryUserToBilling(user) });
}
