import { Tree, TreePosition } from "../../types";

/**
 * Раскладка «панорама»: деревья сажаются в слоты вдоль широкой сцены.
 * Важно: мировые X ≈ пиксели на экране, а дерево ~220px —
 * поэтому MIN_DISTANCE должен быть больше ширины кроны.
 */
const MIN_DISTANCE = 260;
const WORLD_MIN_X = -1400;
const WORLD_MAX_X = 1400;
const WORLD_MIN_Y = -180;
const WORLD_MAX_Y = 160;

/** Слоты глубины (экранные полосы), чтобы не сваливаться в одну линию. */
const DEPTH_BANDS = [
  { minY: -180, maxY: -80, weight: 0.3 }, // даль
  { minY: -80, maxY: 40, weight: 0.4 }, // середина
  { minY: 40, maxY: 160, weight: 0.3 }, // перед
] as const;

function distance(a: TreePosition, b: TreePosition): number {
  // По X почти 1:1 с экраном; по Y чуть сильнее, чтобы полосы не слипались.
  return Math.hypot(a.x - b.x, (a.y - b.y) * 1.6);
}

function isFarEnough(candidate: TreePosition, existing: TreePosition[]): boolean {
  return existing.every((point) => distance(point, candidate) >= MIN_DISTANCE);
}

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
 * Детерминированные «карманы» посадки: чередование сторон от центра наружу.
 * Так первые деревья видны на старте, дальше лес уходит в панораму.
 */
function slotCenterX(index: number): number {
  if (index === 0) return 0;
  const ring = Math.ceil(index / 2);
  const side = index % 2 === 1 ? -1 : 1;
  return side * ring * 300;
}

function pickBand(index: number): (typeof DEPTH_BANDS)[number] {
  return DEPTH_BANDS[index % DEPTH_BANDS.length];
}

function depthFromY(y: number): number {
  return clamp((y - WORLD_MIN_Y) / (WORLD_MAX_Y - WORLD_MIN_Y), 0, 1);
}

/**
 * Следующее дерево — в свободный слот панорамы, без кучи в центре.
 */
export function placeNextTree(existing: Pick<Tree, "position">[]): TreePosition {
  const existingPositions = existing.map((tree) => tree.position);
  const index = existingPositions.length;

  // Сначала пробуем канонический слот для этого порядкового номера.
  for (let pass = 0; pass < 24; pass++) {
    const slotIndex = index + pass;
    const band = pickBand(slotIndex);
    const baseX = slotCenterX(slotIndex);
    const jitter = (hash01(`slot:${slotIndex}:${pass}`) - 0.5) * 90;
    const yJitter = hash01(`y:${slotIndex}:${pass}`);
    const candidate: TreePosition = {
      x: clamp(baseX + jitter, WORLD_MIN_X, WORLD_MAX_X),
      y: band.minY + yJitter * (band.maxY - band.minY),
    };
    if (isFarEnough(candidate, existingPositions)) {
      return candidate;
    }
  }

  // Запас: ищем максимальную дыру по всей ширине.
  let best: TreePosition = { x: WORLD_MAX_X * 0.6, y: 20 };
  let bestScore = -Infinity;
  for (let i = 0; i < 80; i++) {
    const band = DEPTH_BANDS[i % DEPTH_BANDS.length];
    const candidate: TreePosition = {
      x: WORLD_MIN_X + (i / 80) * (WORLD_MAX_X - WORLD_MIN_X) + (hash01(`f${i}`) - 0.5) * 40,
      y: band.minY + hash01(`fy${i}`) * (band.maxY - band.minY),
    };
    const minDist =
      existingPositions.length === 0
        ? MIN_DISTANCE
        : Math.min(...existingPositions.map((p) => distance(p, candidate)));
    if (minDist > bestScore) {
      bestScore = minDist;
      best = candidate;
    }
  }
  return best;
}

export function placementMeta(position: TreePosition): { depth: number; scale: number } {
  const depth = depthFromY(position.y);
  const scale = 0.86 + depth * 0.22 + (hash01(`s:${position.x}:${position.y}`) - 0.5) * 0.06;
  return { depth, scale: clamp(scale, 0.78, 1.18) };
}

export const FOREST_WORLD = {
  minX: WORLD_MIN_X,
  maxX: WORLD_MAX_X,
  minY: WORLD_MIN_Y,
  maxY: WORLD_MAX_Y,
};
