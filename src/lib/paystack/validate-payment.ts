import { monthlyAmountInCents } from "./config";

export class PaymentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentValidationError";
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export interface ValidatedPayment {
  reference: string;
  paidAt: string;
  amount: number;
  currency: string;
  customerCode?: string;
  customerEmail?: string;
  userId: string;
  planCode?: string;
}

/**
 * Only a completed Paystack charge may unlock access.
 * Abandoned / pending / failed checkouts must never activate billing.
 */
export function assertSuccessfulPayment(
  data: Record<string, unknown> | null | undefined,
  expected: { userId: string; email: string }
): ValidatedPayment {
  if (!data) {
    throw new PaymentValidationError("Payment data missing");
  }

  const status = readString(data.status)?.toLowerCase();
  if (status !== "success") {
    throw new PaymentValidationError(
      status === "abandoned"
        ? "Payment was not completed"
        : `Payment not successful (${status ?? "unknown"})`
    );
  }

  const paidAt = readString(data.paid_at);
  if (!paidAt) {
    throw new PaymentValidationError("Payment has no paid_at timestamp");
  }

  const amount = readNumber(data.amount);
  const expectedAmount = monthlyAmountInCents();
  if (amount == null || amount < expectedAmount) {
    throw new PaymentValidationError("Payment amount does not match subscription price");
  }

  const currency = readString(data.currency)?.toUpperCase();
  if (currency !== "ZAR") {
    throw new PaymentValidationError("Payment currency must be ZAR");
  }

  const metadata = asRecord(data.metadata) ?? {};
  const metadataUserId = readString(metadata.userId);
  if (!metadataUserId) {
    throw new PaymentValidationError("Payment is missing account metadata");
  }
  if (metadataUserId !== expected.userId) {
    throw new PaymentValidationError("Payment does not match this account");
  }

  const customer = asRecord(data.customer);
  const customerEmail = readString(customer?.email)?.toLowerCase();
  if (customerEmail && customerEmail !== expected.email.trim().toLowerCase()) {
    throw new PaymentValidationError("Payment email does not match this account");
  }

  const reference = readString(data.reference);
  if (!reference) {
    throw new PaymentValidationError("Payment reference missing");
  }

  const plan = asRecord(data.plan);

  return {
    reference,
    paidAt,
    amount,
    currency,
    customerCode: readString(customer?.customer_code),
    customerEmail,
    userId: metadataUserId,
    planCode: readString(plan?.plan_code) ?? readString(data.plan),
  };
}

export function userIdFromPaystackPayload(data: Record<string, unknown>): string | undefined {
  const metadata = asRecord(data.metadata);
  return readString(metadata?.userId);
}

export function emailFromPaystackPayload(data: Record<string, unknown>): string | undefined {
  const customer = asRecord(data.customer);
  return readString(customer?.email)?.toLowerCase();
}
