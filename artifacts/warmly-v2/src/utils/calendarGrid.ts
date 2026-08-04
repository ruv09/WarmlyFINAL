import { toDateKey } from "./date";

export interface CalendarDay {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
}

export const WEEKDAY_LABELS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

/**
 * Строит сетку 6 недель × 7 дней (Пн-Вс) для отображения месяца целиком,
 * включая дни соседних месяцев, чтобы заполнить прямоугольную сетку —
 * так же, как это делает системный календарь.
 */
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0=Вс..6=Сб — сдвигаем так, чтобы неделя начиналась с понедельника
  const firstWeekdayOffset = (firstOfMonth.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - firstWeekdayOffset);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({ date, dateKey: toDateKey(date), isCurrentMonth: date.getMonth() === month });
  }
  return days;
}

export function formatMonthYear(year: number, month: number): string {
  const label = new Date(year, month, 1).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
