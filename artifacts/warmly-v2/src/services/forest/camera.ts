/**
 * Камера 2.5D-леса. Формулы помечаются worklet, чтобы
 * Reanimated считал проекцию на UI-потоке без лагов.
 */

export const MIN_ZOOM = 0.68;
export const MAX_ZOOM = 1.9;
export const MID_PARALLAX = 0.82;
export const Y_SCREEN_FACTOR = 0.64;
export const TREE_BASE_SIZE = 216;
export const CULLING_MARGIN = 280;

export function clampZoom(zoom: number): number {
  "worklet";
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
}

/** Чем ближе дерево (depth → 1), тем сильнее оно едет с камерой. */
export function parallaxForDepth(depth: number): number {
  "worklet";
  return 0.26 + depth * 1.2;
}

/**
 * При приближении ближние деревья крупнеют и мягко уходят
 * (scale ↑, opacity ↓) — ощущение «прохода сквозь лес».
 */
export function nearPass(depth: number, zoom: number): { opacity: number; boost: number } {
  "worklet";
  const zoomT = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);
  const proximity = depth * zoomT;
  if (proximity < 0.55) {
    return { opacity: 1, boost: 1 };
  }
  const t = Math.min(1, (proximity - 0.55) / 0.45);
  return {
    opacity: 1 - t,
    boost: 1 + t * 0.9,
  };
}

export function projectTreeScreen(
  worldX: number,
  worldY: number,
  depth: number,
  camX: number,
  camY: number,
  zoom: number,
  screenWidth: number,
  groundY: number,
  size: number,
): { left: number; top: number } {
  "worklet";
  const p = parallaxForDepth(depth);
  const left = screenWidth / 2 + (worldX - camX) * p * zoom - size / 2;
  const top = groundY + (worldY - camY) * Y_SCREEN_FACTOR * p * zoom - size * 0.88;
  return { left, top };
}

export function cameraPanBounds(zoom: number, worldMinX: number, worldMaxX: number) {
  "worklet";
  const span = Math.max(420, ((worldMaxX - worldMinX) * 0.42) / Math.max(0.75, zoom));
  return { minX: -span, maxX: span, minY: -90 / zoom, maxY: 70 / zoom };
}
