import { ImageSourcePropType } from "react-native";
import { SceneMode, TreeSpecies } from "../types";

export type TreeDefinition = {
  id: TreeSpecies;
  name: string;
  /** width / height нарезанной сцены из референса */
  sceneAspect: number;
  dayImage: ImageSourcePropType;
  nightImage: ImageSourcePropType;
};

/**
 * Единственный каталог видов.
 * dayImage / nightImage — готовые сцены с референса, не вырезки.
 */
export const TREE_DEFINITIONS: TreeDefinition[] = [
  {
    id: "pine",
    name: "Сосна",
    sceneAspect: 768 / 1064,
    dayImage: require("../../assets/trees/scenes/pine/day.png"),
    nightImage: require("../../assets/trees/scenes/pine/night.png"),
  },
  {
    id: "birch",
    name: "Берёза",
    sceneAspect: 768 / 1054,
    dayImage: require("../../assets/trees/scenes/birch/day.png"),
    nightImage: require("../../assets/trees/scenes/birch/night.png"),
  },
  {
    id: "oak",
    name: "Дуб",
    sceneAspect: 768 / 1069,
    dayImage: require("../../assets/trees/scenes/oak/day.png"),
    nightImage: require("../../assets/trees/scenes/oak/night.png"),
  },
  {
    id: "maple",
    name: "Клён",
    sceneAspect: 768 / 1035,
    dayImage: require("../../assets/trees/scenes/maple/day.png"),
    nightImage: require("../../assets/trees/scenes/maple/night.png"),
  },
  {
    id: "willow",
    name: "Ива",
    sceneAspect: 768 / 1025,
    dayImage: require("../../assets/trees/scenes/willow/day.png"),
    nightImage: require("../../assets/trees/scenes/willow/night.png"),
  },
  {
    id: "ash",
    name: "Ясень",
    sceneAspect: 768 / 1040,
    dayImage: require("../../assets/trees/scenes/ash/day.png"),
    nightImage: require("../../assets/trees/scenes/ash/night.png"),
  },
  {
    id: "rowan",
    name: "Рябина",
    sceneAspect: 768 / 933,
    dayImage: require("../../assets/trees/scenes/rowan/day.png"),
    nightImage: require("../../assets/trees/scenes/rowan/night.png"),
  },
  {
    id: "poplar",
    name: "Тополь",
    sceneAspect: 768 / 924,
    dayImage: require("../../assets/trees/scenes/poplar/day.png"),
    nightImage: require("../../assets/trees/scenes/poplar/night.png"),
  },
  {
    id: "spruce",
    name: "Ель",
    sceneAspect: 768 / 937,
    dayImage: require("../../assets/trees/scenes/spruce/day.png"),
    nightImage: require("../../assets/trees/scenes/spruce/night.png"),
  },
  {
    id: "linden",
    name: "Липа",
    sceneAspect: 768 / 805,
    dayImage: require("../../assets/trees/scenes/linden/day.png"),
    nightImage: require("../../assets/trees/scenes/linden/night.png"),
  },
  {
    id: "apple",
    name: "Яблоня",
    sceneAspect: 768 / 797,
    dayImage: require("../../assets/trees/scenes/apple/day.png"),
    nightImage: require("../../assets/trees/scenes/apple/night.png"),
  },
  {
    id: "beech",
    name: "Бук",
    sceneAspect: 768 / 808,
    dayImage: require("../../assets/trees/scenes/beech/day.png"),
    nightImage: require("../../assets/trees/scenes/beech/night.png"),
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
