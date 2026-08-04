import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { useSettingsStore } from "../store";
import { useDeviceMetrics } from "../hooks/useDeviceMetrics";
import { darkColors, DURATIONS, EASING_CURVES, FONT_SCALE_LIMITS, FONT_SIZES, FONT_WEIGHTS, lightColors, RADIUS } from "./tokens";
import { Theme } from "./types";

/**
 * Единственная точка, откуда компоненты получают тему.
 *
 * Разрешает три источника в один результат:
 * 1. Настройка пользователя (light/dark/auto) — src/store/useSettingsStore.
 * 2. Системная тема устройства — useColorScheme, участвует только
 *    когда выбран режим "auto".
 * 3. Метрики устройства (useDeviceMetrics) — для адаптивных отступов
 *    и ширины колонки контента, см. /RESPONSIVE.md.
 *
 * Ни один компонент не обращается к useColorScheme, useSettingsStore
 * или токенам (theme/tokens/*) напрямую — только к этому хуку.
 * Это и есть требование "no hardcoded values inside components":
 * у компонента физически нет способа получить цвет, отступ или
 * длительность анимации в обход этого объекта.
 */
export function useTheme(): Theme {
  const themeMode = useSettingsStore((state) => state.settings.theme);
  const systemScheme = useColorScheme();
  const { spacing, contentWidth, isTablet } = useDeviceMetrics();

  return useMemo<Theme>(() => {
    const resolvedMode: "light" | "dark" =
      themeMode === "auto" ? (systemScheme === "dark" ? "dark" : "light") : themeMode;
    const colors = resolvedMode === "dark" ? darkColors : lightColors;

    return {
      mode: resolvedMode,
      colors,
      typography: {
        sizes: FONT_SIZES,
        weights: FONT_WEIGHTS,
        scaleLimits: FONT_SCALE_LIMITS,
      },
      spacing,
      radius: RADIUS,
      animation: {
        durations: DURATIONS,
        easing: EASING_CURVES,
      },
      contentWidth,
      isTablet,
    };
  }, [themeMode, systemScheme, spacing, contentWidth, isTablet]);
}
