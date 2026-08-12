/**
 * Светлая: минимализм + природный уют (концепты 1–2).
 * Тёмная: сказочный лес + тёплый вечер (концепты 4–5), не инверсия.
 */
export interface ColorPalette {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentWarm: string;
  border: string;
  overlay: string;
}

export const lightColors: ColorPalette = {
  background: "#F7F1E6",
  surface: "#FFFDF8",
  textPrimary: "#2E2A26",
  textSecondary: "#8B8275",
  accent: "#7FA06F",
  accentWarm: "#D98B6F",
  border: "#E8DFD0",
  overlay: "#FFFDF8E6",
};

export const darkColors: ColorPalette = {
  background: "#1A1428",
  surface: "#2A2240",
  textPrimary: "#F0EAE2",
  textSecondary: "#B3A9C4",
  accent: "#8FB996",
  accentWarm: "#E8B975",
  border: "#3A3350",
  overlay: "#1A1428E6",
};
