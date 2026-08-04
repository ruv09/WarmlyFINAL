/**
 * Типографика — размеры, начертания, межстрочный интервал и лимиты
 * масштабирования. Компонент не пишет `fontSize: 15` — только
 * `theme.typography.sizes.body`.
 */
export const FONT_SIZES = {
  caption: 12,
  body: 15,
  subtitle: 17,
  title: 22,
  largeTitle: 28,
} as const;

export type FontSizeToken = keyof typeof FONT_SIZES;

/** Соответствует стандартным весам шрифта в React Native (строки, не числа — так ждёт RN). */
export const FONT_WEIGHTS = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export type FontWeightToken = keyof typeof FONT_WEIGHTS;

/**
 * Межстрочный интервал как множитель к размеру шрифта (а не
 * абсолютное число) — так соотношение остаётся верным при системном
 * масштабировании шрифта, вместо того чтобы "разъезжаться" с текстом.
 */
export const LINE_HEIGHT_RATIOS = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export type LineHeightToken = keyof typeof LINE_HEIGHT_RATIOS;

export function resolveLineHeight(fontSize: number, ratio: LineHeightToken): number {
  return Math.round(fontSize * LINE_HEIGHT_RATIOS[ratio]);
}

/**
 * Лимиты масштабирования от системных настроек размера шрифта
 * (Dynamic Type / "Размер шрифта" Android), раздельно по роли текста —
 * см. подробное обоснование в /RESPONSIVE.md. Значения используются
 * компонентами как `maxFontSizeMultiplier`.
 */
export const FONT_SCALE_LIMITS = {
  content: 2.0,
  ui: 1.3,
} as const;

export type FontScaleRole = keyof typeof FONT_SCALE_LIMITS;
