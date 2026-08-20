import { Tree, TreePosition } from "../../types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/**
 * Каталог не карта: координаты больше не задают мир.
 * Оставляем стабильный scale для вариации размера в каталоге.
 */
export function placeNextTree(existing: Pick<Tree, "position">[]): TreePosition {
  const index = existing.length;
  const x = (hash01(`x:${index}`) - 0.5) * 80;
  const y = (hash01(`y:${index}`) - 0.5) * 24;
  return { x, y };
}

export function placementMeta(position: TreePosition): {
  depth: number;
  scale: number;
  layer: number;
} {
  const scale = 0.82 + hash01(`s:${position.x}:${position.y}`) * 0.28;
  return {
    depth: 0.55,
    layer: 3,
    scale: clamp(scale, 0.76, 1.18),
  };
}
