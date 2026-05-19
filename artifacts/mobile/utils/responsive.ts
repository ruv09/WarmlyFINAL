import { useWindowDimensions } from "react-native";

/** Base design width (iPhone 14 Pro = 393). */
const BASE_WIDTH = 393;

/**
 * Returns responsive helpers based on the current window size.
 * Use inside components — do NOT call at module level.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const scale = width / BASE_WIDTH;

  /** Scale a size proportionally, capped at 1.25× to avoid oversized UI on tablets. */
  const rs = (size: number) => Math.round(size * Math.min(scale, 1.25));

  /** Scale font size — more conservative cap (1.15×). */
  const rf = (size: number) => Math.round(size * Math.min(scale, 1.15));

  /** Horizontal padding that scales but stays reasonable (min 16, max 28). */
  const hPad = Math.min(Math.max(Math.round(22 * scale), 16), 28);

  const isSmall = width < 360;   // e.g. Galaxy A13, old Androids
  const isLarge = width >= 430;  // e.g. iPhone Pro Max, large Android

  return { width, height, scale, rs, rf, hPad, isSmall, isLarge };
}
