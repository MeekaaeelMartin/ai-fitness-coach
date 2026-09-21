import { NextResponse } from "next/server";
import type { RegistryUser } from "@/lib/registry/types";
import { upsertRegistryUser } from "@/lib/registry/server-store";

export const runtime = "nodejs";

/** Billing fields are never accepted from the browser. */
function stripClientBilling(entry: RegistryUser): RegistryUser {
  return {
    ...entry,
    subscriptionStatus:
      entry.subscriptionStatus === "active" ? "trial" : entry.subscriptionStatus,
    subscribedAt: undefined,
    currentPeriodEnd: undefined,
    paystackCustomerCode: undefined,
    paystackSubscriptionCode: undefined,
  };
}

export async function POST(request: Request) {
  try {
    const entry = (await request.json()) as RegistryUser;
    if (!entry?.id || !entry?.email) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    await upsertRegistryUser(
      stripClientBilling({
        ...entry,
        email: entry.email.trim().toLowerCase(),
        lastSeenAt: new Date().toISOString(),
      })
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
