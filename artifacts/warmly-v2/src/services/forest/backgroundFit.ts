/**
 * Статичный фон сцены дерева: масштаб только от исходного PNG и экрана.
 * Не cover, не камера, не масштаб выбранного дерева.
 *
 * Приоритет: композиция исходника → пропорции → заполнение экрана.
 * Допускается крошечный overscan по краям, но не зум центра.
 */
export function fitStaticBackground(
  imageWidth: number,
  imageHeight: number,
  screenWidth: number,
  screenHeight: number,
  maxOverscan = 1.05,
): { width: number; height: number; left: number; top: number } {
  if (imageWidth <= 0 || imageHeight <= 0 || screenWidth <= 0 || screenHeight <= 0) {
    return { width: screenWidth, height: screenHeight, left: 0, top: 0 };
  }

  const contain = Math.min(screenWidth / imageWidth, screenHeight / imageHeight);
  const cover = Math.max(screenWidth / imageWidth, screenHeight / imageHeight);
  const scale = Math.min(cover, contain * maxOverscan);

  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    width,
    height,
    left: (screenWidth - width) / 2,
    top: (screenHeight - height) / 2,
  };
}
