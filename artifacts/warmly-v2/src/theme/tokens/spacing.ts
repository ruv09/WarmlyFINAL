import { PhoneWidthClass, WindowSizeClass } from "../../constants/layout";

/**
 * Базовая единица отступа — 4dp, все отступы кратны ей (см. полное
 * обоснование в /RESPONSIVE.md). Брейкпоинты устройства (WindowSizeClass,
 * PhoneWidthClass) — это классификация экрана, а не часть визуальной
 * темы, поэтому они остаются в constants/layout.ts; здесь только то,
 * какой отступ им соответствует.
 */
export const SPACING_UNIT = 4;

export const SPACING = {
  xs: SPACING_UNIT * 1, // 4
  sm: SPACING_UNIT * 2, // 8
  md: SPACING_UNIT * 4, // 16
  lg: SPACING_UNIT * 6, // 24
  xl: SPACING_UNIT * 8, // 32
  xxl: SPACING_UNIT * 12, // 48
} as const;

export type SpacingToken = keyof typeof SPACING;

const PHONE_MULTIPLIER: Record<PhoneWidthClass, number> = {
  narrow: 0.875,
  standard: 1,
  wide: 1,
};

const WINDOW_MULTIPLIER: Record<WindowSizeClass, number> = {
  compact: 1,
  medium: 1.15,
  expanded: 1.25,
};

export function resolveSpacingMultiplier(
  windowSizeClass: WindowSizeClass,
  phoneWidthClass: PhoneWidthClass,
): number {
  if (windowSizeClass !== "compact") {
    return WINDOW_MULTIPLIER[windowSizeClass];
  }
  return PHONE_MULTIPLIER[phoneWidthClass];
}

export function scaleSpacing(token: SpacingToken, multiplier: number): number {
  return Math.round(SPACING[token] * multiplier);
}
