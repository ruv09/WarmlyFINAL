/**
 * Виды деревьев — см. constants/treeSpecies.ts для визуального
 * профиля каждого вида. Список специально не завязан на MoodId:
 * требование "все деревья должны быть разными" и "не повторять вид
 * подряд" несовместимо с жёсткой связью настроение -> вид.
 */
export type TreeSpecies =
  | "oak"
  | "birch"
  | "maple"
  | "linden"
  | "pine"
  | "apple"
  | "sakura"
  | "rowan"
  | "willow"
  | "poplar"
  | "aspen"
  | "chestnut"
  | "alder"
  | "elm"
  | "spruce"
  | "juniper"
  | "cypress"
  | "thuja"
  | "magnolia"
  | "dogwood"
  | "viburnum"
  | "plane"
  | "acacia"
  | "baobab"
  | "olive"
  | "bamboo"
  | "ginkgo"
  | "jacaranda";

/** Координаты в условных единицах мира леса (не пиксели экрана —
 *  экранные координаты вычисляются из этих при отрисовке, с учётом
 *  текущего панорамирования/зума). */
export interface TreePosition {
  x: number;
  y: number;
}

/**
 * Дерево. Версия 2: механика роста полностью отменена — дерево
 * не имеет стадий и не меняется со временем. Каждая запись сразу
 * создаёт полностью выросшее дерево.
 */
export interface Tree {
  id: string;
  species: TreeSpecies;
  /** Постоянная позиция в мире, вычисляется один раз при создании
   *  (services/forest/placement.ts) и больше не пересчитывается. */
  position: TreePosition;
  createdAt: string;
}
