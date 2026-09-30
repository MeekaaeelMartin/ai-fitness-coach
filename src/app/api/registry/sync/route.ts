import { NextResponse } from "next/server";
import type { RegistryUser } from "@/lib/registry/types";
import {
  findRegistryUser,
  loadRegistry,
  saveRegistry,
  upsertRegistryUser,
} from "@/lib/registry/server-store";
import { registryUserToBilling, preserveServerBilling } from "@/lib/paystack/billing";
import { verifyAccountToken } from "@/lib/auth/account-token";

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
    const body = (await request.json()) as RegistryUser & { accountToken?: string };
    if (!body?.id || !body?.email) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    const safe = clientSafeFields(body);
    const byEmail = await findRegistryUser(undefined, safe.email);

    // Never create a second registry row for an email that already has credentials
    if (byEmail?.passwordHash && byEmail.id !== safe.id) {
      if (!verifyAccountToken(body.accountToken, byEmail.id, byEmail.email)) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in." },
          { status: 409 }
        );
      }
      safe.id = byEmail.id;
    }

    // Registered accounts must present a valid account token
    if (byEmail?.passwordHash || (await findRegistryUser(safe.id))?.passwordHash) {
      const owner = byEmail?.passwordHash ? byEmail : await findRegistryUser(safe.id);
      if (
        owner?.passwordHash &&
        !verifyAccountToken(body.accountToken, owner.id, owner.email)
      ) {
        return NextResponse.json(
          { error: "Session expired. Please log in again." },
          { status: 401 }
        );
      }
      if (owner) safe.id = owner.id;
    }

    // If email exists without password (legacy sync), merge into that id
    if (byEmail && !byEmail.passwordHash && byEmail.id !== safe.id) {
      const registry = await loadRegistry();
      const merged = preserveServerBilling(safe, byEmail);
      merged.id = byEmail.id;
      registry.users[byEmail.id] = merged;
      delete registry.users[safe.id];
      await saveRegistry(registry);
      const saved = registry.users[byEmail.id];
      return NextResponse.json({
        ok: true,
        billing: saved ? registryUserToBilling(saved) : null,
      });
    }

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
