import {
  getPaystackPlanCode,
  getPaystackSecretKey,
  getSiteUrl,
  monthlyAmountInCents,
} from "./config";
import type { PaystackInitializeResponse, PaystackVerifyResponse } from "./types";

const PAYSTACK_BASE = "https://api.paystack.co";

async function paystackFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const secretKey = getPaystackSecretKey();
  if (!secretKey) {
    throw new Error("Paystack secret key is not configured");
  }

  const response = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(
      (payload as { message?: string }).message ?? "Paystack request failed"
    );
  }

  return payload;
}

export async function initializeSubscriptionCheckout(params: {
  email: string;
  userId: string;
  name?: string;
}): Promise<PaystackInitializeResponse> {
  const planCode = getPaystackPlanCode();
  if (!planCode) {
    throw new Error("Paystack plan code is not configured");
  }

  return paystackFetch<PaystackInitializeResponse>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: monthlyAmountInCents(),
      currency: "ZAR",
      plan: planCode,
      callback_url: `${getSiteUrl()}/subscribe/callback`,
      metadata: {
        userId: params.userId,
        name: params.name ?? "",
      },
    }),
  });
}

export async function verifyTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  return paystackFetch<PaystackVerifyResponse>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );
}
