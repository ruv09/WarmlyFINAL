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

/** Nunito — интерфейс. Literata — мысль дня, записи, дощечка. */
export const UI_FONTS = {
  regular: "Nunito_400Regular",
  medium: "Nunito_500Medium",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
} as const;

export const SERIF_FONTS = {
  regular: "Literata_400Regular",
  medium: "Literata_500Medium",
  semibold: "Literata_600SemiBold",
  bold: "Literata_700Bold",
} as const;

export const SERIF_ITALIC_FONTS = {
  regular: "Literata_400Regular_Italic",
  medium: "Literata_500Medium_Italic",
  semibold: "Literata_600SemiBold_Italic",
  bold: "Literata_700Bold_Italic",
} as const;

export type TypefaceKind = "ui" | "serif";

export function mapFontWeight(value: unknown): FontWeightToken {
  const raw = String(value ?? "400");
  if (raw === "500" || raw === "medium") return "medium";
  if (raw === "600" || raw === "semibold") return "semibold";
  if (raw === "700" || raw === "800" || raw === "900" || raw === "bold") return "bold";
  return "regular";
}

export function resolveTypeface(
  kind: TypefaceKind,
  weight: FontWeightToken = "regular",
  italic = false,
): string {
  if (kind === "serif") {
    return italic ? SERIF_ITALIC_FONTS[weight] : SERIF_FONTS[weight];
  }
  return UI_FONTS[weight];
}

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
