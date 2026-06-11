import { NextResponse } from "next/server";
import { ADMIN_EMAIL } from "@/lib/constants/admin";
import { loadRegistry } from "@/lib/registry/server-store";
import { registryStats as computeStats } from "@/lib/registry/types";

export const runtime = "nodejs";

function verifyAdmin(request: Request): boolean {
  const email = request.headers.get("x-admin-email")?.trim().toLowerCase();
  const key = request.headers.get("x-admin-key");
  const secret = process.env.ADMIN_SECRET;

  if (email !== ADMIN_EMAIL) return false;
  if (!secret) return true;
  return key === secret;
}

export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const registry = await loadRegistry();
    const stats = computeStats(registry);
    return NextResponse.json({ registry, stats });
  } catch {
    return NextResponse.json({ error: "Failed to load registry" }, { status: 500 });
  }
}
