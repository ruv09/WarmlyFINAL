import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import {
  getPhoneWidthClass,
  getWindowSizeClass,
  isTabletWidth,
  MAX_CONTENT_WIDTH,
} from "../constants/layout";
import { resolveSpacingMultiplier, scaleSpacing, SpacingToken } from "../theme/tokens/spacing";

export interface DeviceMetrics {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  windowSizeClass: ReturnType<typeof getWindowSizeClass>;
  phoneWidthClass: ReturnType<typeof getPhoneWidthClass>;
  isTablet: boolean;
  contentWidth: number;
  spacing: (token: SpacingToken) => number;
}

/**
 * Единственное место, которое напрямую вызывает useWindowDimensions
 * (см. подробное обоснование в /RESPONSIVE.md). Классификация
 * устройства (constants/layout.ts) и шкала отступов (theme/tokens/spacing.ts)
 * — это данные; этот хук — единственное место, где они применяются
 * к текущим размерам экрана.
 */
export function useDeviceMetrics(): DeviceMetrics {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const windowSizeClass = getWindowSizeClass(width);
    const phoneWidthClass = getPhoneWidthClass(width);
    const multiplier = resolveSpacingMultiplier(windowSizeClass, phoneWidthClass);

    return {
      width,
      height,
      orientation: width > height ? "landscape" : "portrait",
      windowSizeClass,
      phoneWidthClass,
      isTablet: isTabletWidth(width),
      contentWidth: Math.min(width, MAX_CONTENT_WIDTH),
      spacing: (token: SpacingToken) => scaleSpacing(token, multiplier),
    };
  }, [width, height]);
}
