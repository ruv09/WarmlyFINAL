/**
 * Настроение — фиксированный, но расширяемый справочник.
 * Значения живут в constants/moods.ts; этот файл описывает только форму данных.
 */
export type MoodId = string;

export interface Mood {
  id: MoodId;
  label: string;
  emoji: string;
  color: string;
}
