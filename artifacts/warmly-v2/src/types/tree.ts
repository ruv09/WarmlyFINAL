/**
 * Виды деревьев Warmly 2.0 — 12 силуэтов из арт-гайда.
 * Без стадий роста и без сезонных вариантов: каждая запись сразу
 * даёт полноценное дерево. См. constants/treeSpecies.ts.
 */
export type TreeSpecies =
  | "oak"
  | "birch"
  | "maple"
  | "linden"
  | "pine"
  | "apple"
  | "sakura"
  | "willow"
  | "rowan"
  | "poplar"
  | "chestnut"
  | "seabuckthorn";

/** Координаты в условных единицах мира леса (не пиксели экрана). */
export interface TreePosition {
  x: number;
  y: number;
}

/**
 * Дерево неизменно после создания — без роста и сезонов.
 */
export interface Tree {
  id: string;
  species: TreeSpecies;
  position: TreePosition;
  createdAt: string;
}
