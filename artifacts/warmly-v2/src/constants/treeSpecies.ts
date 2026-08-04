import { TreeSpecies } from "../types";

/**
 * Категория формы кроны. Несколько видов переиспользуют одну геометрию
 * с разной палитрой — визуальное разнообразие без раздувания отрисовки.
 */
export type CanopyShape = "conical" | "round" | "drooping" | "clustered" | "blossom" | "wideWarm";

export interface SpeciesVisual {
  species: TreeSpecies;
  labelRu: string;
  canopyShape: CanopyShape;
  /** Светлая тема — «Природный уют». */
  canopyColor: string;
  canopyHighlight: string;
  canopyShade: string;
  trunkColor: string;
  /** Тёмная тема — «Тёплый вечер»: приглушённые, не инвертированные тона. */
  canopyColorDark: string;
  canopyHighlightDark: string;
  canopyShadeDark: string;
  trunkColorDark: string;
  /** Мелкие акценты (ягоды/цветы) — не у всех видов. */
  accentColor?: string;
  accentColorDark?: string;
  /** Огоньки на кроне в тёмной теме. */
  hasEveningLights?: boolean;
}

/**
 * Акварельная палитра: мягкие пастельные кроны, тёплые стволы.
 * Отдельные тёмные тона — вечерняя атмосфера, не инверсия светлой.
 */
export const TREE_SPECIES_CATALOG: SpeciesVisual[] = [
  {
    species: "birch",
    labelRu: "Берёза",
    canopyShape: "drooping",
    canopyColor: "#C5D4B4",
    canopyHighlight: "#E2EBD4",
    canopyShade: "#A8B896",
    trunkColor: "#EDE6D8",
    canopyColorDark: "#6B7A68",
    canopyHighlightDark: "#8A9A84",
    canopyShadeDark: "#4E5A4C",
    trunkColorDark: "#C8BFAE",
    hasEveningLights: true,
  },
  {
    species: "oak",
    labelRu: "Дуб",
    canopyShape: "round",
    canopyColor: "#7C9473",
    canopyHighlight: "#A3B894",
    canopyShade: "#5F7358",
    trunkColor: "#7A6349",
    canopyColorDark: "#4A5E4E",
    canopyHighlightDark: "#6A8070",
    canopyShadeDark: "#334238",
    trunkColorDark: "#5A4636",
    hasEveningLights: true,
  },
  {
    species: "maple",
    labelRu: "Клён",
    canopyShape: "wideWarm",
    canopyColor: "#D08A5A",
    canopyHighlight: "#E8B08A",
    canopyShade: "#B06A42",
    trunkColor: "#6E5642",
    canopyColorDark: "#8B5A3C",
    canopyHighlightDark: "#A87250",
    canopyShadeDark: "#6A4030",
    trunkColorDark: "#4A3A2E",
    hasEveningLights: true,
  },
  {
    species: "linden",
    labelRu: "Липа",
    canopyShape: "round",
    canopyColor: "#A8BC78",
    canopyHighlight: "#C8D69A",
    canopyShade: "#84985A",
    trunkColor: "#7A6349",
    canopyColorDark: "#5A6A48",
    canopyHighlightDark: "#7A8A64",
    canopyShadeDark: "#3E4A32",
    trunkColorDark: "#5A4636",
    hasEveningLights: true,
  },
  {
    species: "pine",
    labelRu: "Сосна",
    canopyShape: "conical",
    canopyColor: "#6F8B72",
    canopyHighlight: "#95AD96",
    canopyShade: "#516654",
    trunkColor: "#8B5E3C",
    canopyColorDark: "#3F5548",
    canopyHighlightDark: "#5A7262",
    canopyShadeDark: "#2A3A32",
    trunkColorDark: "#5C4030",
    hasEveningLights: true,
  },
  {
    species: "spruce",
    labelRu: "Ель",
    canopyShape: "conical",
    canopyColor: "#4F6B57",
    canopyHighlight: "#6F8B74",
    canopyShade: "#3A5042",
    trunkColor: "#5C4A3A",
    canopyColorDark: "#2F4238",
    canopyHighlightDark: "#4A6354",
    canopyShadeDark: "#1E2C26",
    trunkColorDark: "#3E3228",
    hasEveningLights: true,
  },
  {
    species: "rowan",
    labelRu: "Рябина",
    canopyShape: "clustered",
    canopyColor: "#8FA97E",
    canopyHighlight: "#B0C4A0",
    canopyShade: "#6E8660",
    trunkColor: "#7A6349",
    canopyColorDark: "#4E6448",
    canopyHighlightDark: "#6E8464",
    canopyShadeDark: "#364432",
    trunkColorDark: "#5A4636",
    accentColor: "#C1463D",
    accentColorDark: "#D4785A",
    hasEveningLights: true,
  },
  {
    species: "apple",
    labelRu: "Яблоня",
    canopyShape: "blossom",
    canopyColor: "#E4C7C2",
    canopyHighlight: "#F2E0DC",
    canopyShade: "#C8A8A4",
    trunkColor: "#6E5642",
    canopyColorDark: "#7A5A5E",
    canopyHighlightDark: "#9A7A7E",
    canopyShadeDark: "#5A4044",
    trunkColorDark: "#4A3A2E",
    accentColor: "#B9503F",
    accentColorDark: "#E8A070",
    hasEveningLights: true,
  },
  {
    species: "sakura",
    labelRu: "Сакура",
    canopyShape: "blossom",
    canopyColor: "#E8B9C7",
    canopyHighlight: "#F6D8E2",
    canopyShade: "#D09AAB",
    trunkColor: "#5C4A3A",
    canopyColorDark: "#7A5A6A",
    canopyHighlightDark: "#9A7A88",
    canopyShadeDark: "#5A3E4C",
    trunkColorDark: "#3E3228",
    accentColor: "#F6E4EA",
    accentColorDark: "#E8C4D0",
    hasEveningLights: true,
  },
  {
    species: "willow",
    labelRu: "Ива",
    canopyShape: "drooping",
    canopyColor: "#A9B99A",
    canopyHighlight: "#C8D4BA",
    canopyShade: "#87967A",
    trunkColor: "#7A6349",
    canopyColorDark: "#5A6A58",
    canopyHighlightDark: "#7A8A74",
    canopyShadeDark: "#3E4A3C",
    trunkColorDark: "#5A4636",
    hasEveningLights: true,
  },
];

const bySpecies = new Map(TREE_SPECIES_CATALOG.map((visual) => [visual.species, visual]));

export function getSpeciesVisual(species: TreeSpecies): SpeciesVisual {
  return bySpecies.get(species) ?? TREE_SPECIES_CATALOG[0];
}
