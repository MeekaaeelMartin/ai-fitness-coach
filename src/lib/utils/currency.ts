export const CURRENCY = {
  code: "ZAR",
  symbol: "R",
  locale: "en-ZA",
} as const;

export const MONTHLY_PRICE = 500;
export const TRIAL_DAYS = 7;

export function formatZAR(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatZARPerMonth(amount: number = MONTHLY_PRICE): string {
  return `${formatZAR(amount)}/month`;
}

export function formatZARPerDay(amount: number): string {
  return `${formatZAR(amount)}/day`;
}
