import { NextResponse } from "next/server";
import { findRegistryUser } from "@/lib/registry/server-store";
import { registryUserToBilling } from "@/lib/paystack/billing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!userId || !email) {
    return NextResponse.json({ error: "userId and email are required" }, { status: 400 });
  }

  const user = await findRegistryUser(userId, email);
  if (!user || user.email !== email) {
    return NextResponse.json({ billing: null });
  }

  return NextResponse.json({ billing: registryUserToBilling(user) });
}
