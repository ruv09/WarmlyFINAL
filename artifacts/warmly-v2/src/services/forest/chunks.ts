import { TreeSpecies } from "../../types";

export const CHUNK_SIZE = 560;

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

export function visibleChunkIndices(camZ: number): number[] {
  const i = chunkIndexForZ(camZ);
  const start = Math.max(0, i - 1);
  const end = i + 4;
  const ids: number[] = [];
  for (let n = start; n <= end; n++) ids.push(n);
  return ids;
}

/**
 * Деревья по сторонам тропы: при приближении камеры они
 * уезжают к краям кадра (dolly), а не растут в центре (zoom).
 */
export function generateChunk(index: number): AmbientTree[] {
  const seed = `warmly-chunk:${index}`;
  const clearing = hash01(`${seed}:clearing`) < 0.14;
  const count = clearing
    ? 4 + Math.floor(hash01(`${seed}:count`) * 3)
    : 7 + Math.floor(hash01(`${seed}:count`) * 8);
  const trees: AmbientTree[] = [];

  for (let k = 0; k < count; k++) {
    const cluster = hash01(`${seed}:cl:${k}`) < 0.28 && k > 0 ? trees[trees.length - 1] : null;
    const species = SPECIES[Math.floor(hash01(`${seed}:sp:${k}`) * SPECIES.length)]!;
    const z = cluster
      ? cluster.z + 24 + hash01(`${seed}:cz:${k}`) * 70
      : index * CHUNK_SIZE + 40 + hash01(`${seed}:z:${k}`) * (CHUNK_SIZE - 80);

    const side = hash01(`${seed}:side:${k}`) < 0.5 ? -1 : 1;
    let x = cluster
      ? cluster.x + (hash01(`${seed}:cx:${k}`) - 0.5) * 160
      : side * (140 + hash01(`${seed}:x:${k}`) * 720);

    if (Math.abs(x) < 90) x = side * (110 + hash01(`${seed}:gap:${k}`) * 80);

    trees.push({
      id: `amb:${index}:${k}`,
      species,
      x,
      z: Math.max(index * CHUNK_SIZE + 10, Math.min((index + 1) * CHUNK_SIZE - 10, z)),
      scale: 0.7 + hash01(`${seed}:sc:${k}`) * 0.48,
      variant: hash01(`${seed}:v:${k}`) < 0.5 ? 1 : 2,
    });
  }

  return trees;
}

export function treesForCamera(camZ: number): AmbientTree[] {
  const out: AmbientTree[] = [];
  for (const id of visibleChunkIndices(camZ)) {
    out.push(...generateChunk(id));
  }
  return out;
}
