import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import {
  loadAccountSnapshot,
  snapshotToUserAccount,
  toAccountSnapshot,
} from "@/lib/auth/account-store";
import {
  createDefaultProgress,
  createTrialSubscription,
  type UserAccount,
} from "@/lib/types/auth";
import { findRegistryUser } from "@/lib/registry/server-store";
import { registryUserToBilling } from "@/lib/paystack/billing";

export const runtime = "nodejs";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!email || password.length < 6) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const registryUser = await findRegistryUser(undefined, email);
    if (!registryUser?.passwordHash) {
      return NextResponse.json(
        {
          error:
            "No account found for this email, or the password was never saved on the server. Please sign up again.",
        },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, registryUser.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const snapshot = await loadAccountSnapshot(registryUser.id);
    const user: UserAccount = snapshot
      ? snapshotToUserAccount(snapshot, "")
      : {
          id: registryUser.id,
          email: registryUser.email,
          passwordHash: "",
          name: registryUser.name,
          createdAt: registryUser.createdAt,
          assessment: null,
          generatedPlan: null,
          progress: createDefaultProgress(),
          subscription: createTrialSubscription(),
          points: registryUser.points ?? 0,
          exerciseSelections: {},
        };

    // Keep profile fields fresh from registry
    user.id = registryUser.id;
    user.email = registryUser.email;
    user.name = registryUser.name || user.name;
    user.createdAt = registryUser.createdAt || user.createdAt;

    return NextResponse.json({
      ok: true,
      user: toAccountSnapshot(user),
      billing: registryUserToBilling(registryUser),
    });
  } catch {
    return NextResponse.json({ error: "Could not log in" }, { status: 500 });
  }
}
