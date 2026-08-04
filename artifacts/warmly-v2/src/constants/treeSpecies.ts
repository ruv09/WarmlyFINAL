import { TreeSpecies } from "../types";

/**
 * Категория формы кроны. Не у каждого вида дерева — своя уникальная
 * функция отрисовки; вместо этого несколько видов могут переиспользовать
 * одну и ту же геометрическую категорию с разным цветом — этого
 * достаточно для визуального разнообразия и держит код компактным.
 * Добавление нового вида дерева в будущем — это одна запись в
 * TREE_SPECIES_CATALOG, с переиспользованием существующей категории
 * формы или (реже) с добавлением новой в components/tree/TreeIllustration.tsx.
 */
export type CanopyShape = "conical" | "round" | "drooping" | "clustered" | "blossom" | "wideWarm";

export interface SpeciesVisual {
  species: TreeSpecies;
  labelRu: string;
  canopyShape: CanopyShape;
  canopyColor: string;
  trunkColor: string;
  /** Мелкие акценты (ягоды/цветы) — не у всех видов. */
  accentColor?: string;
}

/**
 * Приглушённая, тёплая, акварельная палитра — в духе присланного
 * художественного референса (без копирования, см. /FOREST.md).
 */
export const TREE_SPECIES_CATALOG: SpeciesVisual[] = [
  { species: "birch", labelRu: "Берёза", canopyShape: "drooping", canopyColor: "#B9C9A9", trunkColor: "#E4DECF" },
  { species: "oak", labelRu: "Дуб", canopyShape: "round", canopyColor: "#7C9473", trunkColor: "#7A6349" },
  { species: "maple", labelRu: "Клён", canopyShape: "wideWarm", canopyColor: "#C97B4A", trunkColor: "#6E5642" },
  { species: "linden", labelRu: "Липа", canopyShape: "round", canopyColor: "#9CAE6B", trunkColor: "#7A6349" },
  { species: "pine", labelRu: "Сосна", canopyShape: "conical", canopyColor: "#748C77", trunkColor: "#8B5E3C" },
  { species: "spruce", labelRu: "Ель", canopyShape: "conical", canopyColor: "#4F6B57", trunkColor: "#5C4A3A" },
  { species: "rowan", labelRu: "Рябина", canopyShape: "clustered", canopyColor: "#8FA97E", trunkColor: "#7A6349", accentColor: "#C1463D" },
  { species: "apple", labelRu: "Яблоня", canopyShape: "blossom", canopyColor: "#E4C7C2", trunkColor: "#6E5642", accentColor: "#B9503F" },
  { species: "sakura", labelRu: "Сакура", canopyShape: "blossom", canopyColor: "#E8B9C7", trunkColor: "#5C4A3A", accentColor: "#F6E4EA" },
  { species: "willow", labelRu: "Ива", canopyShape: "drooping", canopyColor: "#A9B99A", trunkColor: "#7A6349" },
];

const bySpecies = new Map(TREE_SPECIES_CATALOG.map((visual) => [visual.species, visual]));

export function getSpeciesVisual(species: TreeSpecies): SpeciesVisual {
  return bySpecies.get(species) ?? TREE_SPECIES_CATALOG[0];
}
