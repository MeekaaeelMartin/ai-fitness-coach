import { NextResponse } from "next/server";
import type { UserAccount } from "@/lib/types/auth";
import { saveAccountSnapshot } from "@/lib/auth/account-store";
import { verifyAccountToken } from "@/lib/auth/account-token";
import { findRegistryUser } from "@/lib/registry/server-store";

export const runtime = "nodejs";

/**
 * Persists plan/progress so login on another device restores the account.
 * Requires a login/signup account token — never trusts email alone.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      user?: UserAccount;
      accountToken?: string;
    };
    const user = body.user;
    const accountToken = body.accountToken ?? user?.accountToken;
    if (!user?.id || !user?.email) {
      return NextResponse.json({ error: "Invalid account data" }, { status: 400 });
    }

    const email = user.email.trim().toLowerCase();
    // Resolve by id only, then enforce email ownership on that row.
    const registryUser = await findRegistryUser(user.id);
    if (!registryUser?.passwordHash) {
      return NextResponse.json(
        { error: "Account is not registered for cloud login yet" },
        { status: 403 }
      );
    }

    if (registryUser.email !== email) {
      return NextResponse.json({ error: "Email mismatch" }, { status: 403 });
    }

    if (!verifyAccountToken(accountToken, registryUser.id, registryUser.email)) {
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    await saveAccountSnapshot({
      ...user,
      id: registryUser.id,
      email: registryUser.email,
      passwordHash: "",
      accountToken: undefined,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save account" }, { status: 500 });
  }
}
