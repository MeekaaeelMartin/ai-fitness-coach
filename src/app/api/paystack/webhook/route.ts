import { NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/lib/paystack/verify-signature";
import { handlePaystackWebhookEvent } from "@/lib/paystack/billing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as {
      event?: string;
      data?: Record<string, unknown>;
    };

    if (payload.event && payload.data) {
      await handlePaystackWebhookEvent(payload.event, payload.data);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
