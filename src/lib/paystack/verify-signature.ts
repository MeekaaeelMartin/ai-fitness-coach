import { createHmac, timingSafeEqual } from "crypto";
import { getPaystackWebhookSecret } from "./config";

export function verifyPaystackSignature(
  rawBody: string,
  signature: string | null
): boolean {
  const secret = getPaystackWebhookSecret();
  if (!secret || !signature) return false;

  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch {
    return false;
  }
}
