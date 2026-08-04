export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toTimeString(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function isToday(dateKey: string): boolean {
  return dateKey === toDateKey(new Date());
}

/**
 * Парсит ключ YYYY-MM-DD как локальную полночь — не как UTC.
 * `new Date("2026-08-05")` даёт полночь UTC и сдвигает дату в TZ западнее UTC.
 */
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function formatHumanDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
}

export function hoursSince(isoDate: string, now: Date = new Date()): number {
  return (now.getTime() - new Date(isoDate).getTime()) / (1000 * 60 * 60);
}
