import { Entry } from "../types";

export interface EntryStatistics {
  totalEntries: number;
  totalDays: number;
  mostFrequentMoodId: string | null;
  /** Записей за последние 7 дней — простой, понятный показатель
   *  динамики активности, без графиков и трендовых линий (см.
   *  требование "статистика должна быть лёгкой и понятной"). */
  entriesLast7Days: number;
}

/**
 * Чистая функция, не хук — легко проверяется отдельно от React
 * (см. подход в /ARCHITECTURE.md: вычисления отделены от их
 * использования в UI).
 */
export function calculateEntryStatistics(entries: Entry[], now: Date = new Date()): EntryStatistics {
  const totalEntries = entries.length;
  const totalDays = new Set(entries.map((entry) => entry.date)).size;

  const moodCounts = new Map<string, number>();
  for (const entry of entries) {
    moodCounts.set(entry.moodId, (moodCounts.get(entry.moodId) ?? 0) + 1);
  }
  let mostFrequentMoodId: string | null = null;
  let highestCount = 0;
  for (const [moodId, count] of moodCounts) {
    if (count > highestCount) {
      highestCount = count;
      mostFrequentMoodId = moodId;
    }
  }

  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const entriesLast7Days = entries.filter((entry) => new Date(entry.createdAt) >= sevenDaysAgo).length;

  return { totalEntries, totalDays, mostFrequentMoodId, entriesLast7Days };
}
