import { Tree, TreePosition } from "../../types";

/** Минимальное расстояние между деревьями в мировых единицах. */
const MIN_DISTANCE = 150;
const WORLD_MIN_X = -640;
const WORLD_MAX_X = 640;
/** Дальний план (меньше) → передний план (больше). */
const WORLD_MIN_Y = -240;
const WORLD_MAX_Y = 180;

const DEPTH_BANDS = [
  { minY: -210, maxY: -90, weight: 0.28 }, // даль
  { minY: -90, maxY: 40, weight: 0.44 }, // середина
  { minY: 40, maxY: 170, weight: 0.28 }, // перед
] as const;

function distance(a: TreePosition, b: TreePosition): number {
  // Горизонталь важнее — лес растянут вдоль горизонта.
  return Math.hypot(a.x - b.x, (a.y - b.y) * 1.35);
}

function isFarEnough(candidate: TreePosition, existing: TreePosition[]): boolean {
  return existing.every((point) => distance(point, candidate) >= MIN_DISTANCE);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pickDepthBand(existingCount: number): (typeof DEPTH_BANDS)[number] {
  // Первые деревья разносятся по полосам, чтобы не копиться в центре.
  if (existingCount === 0) return DEPTH_BANDS[1];
  if (existingCount === 1) return DEPTH_BANDS[0];
  if (existingCount === 2) return DEPTH_BANDS[2];

  const roll = Math.random();
  let acc = 0;
  for (const band of DEPTH_BANDS) {
    acc += band.weight;
    if (roll <= acc) return band;
  }
  return DEPTH_BANDS[1];
}

function depthFromY(y: number): number {
  return clamp((y - WORLD_MIN_Y) / (WORLD_MAX_Y - WORLD_MIN_Y), 0, 1);
}

/**
 * Контролируемое размещение: разные X/Y, разные глубины, без кучи в центре.
 */
export function placeNextTree(existing: Pick<Tree, "position">[]): TreePosition {
  const existingPositions = existing.map((tree) => tree.position);

  if (existingPositions.length === 0) {
    return { x: -40, y: 55 };
  }

  // Предпочитаем свободные «карманы» по X, а не окрестность уже стоящих.
  for (let attempt = 0; attempt < 96; attempt++) {
    const band = pickDepthBand(existingPositions.length);
    const xSlots = 7;
    const slot = attempt % xSlots;
    const slotCenter =
      WORLD_MIN_X + ((slot + 0.5) / xSlots) * (WORLD_MAX_X - WORLD_MIN_X);
    const jitterX = (Math.random() - 0.5) * ((WORLD_MAX_X - WORLD_MIN_X) / xSlots) * 0.85;
    const candidate: TreePosition = {
      x: clamp(slotCenter + jitterX, WORLD_MIN_X, WORLD_MAX_X),
      y: band.minY + Math.random() * (band.maxY - band.minY),
    };
    if (isFarEnough(candidate, existingPositions)) {
      return candidate;
    }
  }

  // Запасной путь: отталкивание от ближайшего соседа в свободную сторону.
  let best: TreePosition | null = null;
  let bestScore = -Infinity;
  for (let i = 0; i < 48; i++) {
    const band = pickDepthBand(existingPositions.length);
    const candidate: TreePosition = {
      x: WORLD_MIN_X + Math.random() * (WORLD_MAX_X - WORLD_MIN_X),
      y: band.minY + Math.random() * (band.maxY - band.minY),
    };
    const minDist = Math.min(...existingPositions.map((p) => distance(p, candidate)));
    const centerPenalty = Math.abs(candidate.x) * 0.02;
    const score = minDist - centerPenalty;
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best ?? { x: WORLD_MAX_X * 0.7, y: 20 };
}

export function placementMeta(position: TreePosition): { depth: number; scale: number } {
  const depth = depthFromY(position.y);
  // Ближе — чуть крупнее; плюс лёгкая вариация.
  const scale = 0.82 + depth * 0.28 + (Math.random() - 0.5) * 0.08;
  return { depth, scale: clamp(scale, 0.72, 1.22) };
}
