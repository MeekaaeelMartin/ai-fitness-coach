import { NextResponse } from "next/server";
import type { RegistryUser } from "@/lib/registry/types";
import { findRegistryUser, upsertRegistryUser } from "@/lib/registry/server-store";
import { registryUserToBilling } from "@/lib/paystack/billing";

export const runtime = "nodejs";

/** Only non-billing engagement fields may come from the browser. */
function clientSafeFields(entry: RegistryUser): RegistryUser {
  return {
    id: entry.id,
    email: entry.email.trim().toLowerCase(),
    name: entry.name || "Member",
    createdAt: entry.createdAt || new Date().toISOString(),
    subscriptionStatus: "trial",
    trialEndsAt: undefined,
    subscribedAt: undefined,
    currentPeriodEnd: undefined,
    paystackCustomerCode: undefined,
    paystackSubscriptionCode: undefined,
    points: Math.max(0, Math.min(Number(entry.points) || 0, 1_000_000)),
    hasPlan: Boolean(entry.hasPlan),
    assessmentComplete: Boolean(entry.assessmentComplete),
    workoutsLogged: Math.max(0, Number(entry.workoutsLogged) || 0),
    mealsLogged: Math.max(0, Number(entry.mealsLogged) || 0),
    daysActive: Math.max(0, Number(entry.daysActive) || 0),
    lastSeenAt: new Date().toISOString(),
    fitnessGoals: Array.isArray(entry.fitnessGoals)
      ? entry.fitnessGoals.slice(0, 20).map(String)
      : [],
  };
}

export async function POST(request: Request) {
  try {
    const entry = (await request.json()) as RegistryUser;
    if (!entry?.id || !entry?.email) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    const safe = clientSafeFields(entry);
    await upsertRegistryUser(safe);
    const saved = await findRegistryUser(safe.id, safe.email);

    return NextResponse.json({
      ok: true,
      billing: saved ? registryUserToBilling(saved) : null,
    });
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
