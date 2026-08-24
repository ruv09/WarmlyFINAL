import { ImageSourcePropType } from "react-native";
import { TreeSpecies } from "../types";

export interface SpeciesVisual {
  species: TreeSpecies;
  labelRu: string;
  heightScale: number;
  image: ImageSourcePropType;
  imageDark: ImageSourcePropType;
}

/**
 * Живописные акварельные спрайты из assets/trees/painted/
 */
export const TREE_SPECIES_CATALOG: SpeciesVisual[] = [
  {
    species: "oak",
    labelRu: "Дуб",
    heightScale: 1.1,
    image: require("../../assets/trees/painted/oak.png"),
    imageDark: require("../../assets/trees/painted/oak-dark.png"),
  },
  {
    species: "birch",
    labelRu: "Берёза",
    heightScale: 1.14,
    image: require("../../assets/trees/painted/birch.png"),
    imageDark: require("../../assets/trees/painted/birch-dark.png"),
  },
  {
    species: "pine",
    labelRu: "Сосна",
    heightScale: 1.2,
    image: require("../../assets/trees/painted/pine.png"),
    imageDark: require("../../assets/trees/painted/pine-dark.png"),
  },
  {
    species: "spruce",
    labelRu: "Ель",
    heightScale: 1.18,
    image: require("../../assets/trees/painted/spruce.png"),
    imageDark: require("../../assets/trees/painted/spruce-dark.png"),
  },
  {
    species: "maple",
    labelRu: "Клён",
    heightScale: 1.06,
    image: require("../../assets/trees/painted/maple.png"),
    imageDark: require("../../assets/trees/painted/maple-dark.png"),
  },
  {
    species: "linden",
    labelRu: "Липа",
    heightScale: 1.04,
    image: require("../../assets/trees/painted/linden.png"),
    imageDark: require("../../assets/trees/painted/linden-dark.png"),
  },
  {
    species: "sakura",
    labelRu: "Сакура",
    heightScale: 1,
    image: require("../../assets/trees/painted/cherry.png"),
    imageDark: require("../../assets/trees/painted/cherry-dark.png"),
  },
  {
    species: "apple",
    labelRu: "Яблоня",
    heightScale: 0.94,
    image: require("../../assets/trees/painted/apple.png"),
    imageDark: require("../../assets/trees/painted/apple-dark.png"),
  },
  {
    species: "bush",
    labelRu: "Куст",
    heightScale: 0.66,
    image: require("../../assets/trees/painted/bush.png"),
    imageDark: require("../../assets/trees/painted/bush-dark.png"),
  },
  {
    species: "willow",
    labelRu: "Ива",
    heightScale: 1.08,
    image: require("../../assets/trees/painted/willow.png"),
    imageDark: require("../../assets/trees/painted/willow-dark.png"),
  },
  {
    species: "rowan",
    labelRu: "Рябина",
    heightScale: 0.96,
    image: require("../../assets/trees/painted/rowan.png"),
    imageDark: require("../../assets/trees/painted/rowan-dark.png"),
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
  _variant = 1,
): ImageSourcePropType {
  const visual = getSpeciesVisual(species);
  return dark ? visual.imageDark : visual.image;
}
