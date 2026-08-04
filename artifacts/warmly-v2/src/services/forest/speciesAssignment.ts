import { TREE_SPECIES_CATALOG } from "../../constants/treeSpecies";
import { TreeSpecies } from "../../types";

/**
 * Выбирает вид дерева для новой записи. Сознательно не зависит от
 * настроения записи (MoodId) — настроение отображается в карточке
 * дерева при нажатии, но не должно определять вид дерева: иначе
 * повторяющееся настроение давало бы одинаковый вид дерева, что
 * прямо противоречит требованию "все деревья должны быть разными".
 * Единственное правило — не повторять непосредственно предыдущий
 * вид без необходимости.
 */
export function assignNextSpecies(previousSpecies: TreeSpecies | undefined): TreeSpecies {
  const all = TREE_SPECIES_CATALOG.map((visual) => visual.species);
  const candidates =
    previousSpecies && all.length > 1 ? all.filter((species) => species !== previousSpecies) : all;
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}
