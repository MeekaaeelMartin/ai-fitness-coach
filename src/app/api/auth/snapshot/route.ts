import { NextResponse } from "next/server";
import type { UserAccount } from "@/lib/types/auth";
import { saveAccountSnapshot } from "@/lib/auth/account-store";
import { findRegistryUser } from "@/lib/registry/server-store";

export const runtime = "nodejs";

/**
 * Persists plan/progress so login on another device restores the account.
 * Requires the user to already exist in the registry (created via /api/auth/signup).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { user?: UserAccount };
    const user = body.user;
    if (!user?.id || !user?.email) {
      return NextResponse.json({ error: "Invalid account data" }, { status: 400 });
    }

    const registryUser = await findRegistryUser(user.id, user.email);
    if (!registryUser?.passwordHash) {
      return NextResponse.json(
        { error: "Account is not registered for cloud login yet" },
        { status: 403 }
      );
    }

    if (registryUser.email !== user.email.trim().toLowerCase()) {
      return NextResponse.json({ error: "Email mismatch" }, { status: 403 });
    }

    await saveAccountSnapshot({
      ...user,
      id: registryUser.id,
      email: registryUser.email,
      passwordHash: "",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save account" }, { status: 500 });
  }
}
