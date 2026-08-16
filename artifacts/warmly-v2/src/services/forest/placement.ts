import { Tree, TreePosition } from "../../types";

/**
 * Естественная раскладка по 6 полосам глубины + редкие группы.
 * Позиции детерминированы от порядкового номера, без Math.random.
 */
const WORLD_MIN_X = -2600;
const WORLD_MAX_X = 2600;
const WORLD_MIN_Y = -240;
const WORLD_MAX_Y = 210;

const DEPTH_BANDS = [
  { minY: -240, maxY: -170, minDist: 150 },
  { minY: -170, maxY: -105, minDist: 170 },
  { minY: -105, maxY: -35, minDist: 200 },
  { minY: -35, maxY: 45, minDist: 230 },
  { minY: 45, maxY: 120, minDist: 265 },
  { minY: 120, maxY: 210, minDist: 310 },
] as const;

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

function distance(a: TreePosition, b: TreePosition): number {
  return Math.hypot(a.x - b.x, (a.y - b.y) * 1.7);
}

function isFarEnough(
  candidate: TreePosition,
  existing: TreePosition[],
  minDist: number,
): boolean {
  return existing.every((point) => distance(point, candidate) >= minDist);
}

function slotCenterX(index: number): number {
  if (index === 0) return 40;
  const ring = Math.ceil(index / 2);
  const side = index % 2 === 1 ? -1 : 1;
  const stagger = (ring % 3) * 28;
  return side * (ring * 340 + stagger);
}

function pickBandIndex(index: number): number {
  if (index === 0) return 3;
  if (index === 1) return 4;
  if (index === 2) return 2;
  const r = hash01(`layer:${index}`);
  if (r < 0.1) return 0;
  if (r < 0.24) return 1;
  if (r < 0.44) return 2;
  if (r < 0.68) return 3;
  if (r < 0.88) return 4;
  return 5;
}

function tryCluster(
  existing: TreePosition[],
  bandIndex: number,
  seed: string,
): TreePosition | null {
  if (existing.length < 2 || hash01(`${seed}:cluster`) > 0.36) return null;
  const band = DEPTH_BANDS[bandIndex];
  const neighbors = existing.filter((p) => p.y >= band.minY - 30 && p.y <= band.maxY + 30);
  if (neighbors.length === 0) return null;
  const anchor = neighbors[Math.floor(hash01(`${seed}:anchor`) * neighbors.length)]!;
  const angle = hash01(`${seed}:ang`) * Math.PI * 2;
  const dist = 70 + hash01(`${seed}:dist`) * 90;
  return {
    x: clamp(anchor.x + Math.cos(angle) * dist, WORLD_MIN_X, WORLD_MAX_X),
    y: clamp(anchor.y + Math.sin(angle) * dist * 0.42, band.minY, band.maxY),
  };
}

export function placeNextTree(existing: Pick<Tree, "position">[]): TreePosition {
  const existingPositions = existing.map((tree) => tree.position);
  const index = existingPositions.length;
  const bandIndex = pickBandIndex(index);
  const band = DEPTH_BANDS[bandIndex];
  const minDist = band.minDist;

  const clustered = tryCluster(existingPositions, bandIndex, `n:${index}`);
  if (clustered && isFarEnough(clustered, existingPositions, minDist * 0.72)) {
    return clustered;
  }

  for (let pass = 0; pass < 28; pass++) {
    const slotIndex = index + pass;
    const useBand = DEPTH_BANDS[(bandIndex + (pass % 3)) % DEPTH_BANDS.length];
    const baseX = slotCenterX(slotIndex);
    const jitter = (hash01(`slot:${slotIndex}:${pass}`) - 0.5) * 120;
    const yJitter = hash01(`y:${slotIndex}:${pass}`);
    const candidate: TreePosition = {
      x: clamp(baseX + jitter, WORLD_MIN_X, WORLD_MAX_X),
      y: useBand.minY + yJitter * (useBand.maxY - useBand.minY),
    };
    if (isFarEnough(candidate, existingPositions, useBand.minDist)) {
      return candidate;
    }
  }

  let best: TreePosition = { x: 180, y: 20 };
  let bestScore = -Infinity;
  for (let i = 0; i < 96; i++) {
    const useBand = DEPTH_BANDS[i % DEPTH_BANDS.length];
    const candidate: TreePosition = {
      x: WORLD_MIN_X + (i / 96) * (WORLD_MAX_X - WORLD_MIN_X) + (hash01(`f${i}`) - 0.5) * 50,
      y: useBand.minY + hash01(`fy${i}`) * (useBand.maxY - useBand.minY),
    };
    const min =
      existingPositions.length === 0
        ? useBand.minDist
        : Math.min(...existingPositions.map((p) => distance(p, candidate)));
    if (min > bestScore) {
      bestScore = min;
      best = candidate;
    }
  }
  return best;
}

export function placementMeta(position: TreePosition): { depth: number; scale: number; layer: number } {
  const depth = clamp((position.y - WORLD_MIN_Y) / (WORLD_MAX_Y - WORLD_MIN_Y), 0, 1);
  const layer = Math.round(depth * 5);
  const scale = 0.8 + depth * 0.3 + (hash01(`s:${position.x}:${position.y}`) - 0.5) * 0.08;
  return { depth, layer, scale: clamp(scale, 0.74, 1.22) };
}

export const FOREST_WORLD = {
  minX: WORLD_MIN_X,
  maxX: WORLD_MAX_X,
  minY: WORLD_MIN_Y,
  maxY: WORLD_MAX_Y,
};
