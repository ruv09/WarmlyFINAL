import { TreePosition } from "../../types";

const MIN_DISTANCE = 72;
const MAX_DISTANCE_FROM_ANCHOR = 170;
const MAX_ATTEMPTS_PER_ANCHOR = 32;
const MAX_ANCHOR_ROUNDS = 16;
/** Полоса «земли» — лес растёт вдоль горизонта, не кучей сверху. */
const MAX_ABS_Y = 160;

function distance(a: TreePosition, b: TreePosition): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isFarEnoughFromAll(candidate: TreePosition, existing: TreePosition[]): boolean {
  return existing.every((point) => distance(point, candidate) >= MIN_DISTANCE);
}

/**
 * Инкрементальное размещение вдоль горизонтальной полосы леса.
 */
export function placeNextTree(existingPositions: TreePosition[]): TreePosition {
  if (existingPositions.length === 0) {
    return { x: 0, y: 40 };
  }

  for (let anchorRound = 0; anchorRound < MAX_ANCHOR_ROUNDS; anchorRound++) {
    const anchor = existingPositions[Math.floor(Math.random() * existingPositions.length)];

    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_ANCHOR; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = MIN_DISTANCE + Math.random() * (MAX_DISTANCE_FROM_ANCHOR - MIN_DISTANCE);
      const candidate: TreePosition = {
        x: anchor.x + Math.cos(angle) * dist * 1.35,
        y: Math.max(-MAX_ABS_Y, Math.min(MAX_ABS_Y, anchor.y + Math.sin(angle) * dist * 0.55)),
      };
      if (isFarEnoughFromAll(candidate, existingPositions)) {
        return candidate;
      }
    }
  }

  const fallbackAnchor = existingPositions[Math.floor(Math.random() * existingPositions.length)];
  const angle = Math.random() * Math.PI * 2;
  return {
    x: fallbackAnchor.x + Math.cos(angle) * MAX_DISTANCE_FROM_ANCHOR * 1.6,
    y: Math.max(-MAX_ABS_Y, Math.min(MAX_ABS_Y, fallbackAnchor.y + Math.sin(angle) * 40)),
  };
}
