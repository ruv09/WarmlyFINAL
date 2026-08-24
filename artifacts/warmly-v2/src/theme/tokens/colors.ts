/**
 * Одна акварельная система: sage / cream / wood днём,
 * dusk indigo / lantern gold ночью — те же поляны, что в лесу.
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
  tabBar: string;
  groveSky: string;
}

export const lightColors: ColorPalette = {
  background: "#EBE6D4",
  surface: "#F6F1E4",
  textPrimary: "#3C3A32",
  textSecondary: "#7E7A6C",
  accent: "#7D9570",
  accentWarm: "#C4A078",
  border: "#DDD4C2",
  overlay: "#F6F1E4EE",
  tabBar: "#F6F1E4F5",
  groveSky: "#C5D4E2",
};

export const darkColors: ColorPalette = {
  background: "#161428",
  surface: "#222036",
  textPrimary: "#F0E8DC",
  textSecondary: "#9A96A8",
  accent: "#8AAB78",
  accentWarm: "#E0B56A",
  border: "#322E48",
  overlay: "#161428EE",
  tabBar: "#1C1830F5",
  groveSky: "#161428",
};
