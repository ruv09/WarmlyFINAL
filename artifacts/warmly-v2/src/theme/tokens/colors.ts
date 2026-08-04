/**
 * Цветовые палитры — единственное место в приложении, где
 * прописаны hex-значения цветов. Компонент никогда не пишет
 * `color: "#2E2A26"` — только `theme.colors.textPrimary`.
 *
 * Обе палитры соответствуют художественным референсам (визуальные
 * концепции "Природный уют" для светлой темы, объединение
 * "Сказочный лес" + "Тёплый вечер" для тёмной — см. /THEME.md).
 */
export interface ColorPalette {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  /** Тёплый акцентный цвет — огоньки, светлячки, ягоды, солнечные
   *  блики на статистике. Отдельно от `accent` (зелёный, "живой"
   *  цвет леса): это "тёплый свет", а не "рост". */
  accentWarm: string;
  border: string;
  /** Полупрозрачная плашка поверх иллюстрированного фона (карточка
   *  "Мой лес") — текст должен читаться поверх любой картинки. */
  overlay: string;
}

export const lightColors: ColorPalette = {
  background: "#F6F1E6",
  surface: "#FFFDF8",
  textPrimary: "#3A332B",
  textSecondary: "#8B8275",
  accent: "#7FA06F",
  accentWarm: "#D98B6F",
  border: "#EBE3D3",
  overlay: "#FFFDF8CC",
};

export const darkColors: ColorPalette = {
  background: "#211E30",
  surface: "#2B2740",
  textPrimary: "#F0EAE2",
  textSecondary: "#B3A9C4",
  accent: "#8FB996",
  accentWarm: "#E8B975",
  border: "#3A3550",
  overlay: "#211E30CC",
};
