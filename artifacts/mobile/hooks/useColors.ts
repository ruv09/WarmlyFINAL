import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

/**
 * Returns the design tokens for the current color scheme.
 * Respects the user's in-app theme preference (light / dark / system).
 */
export function useColors() {
  const systemScheme = useColorScheme();
  const { theme } = useTheme();

  const effectiveScheme = theme === "system" ? systemScheme : theme;
  const palette = effectiveScheme === "dark" ? colors.dark : colors.light;

  return { ...palette, radius: colors.radius };
}
