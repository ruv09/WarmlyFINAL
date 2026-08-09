import { ImageSourcePropType } from "react-native";
import { TreeSpecies } from "../types";

export interface SpeciesVisual {
  species: TreeSpecies;
  labelRu: string;
  /** Относительная высота на карте леса. */
  heightScale: number;
  /** PNG-иллюстрация в фас (прозрачный фон). */
  image: ImageSourcePropType;
}

/**
 * Каталог видов: мягкие пастельные PNG из assets/trees/.
 * Имена файлов — по гайду (cherry.png для сакуры).
 */
export const TREE_SPECIES_CATALOG: SpeciesVisual[] = [
  {
    species: "oak",
    labelRu: "Дуб",
    heightScale: 1.05,
    image: require("../../assets/trees/oak.png"),
  },
  {
    species: "birch",
    labelRu: "Берёза",
    heightScale: 1.1,
    image: require("../../assets/trees/birch.png"),
  },
  {
    species: "pine",
    labelRu: "Сосна",
    heightScale: 1.12,
    image: require("../../assets/trees/pine.png"),
  },
  {
    species: "spruce",
    labelRu: "Ель",
    heightScale: 1.15,
    image: require("../../assets/trees/spruce.png"),
  },
  {
    species: "maple",
    labelRu: "Клён",
    heightScale: 1,
    image: require("../../assets/trees/maple.png"),
  },
  {
    species: "linden",
    labelRu: "Липа",
    heightScale: 1,
    image: require("../../assets/trees/linden.png"),
  },
  {
    species: "sakura",
    labelRu: "Сакура",
    heightScale: 0.98,
    image: require("../../assets/trees/cherry.png"),
  },
  {
    species: "apple",
    labelRu: "Яблоня",
    heightScale: 0.95,
    image: require("../../assets/trees/apple.png"),
  },
  {
    species: "bush",
    labelRu: "Куст",
    heightScale: 0.72,
    image: require("../../assets/trees/bush.png"),
  },
  {
    species: "willow",
    labelRu: "Ива",
    heightScale: 1.08,
    image: require("../../assets/trees/willow.png"),
  },
  {
    species: "rowan",
    labelRu: "Рябина",
    heightScale: 0.96,
    image: require("../../assets/trees/rowan.png"),
  },
];

/** Старые id → актуальный вид (для уже сохранённых деревьев). */
const LEGACY_SPECIES_MAP: Record<string, TreeSpecies> = {
  cherry: "sakura",
  poplar: "birch",
  chestnut: "oak",
  seabuckthorn: "bush",
  aspen: "maple",
  alder: "linden",
  elm: "oak",
  juniper: "pine",
  cypress: "spruce",
  thuja: "spruce",
  magnolia: "sakura",
  dogwood: "sakura",
  viburnum: "rowan",
  plane: "oak",
  acacia: "bush",
  baobab: "oak",
  olive: "bush",
  bamboo: "birch",
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

export function getTreeImage(species: string): ImageSourcePropType {
  return getSpeciesVisual(species).image;
}
