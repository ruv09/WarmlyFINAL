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

/** Светлая тема — «Природный уют»: тёплое утро, овсяный фон. */
export const lightColors: ColorPalette = {
  background: "#F3EBDC",
  surface: "#FFF9F0",
  textPrimary: "#3A332B",
  textSecondary: "#8B8275",
  accent: "#7FA06F",
  accentWarm: "#D98B6F",
  border: "#E5DBC8",
  overlay: "#FFF9F0D9",
};

/** Тёмная тема — «Тёплый вечер»: сумерки, не инверсия светлой. */
export const darkColors: ColorPalette = {
  background: "#1C1828",
  surface: "#2A243C",
  textPrimary: "#F0EAE2",
  textSecondary: "#B3A9C4",
  accent: "#8FB996",
  accentWarm: "#E8B975",
  border: "#3A3350",
  overlay: "#1C1828D9",
};
