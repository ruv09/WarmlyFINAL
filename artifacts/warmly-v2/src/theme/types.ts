import {
  ColorPalette,
  DURATIONS,
  EASING_CURVES,
  FONT_SCALE_LIMITS,
  FONT_SIZES,
  FONT_WEIGHTS,
  RADIUS,
  SpacingToken,
} from "./tokens";

/**
 * Полный набор токенов темы, который получает компонент из useTheme().
 * Это единственная форма, в которой компонент имеет право получать
 * визуальные значения — не импортируя токены напрямую по отдельности.
 */
export interface Theme {
  mode: "light" | "dark";
  colors: ColorPalette;
  typography: {
    sizes: typeof FONT_SIZES;
    weights: typeof FONT_WEIGHTS;
    scaleLimits: typeof FONT_SCALE_LIMITS;
  };
  /** Отступ по имени токена, уже адаптированный под текущее устройство. */
  spacing: (token: SpacingToken) => number;
  radius: typeof RADIUS;
  animation: {
    durations: typeof DURATIONS;
    easing: typeof EASING_CURVES;
  };
  /** Ширина колонки контента с учётом ограничения на планшетах. */
  contentWidth: number;
  isTablet: boolean;
}
