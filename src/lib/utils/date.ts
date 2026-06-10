export function toDateKey(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

export function getTodayWeekday(): string {
  return new Date().toLocaleDateString("en-ZA", { weekday: "long" });
}

export function formatDateZA(date: Date = new Date()): string {
  return date.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
