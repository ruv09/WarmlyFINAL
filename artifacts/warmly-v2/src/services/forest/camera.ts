/**
 * Виртуальная камера леса: pinch двигает cameraDepth вперёд,
 * а не масштабирует картинку. Проекция — перспектива от относительного Z.
 */

export const FOCAL_LENGTH = 380;
export const NEAR_PLANE = 48;
export const PASS_PLANE = 90;
export const FAR_PLANE = 1450;
export const TREE_BASE_SIZE = 210;
export const MAX_LOOK_X = 210;
export const MAX_LOOK_Y = 42;
/** Насколько pinch «шагает» вглубь мира. */
export const WALK_PER_PINCH = 560;

export function clampLookX(x: number): number {
  "worklet";
  return Math.max(-MAX_LOOK_X, Math.min(MAX_LOOK_X, x));
}

export function clampLookY(y: number): number {
  "worklet";
  return Math.max(-MAX_LOOK_Y, Math.min(MAX_LOOK_Y, y));
}

export function relativeZ(treeZ: number, camZ: number): number {
  "worklet";
  return treeZ - camZ;
}

/**
 * Перспектива: ближе к камере — крупнее. Не zoom всей сцены.
 */
export function perspective(relZ: number): number {
  "worklet";
  const z = Math.max(NEAR_PLANE * 0.35, relZ);
  return FOCAL_LENGTH / z;
}

export function passBy(relZ: number): { opacity: number; boost: number } {
  "worklet";
  if (relZ >= PASS_PLANE) {
    const farFade = relZ > FAR_PLANE * 0.72 ? Math.max(0.25, 1 - (relZ - FAR_PLANE * 0.72) / (FAR_PLANE * 0.28)) : 1;
    return { opacity: farFade, boost: 1 };
  }
  if (relZ <= NEAR_PLANE * 0.45) {
    return { opacity: 0, boost: 2.1 };
  }
  const t = 1 - (relZ - NEAR_PLANE * 0.45) / (PASS_PLANE - NEAR_PLANE * 0.45);
  return {
    opacity: 1 - t,
    boost: 1 + t * 1.15,
  };
}

export function projectFromCamera(
  worldX: number,
  worldZ: number,
  camX: number,
  camY: number,
  camZ: number,
  screenWidth: number,
  groundY: number,
  size: number,
): { left: number; top: number; persp: number } {
  "worklet";
  const relZ = relativeZ(worldZ, camZ);
  const persp = perspective(relZ);
  const left = screenWidth / 2 + (worldX - camX) * persp - size / 2;
  const depthLift = (1 - Math.min(1.4, persp)) * 70;
  const top = groundY + depthLift - camY * persp * 0.25 - size * 0.88;
  return { left, top, persp };
}
