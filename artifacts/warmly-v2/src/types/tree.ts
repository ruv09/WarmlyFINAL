/**
 * Виды деревьев Warmly 2.0 — PNG-иллюстрации в фас.
 * Без стадий роста и сезонных вариантов.
 */
export type TreeSpecies =
  | "oak"
  | "birch"
  | "pine"
  | "spruce"
  | "maple"
  | "linden"
  | "sakura"
  | "apple"
  | "bush"
  | "willow"
  | "rowan";

export interface TreePosition {
  x: number;
  y: number;
}

export interface Tree {
  id: string;
  species: TreeSpecies;
  position: TreePosition;
  createdAt: string;
}
