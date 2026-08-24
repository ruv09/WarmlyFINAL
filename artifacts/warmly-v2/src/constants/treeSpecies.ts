import { ImageSourcePropType } from "react-native";
import { TreeSpecies } from "../types";

export interface SpeciesVisual {
  species: TreeSpecies;
  labelRu: string;
  heightScale: number;
  image: ImageSourcePropType;
  imageDark: ImageSourcePropType;
  /** Ствол без круглой лужайки — только для сцены поляны. */
  imagePlanted: ImageSourcePropType;
  imagePlantedDark: ImageSourcePropType;
}

/**
 * Живописные акварельные спрайты из assets/trees/painted/
 * (каталог) и rooted/ (сцена дерева в поляне).
 */
export const TREE_SPECIES_CATALOG: SpeciesVisual[] = [
  {
    species: "oak",
    labelRu: "Дуб",
    heightScale: 1.1,
    image: require("../../assets/trees/painted/oak.png"),
    imageDark: require("../../assets/trees/painted/oak-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/oak.png"),
    imagePlantedDark: require("../../assets/trees/rooted/oak-dark.png"),
  },
  {
    species: "birch",
    labelRu: "Берёза",
    heightScale: 1.14,
    image: require("../../assets/trees/painted/birch.png"),
    imageDark: require("../../assets/trees/painted/birch-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/birch.png"),
    imagePlantedDark: require("../../assets/trees/rooted/birch-dark.png"),
  },
  {
    species: "pine",
    labelRu: "Сосна",
    heightScale: 1.2,
    image: require("../../assets/trees/painted/pine.png"),
    imageDark: require("../../assets/trees/painted/pine-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/pine.png"),
    imagePlantedDark: require("../../assets/trees/rooted/pine-dark.png"),
  },
  {
    species: "spruce",
    labelRu: "Ель",
    heightScale: 1.18,
    image: require("../../assets/trees/painted/spruce.png"),
    imageDark: require("../../assets/trees/painted/spruce-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/spruce.png"),
    imagePlantedDark: require("../../assets/trees/rooted/spruce-dark.png"),
  },
  {
    species: "maple",
    labelRu: "Клён",
    heightScale: 1.06,
    image: require("../../assets/trees/painted/maple.png"),
    imageDark: require("../../assets/trees/painted/maple-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/maple.png"),
    imagePlantedDark: require("../../assets/trees/rooted/maple-dark.png"),
  },
  {
    species: "linden",
    labelRu: "Липа",
    heightScale: 1.04,
    image: require("../../assets/trees/painted/linden.png"),
    imageDark: require("../../assets/trees/painted/linden-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/linden.png"),
    imagePlantedDark: require("../../assets/trees/rooted/linden-dark.png"),
  },
  {
    species: "sakura",
    labelRu: "Сакура",
    heightScale: 1,
    image: require("../../assets/trees/painted/cherry.png"),
    imageDark: require("../../assets/trees/painted/cherry-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/cherry.png"),
    imagePlantedDark: require("../../assets/trees/rooted/cherry-dark.png"),
  },
  {
    species: "apple",
    labelRu: "Яблоня",
    heightScale: 0.94,
    image: require("../../assets/trees/painted/apple.png"),
    imageDark: require("../../assets/trees/painted/apple-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/apple.png"),
    imagePlantedDark: require("../../assets/trees/rooted/apple-dark.png"),
  },
  {
    species: "bush",
    labelRu: "Куст",
    heightScale: 0.66,
    image: require("../../assets/trees/painted/bush.png"),
    imageDark: require("../../assets/trees/painted/bush-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/bush.png"),
    imagePlantedDark: require("../../assets/trees/rooted/bush-dark.png"),
  },
  {
    species: "willow",
    labelRu: "Ива",
    heightScale: 1.08,
    image: require("../../assets/trees/painted/willow.png"),
    imageDark: require("../../assets/trees/painted/willow-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/willow.png"),
    imagePlantedDark: require("../../assets/trees/rooted/willow-dark.png"),
  },
  {
    species: "rowan",
    labelRu: "Рябина",
    heightScale: 0.96,
    image: require("../../assets/trees/painted/rowan.png"),
    imageDark: require("../../assets/trees/painted/rowan-dark.png"),
    imagePlanted: require("../../assets/trees/rooted/rowan.png"),
    imagePlantedDark: require("../../assets/trees/rooted/rowan-dark.png"),
  },
];

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

const bySpecies = new Map(TREE_SPECIES_CATALOG.map((v) => [v.species, v]));

export function resolveSpecies(species: string): TreeSpecies {
  if (bySpecies.has(species as TreeSpecies)) return species as TreeSpecies;
  return LEGACY_SPECIES_MAP[species] ?? "oak";
}

export function getSpeciesVisual(species: string): SpeciesVisual {
  return bySpecies.get(resolveSpecies(species)) ?? TREE_SPECIES_CATALOG[0];
}

export function getTreeImage(
  species: string,
  dark: boolean,
  planted = false,
): ImageSourcePropType {
  const visual = getSpeciesVisual(species);
  if (planted) return dark ? visual.imagePlantedDark : visual.imagePlanted;
  return dark ? visual.imageDark : visual.image;
}
