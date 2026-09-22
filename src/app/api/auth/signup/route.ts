import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { hashPassword } from "@/lib/auth/password";
import { saveAccountSnapshot, toAccountSnapshot } from "@/lib/auth/account-store";
import {
  createDefaultProgress,
  createTrialSubscription,
  type UserAccount,
} from "@/lib/types/auth";
import type { RegistryUser } from "@/lib/registry/types";
import { userToRegistryEntry } from "@/lib/registry/types";
import {
  findRegistryUser,
  loadRegistry,
  saveRegistry,
} from "@/lib/registry/server-store";
import { preserveServerBilling } from "@/lib/paystack/billing";

export const runtime = "nodejs";

interface SignupBody {
  email?: string;
  password?: string;
  name?: string;
  /** Optional local snapshot to seed the server account (assessment/plan). */
  account?: Partial<UserAccount>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupBody;
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const name = body.name?.trim() || "Member";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    if (name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    const existing = await findRegistryUser(undefined, email);

    // Account already has a server password — cannot re-register
    if (existing?.passwordHash) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const id = existing?.id ?? body.account?.id ?? randomUUID();
    const createdAt = existing?.createdAt ?? new Date().toISOString();

    const user: UserAccount = {
      id,
      email,
      passwordHash: "",
      name,
      createdAt,
      assessment: body.account?.assessment ?? null,
      generatedPlan: body.account?.generatedPlan ?? null,
      progress: body.account?.progress ?? createDefaultProgress(),
      subscription: body.account?.subscription ?? createTrialSubscription(),
      points: body.account?.points ?? 0,
      exerciseSelections: body.account?.exerciseSelections ?? {},
    };

    // If claiming a registry row that existed from anonymous sync, keep its id/billing base
    const registryBase: RegistryUser = {
      ...userToRegistryEntry(user),
      id,
      email,
      name,
      createdAt,
      passwordHash,
      lastSeenAt: new Date().toISOString(),
    };

    const registry = await loadRegistry();
    const prior = registry.users[id] ?? existing ?? undefined;
    registry.users[id] = {
      ...preserveServerBilling(registryBase, prior),
      passwordHash,
      name,
      email,
      lastSeenAt: new Date().toISOString(),
    };
    await saveRegistry(registry);
    await saveAccountSnapshot(user);

    const saved = registry.users[id];
    return NextResponse.json({
      ok: true,
      user: toAccountSnapshot(user),
      billing: {
        subscriptionStatus: saved.subscriptionStatus,
        subscribedAt: saved.subscribedAt,
        currentPeriodEnd: saved.currentPeriodEnd,
        trialEndsAt: saved.trialEndsAt,
        paystackCustomerCode: saved.paystackCustomerCode,
        paystackSubscriptionCode: saved.paystackSubscriptionCode,
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not create account" }, { status: 500 });
  }
}
