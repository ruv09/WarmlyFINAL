/**
 * Брейкпоинты по ширине экрана в dp (не в пикселях — RN уже
 * учитывает плотность пикселей в единицах dp/pt, поэтому одни
 * и те же числа корректны для iOS и Android).
 *
 * Внешний уровень классификации основан на Material 3 window size
 * classes (compact / medium / expanded) — это готовый, проверенный
 * индустрией стандарт, который различает "телефон" и "планшет"
 * по фактической ширине, а не по бренду устройства. Он же покрывает
 * будущий альбомный режим: широкий телефон в landscape попадёт
 * в тот же класс "medium", что и маленький планшет в portrait,
 * и получит тот же (уже готовый) вариант раскладки.
 *
 * Внутри "compact" (то есть внутри телефонов) есть дополнительная
 * подшкала — она нужна, потому что разброс внутри одних только
 * телефонов огромный: iPhone SE (375dp) и iPhone 16 Pro Max (430dp)
 * оба попадают в "compact", но плотность контента на них должна
 * отличаться.
 */
export const WINDOW_SIZE_BREAKPOINTS = {
  compact: 0,
  medium: 600,
  expanded: 840,
} as const;

export type WindowSizeClass = "compact" | "medium" | "expanded";

/** Ширина, ниже которой начинается класс. */
export const PHONE_WIDTH_BREAKPOINTS = {
  narrow: 0, // iPhone SE (375), iPhone 13 mini (375), большинство компактных Android
  standard: 380, // iPhone 14/15/16 (390-393), средние Android (~390-412)
  wide: 428, // iPhone Pro Max (428-430), большие Android-фаблеты
} as const;

export type PhoneWidthClass = "narrow" | "standard" | "wide";

/**
 * Максимальная ширина колонки контента на широких экранах.
 * На планшете это не даёт тексту растягиваться на всю ширину —
 * длинная строка текста тяжело читается, поэтому контент
 * центрируется в колонке разумной ширины (как на вебе).
 */
export const MAX_CONTENT_WIDTH = 560;

export function getWindowSizeClass(width: number): WindowSizeClass {
  if (width >= WINDOW_SIZE_BREAKPOINTS.expanded) return "expanded";
  if (width >= WINDOW_SIZE_BREAKPOINTS.medium) return "medium";
  return "compact";
}

export function getPhoneWidthClass(width: number): PhoneWidthClass {
  if (width >= PHONE_WIDTH_BREAKPOINTS.wide) return "wide";
  if (width >= PHONE_WIDTH_BREAKPOINTS.standard) return "standard";
  return "narrow";
}

export function isTabletWidth(width: number): boolean {
  return getWindowSizeClass(width) !== "compact";
}
