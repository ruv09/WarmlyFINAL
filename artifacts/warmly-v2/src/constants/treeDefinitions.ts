import { ImageSourcePropType } from "react-native";
import { SceneMode, TreeSpecies } from "../types";

export type MeadowId = "meadow-01" | "meadow-02";

export type TreeDefinition = {
  id: TreeSpecies;
  name: string;
  heightScale: number;
  meadow: MeadowId;
  dayImage: ImageSourcePropType;
  nightImage: ImageSourcePropType;
};

/**
 * Единственный каталог видов. Названия и картинки не размазывать по экранам.
 * Порядок — как в визуальном ТЗ.
 */
export const TREE_DEFINITIONS: TreeDefinition[] = [
  {
    id: "pine",
    name: "Сосна",
    heightScale: 1.18,
    meadow: "meadow-02",
    dayImage: require("../../assets/trees/day/pine.png"),
    nightImage: require("../../assets/trees/night/pine.png"),
  },
  {
    id: "birch",
    name: "Берёза",
    heightScale: 1.12,
    meadow: "meadow-02",
    dayImage: require("../../assets/trees/day/birch.png"),
    nightImage: require("../../assets/trees/night/birch.png"),
  },
  {
    id: "oak",
    name: "Дуб",
    heightScale: 1.08,
    meadow: "meadow-01",
    dayImage: require("../../assets/trees/day/oak.png"),
    nightImage: require("../../assets/trees/night/oak.png"),
  },
  {
    id: "maple",
    name: "Клён",
    heightScale: 1.04,
    meadow: "meadow-01",
    dayImage: require("../../assets/trees/day/maple.png"),
    nightImage: require("../../assets/trees/night/maple.png"),
  },
  {
    id: "willow",
    name: "Ива",
    heightScale: 1.06,
    meadow: "meadow-02",
    dayImage: require("../../assets/trees/day/willow.png"),
    nightImage: require("../../assets/trees/night/willow.png"),
  },
  {
    id: "ash",
    name: "Ясень",
    heightScale: 1.1,
    meadow: "meadow-01",
    dayImage: require("../../assets/trees/day/ash.png"),
    nightImage: require("../../assets/trees/night/ash.png"),
  },
  {
    id: "rowan",
    name: "Рябина",
    heightScale: 0.98,
    meadow: "meadow-01",
    dayImage: require("../../assets/trees/day/rowan.png"),
    nightImage: require("../../assets/trees/night/rowan.png"),
  },
  {
    id: "poplar",
    name: "Тополь",
    heightScale: 1.2,
    meadow: "meadow-02",
    dayImage: require("../../assets/trees/day/poplar.png"),
    nightImage: require("../../assets/trees/night/poplar.png"),
  },
  {
    id: "spruce",
    name: "Ель",
    heightScale: 1.16,
    meadow: "meadow-02",
    dayImage: require("../../assets/trees/day/spruce.png"),
    nightImage: require("../../assets/trees/night/spruce.png"),
  },
  {
    id: "linden",
    name: "Липа",
    heightScale: 1.02,
    meadow: "meadow-01",
    dayImage: require("../../assets/trees/day/linden.png"),
    nightImage: require("../../assets/trees/night/linden.png"),
  },
  {
    id: "apple",
    name: "Яблоня",
    heightScale: 0.96,
    meadow: "meadow-01",
    dayImage: require("../../assets/trees/day/apple.png"),
    nightImage: require("../../assets/trees/night/apple.png"),
  },
  {
    id: "beech",
    name: "Бук",
    heightScale: 1.07,
    meadow: "meadow-01",
    dayImage: require("../../assets/trees/day/beech.png"),
    nightImage: require("../../assets/trees/night/beech.png"),
  },
];

const byId = new Map(TREE_DEFINITIONS.map((item) => [item.id, item]));

const LEGACY_SPECIES_MAP: Record<string, TreeSpecies> = {
  sakura: "apple",
  cherry: "apple",
  bush: "rowan",
  chestnut: "oak",
  seabuckthorn: "rowan",
  aspen: "poplar",
  alder: "linden",
  elm: "ash",
  juniper: "pine",
  cypress: "spruce",
  thuja: "spruce",
  magnolia: "apple",
  dogwood: "apple",
  viburnum: "rowan",
  plane: "beech",
  acacia: "ash",
  baobab: "oak",
  olive: "apple",
  bamboo: "birch",
  ginkgo: "maple",
  jacaranda: "apple",
};

export function resolveSpecies(species: string): TreeSpecies {
  if (byId.has(species as TreeSpecies)) return species as TreeSpecies;
  return LEGACY_SPECIES_MAP[species] ?? "oak";
}

export function getTreeDefinition(species: string): TreeDefinition {
  return byId.get(resolveSpecies(species)) ?? TREE_DEFINITIONS[0];
}

export function getTreeImage(species: string, mode: SceneMode): ImageSourcePropType {
  const tree = getTreeDefinition(species);
  return mode === "night" ? tree.nightImage : tree.dayImage;
}
