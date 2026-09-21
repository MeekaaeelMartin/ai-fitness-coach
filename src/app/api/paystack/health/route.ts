import { NextResponse } from "next/server";
import { getPaystackDiagnostics } from "@/lib/paystack/config";

export const runtime = "nodejs";

/** Safe config check — no secret values returned. */
export async function GET() {
  return NextResponse.json(getPaystackDiagnostics());
}
