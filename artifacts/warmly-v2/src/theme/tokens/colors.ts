/**
 * Светлая: концепт 2 «Природный уют» — кремовый, охра, олива.
 * Тёмная: концепты 4–5 «Сказочный лес» + «Тёплый вечер» — индиго, золото.
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
  background: "#F3EBDC",
  surface: "#FFF9F0",
  textPrimary: "#3A342C",
  textSecondary: "#9A8F7E",
  accent: "#8A9A6E",
  accentWarm: "#C9956A",
  border: "#E4D8C4",
  overlay: "#FFF9F0E8",
};

export const darkColors: ColorPalette = {
  background: "#1A1230",
  surface: "#2A2048",
  textPrimary: "#F2EBE3",
  textSecondary: "#A89BC0",
  accent: "#9BB88A",
  accentWarm: "#E8B975",
  border: "#3A3258",
  overlay: "#1A1230E8",
};
