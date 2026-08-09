import { TreeSpecies } from "../types";

/**
 * Силуэт в фас — мягкие «пушистые» комки кроны из арт-гайда Warmily 2.0.
 * Без сезонных/ростовых вариантов.
 */
export type CanopyShape =
  | "oakClumps"
  | "birchTall"
  | "mapleJagged"
  | "lindenRound"
  | "pineTiered"
  | "appleFruit"
  | "sakuraFluff"
  | "willowWeep"
  | "rowanBerries"
  | "poplarSlim"
  | "chestnutSpikes"
  | "seabuckthornSparse";

export interface SpeciesVisual {
  species: TreeSpecies;
  labelRu: string;
  canopyShape: CanopyShape;
  heightScale: number;
  canopyColor: string;
  canopyHighlight: string;
  canopyShade: string;
  trunkColor: string;
  canopyColorDark: string;
  canopyHighlightDark: string;
  canopyShadeDark: string;
  trunkColorDark: string;
  accentColor?: string;
  accentColorDark?: string;
}

function s(visual: SpeciesVisual): SpeciesVisual {
  return visual;
}

/** 12 видов из раздела 1 гайда — пастель, мягкое свечение. */
export const TREE_SPECIES_CATALOG: SpeciesVisual[] = [
  s({
    species: "oak",
    labelRu: "Дуб",
    canopyShape: "oakClumps",
    heightScale: 1.05,
    canopyColor: "#8FB87A",
    canopyHighlight: "#C5E0A8",
    canopyShade: "#6A9458",
    trunkColor: "#8B6A4A",
    canopyColorDark: "#4E6848",
    canopyHighlightDark: "#7A9A70",
    canopyShadeDark: "#344832",
    trunkColorDark: "#5A4030",
  }),
  s({
    species: "birch",
    labelRu: "Берёза",
    canopyShape: "birchTall",
    heightScale: 1.12,
    canopyColor: "#B8D49A",
    canopyHighlight: "#E0F0C4",
    canopyShade: "#8FB878",
    trunkColor: "#F4F0E8",
    canopyColorDark: "#6A7A58",
    canopyHighlightDark: "#9AAA74",
    canopyShadeDark: "#4A5840",
    trunkColorDark: "#E0D8CC",
  }),
  s({
    species: "maple",
    labelRu: "Клён",
    canopyShape: "mapleJagged",
    heightScale: 1,
    canopyColor: "#E89A58",
    canopyHighlight: "#F6C488",
    canopyShade: "#C07038",
    trunkColor: "#7A5A40",
    canopyColorDark: "#A06038",
    canopyHighlightDark: "#C88858",
    canopyShadeDark: "#6A4024",
    trunkColorDark: "#4A3828",
  }),
  s({
    species: "linden",
    labelRu: "Липа",
    canopyShape: "lindenRound",
    heightScale: 0.98,
    canopyColor: "#A8D078",
    canopyHighlight: "#D4F0A8",
    canopyShade: "#7AAA58",
    trunkColor: "#8A6A48",
    canopyColorDark: "#5A7A48",
    canopyHighlightDark: "#88A868",
    canopyShadeDark: "#3E5432",
    trunkColorDark: "#5A4634",
  }),
  s({
    species: "pine",
    labelRu: "Сосна",
    canopyShape: "pineTiered",
    heightScale: 1.15,
    canopyColor: "#6A9A72",
    canopyHighlight: "#98C4A0",
    canopyShade: "#4A7454",
    trunkColor: "#A87850",
    canopyColorDark: "#3A5544",
    canopyHighlightDark: "#5A7A64",
    canopyShadeDark: "#283C30",
    trunkColorDark: "#6A4830",
  }),
  s({
    species: "apple",
    labelRu: "Яблоня",
    canopyShape: "appleFruit",
    heightScale: 0.92,
    canopyColor: "#96C480",
    canopyHighlight: "#C4E8A8",
    canopyShade: "#6E9A5C",
    trunkColor: "#7A5A40",
    canopyColorDark: "#4E6848",
    canopyHighlightDark: "#7A9A6C",
    canopyShadeDark: "#364832",
    trunkColorDark: "#4A3828",
    accentColor: "#E86060",
    accentColorDark: "#E88870",
  }),
  s({
    species: "sakura",
    labelRu: "Сакура",
    canopyShape: "sakuraFluff",
    heightScale: 0.95,
    canopyColor: "#F2B8C8",
    canopyHighlight: "#FFE4EC",
    canopyShade: "#E090A8",
    trunkColor: "#7A5A48",
    canopyColorDark: "#8A5A6A",
    canopyHighlightDark: "#B88898",
    canopyShadeDark: "#5A3E4C",
    trunkColorDark: "#3E3228",
    accentColor: "#FFF0F4",
    accentColorDark: "#F0C8D4",
  }),
  s({
    species: "willow",
    labelRu: "Ива",
    canopyShape: "willowWeep",
    heightScale: 1.08,
    canopyColor: "#A8C888",
    canopyHighlight: "#D0E8B0",
    canopyShade: "#84A864",
    trunkColor: "#8A6A48",
    canopyColorDark: "#5A6A50",
    canopyHighlightDark: "#849A74",
    canopyShadeDark: "#3E4A38",
    trunkColorDark: "#5A4634",
  }),
  s({
    species: "rowan",
    labelRu: "Рябина",
    canopyShape: "rowanBerries",
    heightScale: 0.96,
    canopyColor: "#92B878",
    canopyHighlight: "#C0DCA0",
    canopyShade: "#6E9458",
    trunkColor: "#7A5A40",
    canopyColorDark: "#4E6448",
    canopyHighlightDark: "#7A8E68",
    canopyShadeDark: "#364432",
    trunkColorDark: "#5A4634",
    accentColor: "#E04838",
    accentColorDark: "#E87858",
  }),
  s({
    species: "poplar",
    labelRu: "Тополь",
    canopyShape: "poplarSlim",
    heightScale: 1.22,
    canopyColor: "#88B878",
    canopyHighlight: "#B8E0A0",
    canopyShade: "#629858",
    trunkColor: "#8A6A48",
    canopyColorDark: "#4A6448",
    canopyHighlightDark: "#6E8A64",
    canopyShadeDark: "#324232",
    trunkColorDark: "#5A4030",
  }),
  s({
    species: "chestnut",
    labelRu: "Каштан",
    canopyShape: "chestnutSpikes",
    heightScale: 1,
    canopyColor: "#78A868",
    canopyHighlight: "#A8D090",
    canopyShade: "#548048",
    trunkColor: "#6A4A34",
    canopyColorDark: "#3E5A38",
    canopyHighlightDark: "#6A8A5C",
    canopyShadeDark: "#2A3E28",
    trunkColorDark: "#4A3224",
    accentColor: "#F8F4EC",
    accentColorDark: "#E8DCC8",
  }),
  s({
    species: "seabuckthorn",
    labelRu: "Облепиха",
    canopyShape: "seabuckthornSparse",
    heightScale: 0.88,
    canopyColor: "#A8B868",
    canopyHighlight: "#D0DC90",
    canopyShade: "#889448",
    trunkColor: "#8A6840",
    canopyColorDark: "#5A6440",
    canopyHighlightDark: "#88905C",
    canopyShadeDark: "#3C4430",
    trunkColorDark: "#5A4830",
    accentColor: "#F0A030",
    accentColorDark: "#E8A050",
  }),
];

/** Старые id из расширенного каталога → ближайший вид гайда. */
const LEGACY_SPECIES_MAP: Record<string, TreeSpecies> = {
  aspen: "maple",
  alder: "linden",
  elm: "oak",
  spruce: "pine",
  juniper: "pine",
  cypress: "poplar",
  thuja: "pine",
  magnolia: "sakura",
  dogwood: "sakura",
  viburnum: "rowan",
  plane: "oak",
  acacia: "seabuckthorn",
  baobab: "oak",
  olive: "seabuckthorn",
  bamboo: "poplar",
  ginkgo: "maple",
  jacaranda: "sakura",
};

const bySpecies = new Map(TREE_SPECIES_CATALOG.map((visual) => [visual.species, visual]));

export function resolveSpecies(species: string): TreeSpecies {
  if (bySpecies.has(species as TreeSpecies)) return species as TreeSpecies;
  return LEGACY_SPECIES_MAP[species] ?? "oak";
}

export function getSpeciesVisual(species: string): SpeciesVisual {
  return bySpecies.get(resolveSpecies(species)) ?? TREE_SPECIES_CATALOG[0];
}
