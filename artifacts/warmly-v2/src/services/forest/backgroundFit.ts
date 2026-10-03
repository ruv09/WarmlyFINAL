/**
 * Вписывает поляну целиком (contain), без зума cover.
 * Картина остаётся резкой: масштаб только вниз, края экрана
 * закрывает небо/земля той же поляны, а не обрезка кадра.
 */
export function fitStaticBackground(
  imageWidth: number,
  imageHeight: number,
  screenWidth: number,
  screenHeight: number,
): { width: number; height: number; left: number; top: number } {
  if (imageWidth <= 0 || imageHeight <= 0 || screenWidth <= 0 || screenHeight <= 0) {
    return { width: screenWidth, height: screenHeight, left: 0, top: 0 };
  }

  const scale = Math.min(screenWidth / imageWidth, screenHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    width,
    height,
    left: (screenWidth - width) / 2,
    top: (screenHeight - height) / 2,
  };
}
