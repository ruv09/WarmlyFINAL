import { ImageSourcePropType } from "react-native";
import { TreeSpecies } from "../types";

export interface SpeciesVisual {
  species: TreeSpecies;
  labelRu: string;
  /** Базовая высота вида относительно других */
  heightScale: number;
  /** Варианты иллюстраций: light / dark */
  variants: Array<{
    image: ImageSourcePropType;
    imageDark: ImageSourcePropType;
  }>;
}

export const TREE_SPECIES_CATALOG: SpeciesVisual[] = [
  {
    species: "oak",
    labelRu: "Дуб",
    heightScale: 1.12,
    variants: [
      {
        image: require("../../assets/forest/trees/oak/oak_01.png"),
        imageDark: require("../../assets/forest/trees/oak/oak_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/oak/oak_02.png"),
        imageDark: require("../../assets/forest/trees/oak/oak_02_dark.png"),
      },
    ],
  },
  {
    species: "birch",
    labelRu: "Берёза",
    heightScale: 1.16,
    variants: [
      {
        image: require("../../assets/forest/trees/birch/birch_01.png"),
        imageDark: require("../../assets/forest/trees/birch/birch_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/birch/birch_02.png"),
        imageDark: require("../../assets/forest/trees/birch/birch_02_dark.png"),
      },
    ],
  },
  {
    species: "pine",
    labelRu: "Сосна",
    heightScale: 1.22,
    variants: [
      {
        image: require("../../assets/forest/trees/pine/pine_01.png"),
        imageDark: require("../../assets/forest/trees/pine/pine_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/pine/pine_02.png"),
        imageDark: require("../../assets/forest/trees/pine/pine_02_dark.png"),
      },
    ],
  },
  {
    species: "spruce",
    labelRu: "Ель",
    heightScale: 1.2,
    variants: [
      {
        image: require("../../assets/forest/trees/spruce/spruce_01.png"),
        imageDark: require("../../assets/forest/trees/spruce/spruce_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/spruce/spruce_02.png"),
        imageDark: require("../../assets/forest/trees/spruce/spruce_02_dark.png"),
      },
    ],
  },
  {
    species: "maple",
    labelRu: "Клён",
    heightScale: 1.08,
    variants: [
      {
        image: require("../../assets/forest/trees/maple/maple_01.png"),
        imageDark: require("../../assets/forest/trees/maple/maple_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/maple/maple_02.png"),
        imageDark: require("../../assets/forest/trees/maple/maple_02_dark.png"),
      },
    ],
  },
  {
    species: "linden",
    labelRu: "Липа",
    heightScale: 1.05,
    variants: [
      {
        image: require("../../assets/forest/trees/linden/linden_01.png"),
        imageDark: require("../../assets/forest/trees/linden/linden_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/linden/linden_02.png"),
        imageDark: require("../../assets/forest/trees/linden/linden_02_dark.png"),
      },
    ],
  },
  {
    species: "sakura",
    labelRu: "Сакура",
    heightScale: 1.02,
    variants: [
      {
        image: require("../../assets/forest/trees/sakura/sakura_01.png"),
        imageDark: require("../../assets/forest/trees/sakura/sakura_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/sakura/sakura_02.png"),
        imageDark: require("../../assets/forest/trees/sakura/sakura_02_dark.png"),
      },
    ],
  },
  {
    species: "apple",
    labelRu: "Яблоня",
    heightScale: 0.92,
    variants: [
      {
        image: require("../../assets/forest/trees/apple/apple_01.png"),
        imageDark: require("../../assets/forest/trees/apple/apple_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/apple/apple_02.png"),
        imageDark: require("../../assets/forest/trees/apple/apple_02_dark.png"),
      },
    ],
  },
  {
    species: "bush",
    labelRu: "Куст",
    heightScale: 0.68,
    variants: [
      {
        image: require("../../assets/forest/trees/bush/bush_01.png"),
        imageDark: require("../../assets/forest/trees/bush/bush_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/bush/bush_02.png"),
        imageDark: require("../../assets/forest/trees/bush/bush_02_dark.png"),
      },
    ],
  },
  {
    species: "willow",
    labelRu: "Ива",
    heightScale: 1.1,
    variants: [
      {
        image: require("../../assets/forest/trees/willow/willow_01.png"),
        imageDark: require("../../assets/forest/trees/willow/willow_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/willow/willow_02.png"),
        imageDark: require("../../assets/forest/trees/willow/willow_02_dark.png"),
      },
    ],
  },
  {
    species: "rowan",
    labelRu: "Рябина",
    heightScale: 0.96,
    variants: [
      {
        image: require("../../assets/forest/trees/rowan/rowan_01.png"),
        imageDark: require("../../assets/forest/trees/rowan/rowan_01_dark.png"),
      },
      {
        image: require("../../assets/forest/trees/rowan/rowan_02.png"),
        imageDark: require("../../assets/forest/trees/rowan/rowan_02_dark.png"),
      },
    ],
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
  variant = 1,
): ImageSourcePropType {
  const visual = getSpeciesVisual(species);
  const index = Math.max(0, Math.min(visual.variants.length - 1, (variant || 1) - 1));
  const asset = visual.variants[index] ?? visual.variants[0];
  return dark ? asset.imageDark : asset.image;
}
