import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact/schema";
import { sendContactMessage } from "@/lib/contact/send";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid form data";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    await sendContactMessage(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send your message";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
