import { TreeSpecies } from "../../types";

export const CHUNK_SIZE = 520;

export type AmbientTree = {
  id: string;
  species: TreeSpecies;
  x: number;
  z: number;
  scale: number;
  variant: number;
};

const SPECIES: TreeSpecies[] = [
  "oak",
  "birch",
  "pine",
  "spruce",
  "maple",
  "linden",
  "sakura",
  "apple",
  "bush",
  "willow",
  "rowan",
];

function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function chunkIndexForZ(z: number): number {
  return Math.floor(Math.max(0, z) / CHUNK_SIZE);
}

/** Ближайшие чанки вокруг камеры — остальное не держим в памяти. */
export function visibleChunkIndices(camZ: number): number[] {
  const i = chunkIndexForZ(camZ);
  const start = Math.max(0, i - 1);
  const end = i + 4;
  const ids: number[] = [];
  for (let n = start; n <= end; n++) ids.push(n);
  return ids;
}

/**
 * Детерминированная генерация чанка. Один и тот же index
 * всегда даёт те же деревья — можно вернуться назад.
 */
export function generateChunk(index: number): AmbientTree[] {
  const seed = `warmly-chunk:${index}`;
  const count = 9 + Math.floor(hash01(`${seed}:count`) * 6);
  const trees: AmbientTree[] = [];

  for (let k = 0; k < count; k++) {
    const cluster = hash01(`${seed}:cl:${k}`) < 0.32 && k > 0 ? trees[trees.length - 1] : null;
    const species = SPECIES[Math.floor(hash01(`${seed}:sp:${k}`) * SPECIES.length)]!;
    const z = cluster
      ? cluster.z + 30 + hash01(`${seed}:cz:${k}`) * 50
      : index * CHUNK_SIZE + 36 + hash01(`${seed}:z:${k}`) * (CHUNK_SIZE - 72);
    const x = cluster
      ? cluster.x + (hash01(`${seed}:cx:${k}`) - 0.5) * 140
      : (hash01(`${seed}:x:${k}`) - 0.5) * 620 + (k % 5 === 0 ? 0 : (k % 2 === 0 ? -40 : 40));

    trees.push({
      id: `amb:${index}:${k}`,
      species,
      x,
      z: Math.max(index * CHUNK_SIZE + 8, Math.min((index + 1) * CHUNK_SIZE - 8, z)),
      scale: 0.72 + hash01(`${seed}:sc:${k}`) * 0.42,
      variant: hash01(`${seed}:v:${k}`) < 0.5 ? 1 : 2,
    });
  }

  return trees;
}

export function treesForCamera(camZ: number): AmbientTree[] {
  const chunks = visibleChunkIndices(camZ);
  const out: AmbientTree[] = [];
  for (const id of chunks) {
    out.push(...generateChunk(id));
  }
  return out;
}
