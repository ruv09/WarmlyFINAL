import { Tree, TreePosition } from "../../types";

/**
 * Личный лес пользователя — коридор вглубь (Z), узкий по X.
 * Pinch двигает камеру по Z; pan лишь слегка смотрит в стороны.
 */
const CORRIDOR_X = 300;

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

function nextWorldZ(existing: Pick<Tree, "worldZ">[]): number {
  const zs = existing.map((t) => t.worldZ ?? 0);
  const last = zs.length === 0 ? 80 : Math.max(...zs);
  const index = zs.length;
  const gap = 150 + hash01(`gap:${index}`) * 140;
  return last + gap;
}

/**
 * Следующее дерево пользователя — дальше по тропе, со смещением в сторону
 * и редкими группами. Без Math.random.
 */
export function placeNextTree(existing: Pick<Tree, "position" | "worldZ">[]): TreePosition & { z: number } {
  const index = existing.length;
  const z = nextWorldZ(existing);
  const side = hash01(`side:${index}`) < 0.5 ? -1 : 1;
  const cluster = index > 0 && hash01(`cl:${index}`) < 0.34;
  const prev = existing[existing.length - 1];
  const x = cluster && prev
    ? clamp(prev.position.x + side * (50 + hash01(`cx:${index}`) * 70), -CORRIDOR_X, CORRIDOR_X)
    : clamp(side * (40 + hash01(`x:${index}`) * 240), -CORRIDOR_X, CORRIDOR_X);
  const y = (hash01(`y:${index}`) - 0.5) * 24;
  return { x, y, z };
}

export function placementMeta(position: TreePosition & { z?: number }): {
  depth: number;
  scale: number;
  layer: number;
  worldZ: number;
} {
  const worldZ = position.z ?? 120;
  const scale = 0.82 + hash01(`s:${position.x}:${worldZ}`) * 0.28;
  return {
    worldZ,
    depth: 0.55,
    layer: 3,
    scale: clamp(scale, 0.76, 1.18),
  };
}

export const FOREST_WORLD = {
  minX: -CORRIDOR_X,
  maxX: CORRIDOR_X,
  minY: 0,
  maxY: 0,
};
