import { TREE_SPECIES_CATALOG } from "../../constants/treeSpecies";
import { TreeSpecies } from "../../types";

/**
 * Выбирает вид дерева так, чтобы лес становился разнообразнее.
 * Не зависит от настроения записи. Без стадий роста.
 */
export function assignNextSpecies(recentSpecies: TreeSpecies[] = []): TreeSpecies {
  const all = TREE_SPECIES_CATALOG.map((visual) => visual.species);
  const recent = recentSpecies.slice(-3);
  const avoid = new Set(recent);

  let candidates = all.filter((species) => !avoid.has(species));
  if (candidates.length === 0) {
    const last = recent[recent.length - 1];
    candidates = last && all.length > 1 ? all.filter((species) => species !== last) : all;
  }

  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}
