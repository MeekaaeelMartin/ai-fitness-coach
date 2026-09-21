export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getWeekdayName(date: Date = new Date()): string {
  return date.toLocaleDateString("en-ZA", { weekday: "long" });
}

export function getTodayWeekday(): string {
  return getWeekdayName(new Date());
}

export function formatDateZA(date: Date = new Date()): string {
  return date.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isSameDateKey(a: string, b: string = toDateKey()): boolean {
  return a === b;
}
