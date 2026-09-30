import { createHmac, timingSafeEqual } from "crypto";

function getAuthSecret(): string {
  return (
    process.env.ADMIN_SECRET?.trim() ||
    process.env.PAYSTACK_SECRET_KEY?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    ""
  );
}

export function canIssueAccountTokens(): boolean {
  return Boolean(getAuthSecret());
}

/** Stateless proof that the client completed login/signup for this account. */
export function issueAccountToken(userId: string, email: string): string | null {
  const secret = getAuthSecret();
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update(`v1:${userId}:${email.trim().toLowerCase()}`)
    .digest("hex");
}

export function verifyAccountToken(
  token: string | undefined,
  userId: string,
  email: string
): boolean {
  if (!token) return false;
  const expected = issueAccountToken(userId, email);
  if (!expected) return false;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
