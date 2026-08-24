import { ImageSourcePropType } from "react-native";
import { TreeSpecies } from "../types";

export interface SpeciesVisual {
  species: TreeSpecies;
  labelRu: string;
  heightScale: number;
  image: ImageSourcePropType;
  imageDark: ImageSourcePropType;
  /** Ствол без лужайки — сцена поляны и каталог одной кисти. */
  imagePlanted: ImageSourcePropType;
  imagePlantedDark: ImageSourcePropType;
}

function layers(
  day: ImageSourcePropType,
  night: ImageSourcePropType,
): Pick<SpeciesVisual, "image" | "imageDark" | "imagePlanted" | "imagePlantedDark"> {
  return {
    image: day,
    imageDark: night,
    imagePlanted: day,
    imagePlantedDark: night,
  };
}

/**
 * Вырезанные акварельные деревья: assets/trees/day|night.
 * Поляны без героя: assets/forest/meadows.
 */
export const TREE_SPECIES_CATALOG: SpeciesVisual[] = [
  {
    species: "oak",
    labelRu: "Дуб",
    heightScale: 1.08,
    ...layers(
      require("../../assets/trees/day/oak.png"),
      require("../../assets/trees/night/oak.png"),
    ),
  },
  {
    species: "birch",
    labelRu: "Берёза",
    heightScale: 1.12,
    ...layers(
      require("../../assets/trees/day/birch.png"),
      require("../../assets/trees/night/birch.png"),
    ),
  },
  {
    species: "pine",
    labelRu: "Сосна",
    heightScale: 1.18,
    ...layers(
      require("../../assets/trees/day/pine.png"),
      require("../../assets/trees/night/pine.png"),
    ),
  },
  {
    species: "spruce",
    labelRu: "Ель",
    heightScale: 1.16,
    ...layers(
      require("../../assets/trees/day/spruce.png"),
      require("../../assets/trees/night/spruce.png"),
    ),
  },
  {
    species: "maple",
    labelRu: "Клён",
    heightScale: 1.04,
    ...layers(
      require("../../assets/trees/day/maple.png"),
      require("../../assets/trees/night/maple.png"),
    ),
  },
  {
    species: "linden",
    labelRu: "Липа",
    heightScale: 1.02,
    ...layers(
      require("../../assets/trees/day/linden.png"),
      require("../../assets/trees/night/linden.png"),
    ),
  },
  {
    species: "sakura",
    labelRu: "Сакура",
    heightScale: 1,
    ...layers(
      require("../../assets/trees/day/sakura.png"),
      require("../../assets/trees/night/sakura.png"),
    ),
  },
  {
    species: "apple",
    labelRu: "Яблоня",
    heightScale: 0.96,
    ...layers(
      require("../../assets/trees/day/apple.png"),
      require("../../assets/trees/night/apple.png"),
    ),
  },
  {
    species: "bush",
    labelRu: "Куст",
    heightScale: 0.7,
    ...layers(
      require("../../assets/trees/day/bush.png"),
      require("../../assets/trees/night/bush.png"),
    ),
  },
  {
    species: "willow",
    labelRu: "Ива",
    heightScale: 1.06,
    ...layers(
      require("../../assets/trees/day/willow.png"),
      require("../../assets/trees/night/willow.png"),
    ),
  },
  {
    species: "rowan",
    labelRu: "Рябина",
    heightScale: 0.98,
    ...layers(
      require("../../assets/trees/day/rowan.png"),
      require("../../assets/trees/night/rowan.png"),
    ),
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
