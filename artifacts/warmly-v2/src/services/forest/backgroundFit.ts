export type SceneFrame = { width: number; height: number; left: number; top: number };

/**
 * Вписывает картину целиком (contain) для резкого слоя.
 * Поля вокруг закрывает размытый cover того же кадра.
 */
export function fitStaticBackground(
  imageWidth: number,
  imageHeight: number,
  screenWidth: number,
  screenHeight: number,
): SceneFrame {
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

const SCENE_IMAGE_WIDTH = 1000;

/** Рамка резкой картины внутри карточки или экрана. */
export function getContainedSceneFrame(width: number, height: number, aspect: number): SceneFrame {
  const imageHeight = aspect > 0 ? SCENE_IMAGE_WIDTH / aspect : SCENE_IMAGE_WIDTH;
  return fitStaticBackground(SCENE_IMAGE_WIDTH, imageHeight, width, height);
}

/**
 * Дощечка как на референсе: ~56% ширины сцены, в траве,
 * снизу запас ~8% высоты картины — не на переднем плане.
 */
export const PLAQUE_SCENE_WIDTH = 0.56;
export const PLAQUE_SCENE_BOTTOM = 0.08;

export function layoutPlaqueInScene(
  scene: SceneFrame,
  plaqueAspect: number,
): SceneFrame {
  const width = Math.round(scene.width * PLAQUE_SCENE_WIDTH);
  const height = Math.max(1, Math.round(width / plaqueAspect));
  const bottomGap = Math.round(scene.height * PLAQUE_SCENE_BOTTOM);
  const left = scene.left + (scene.width - width) / 2;
  const top = scene.top + scene.height - bottomGap - height;
  return { width, height, left, top };
}
