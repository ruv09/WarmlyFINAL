/** Радиус скругления — кратен базовой единице отступа (theme/tokens/spacing.ts). */
export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  /** Крупные иллюстрированные карточки (например, карточка "Лес" на
   *  Главной) — соответствует референсу, где углы заметно круглее
   *  обычных карточек. */
  xl: 32,
  full: 999,
} as const;

export type RadiusToken = keyof typeof RADIUS;
