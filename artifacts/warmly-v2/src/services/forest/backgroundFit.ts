/**
 * Статичный фон сцены дерева: масштаб только от исходного JPG и экрана.
 * Не камера и не зум выбранного дерева. Картина закрывает экран целиком,
 * чтобы сверху и снизу не оставалось чужой заливки.
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

  const scale = Math.max(screenWidth / imageWidth, screenHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    width,
    height,
    left: (screenWidth - width) / 2,
    top: (screenHeight - height) / 2,
  };
}
