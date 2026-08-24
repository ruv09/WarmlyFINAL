import { ImageSourcePropType } from "react-native";
import { TreeSpecies } from "../types";
import { resolveSpecies } from "./treeSpecies";

/** Реальный размер JPG поляны. Не брать 946×2048 — это ломает contain. */
export const GROVE_SCENE_PIXELS = { width: 1024, height: 1536 } as const;

/**
 * Широкие поляны в той же живописной акварели, что и assets/trees/*.
 * Герой — спрайт выбранного вида; фон только дальние холмы того же семейства.
 */
const OAK = {
  light: require("../../assets/forest/groves/oak-light.jpg"),
  dark: require("../../assets/forest/groves/oak-dark.jpg"),
};
const BIRCH = {
  light: require("../../assets/forest/groves/birch-light.jpg"),
  dark: require("../../assets/forest/groves/birch-dark.jpg"),
};
const PINE = {
  light: require("../../assets/forest/groves/pine-light.jpg"),
  dark: require("../../assets/forest/groves/pine-dark.jpg"),
};
const MAPLE = {
  light: require("../../assets/forest/groves/maple-light.jpg"),
  dark: require("../../assets/forest/groves/maple-dark.jpg"),
};
const SAKURA = {
  light: require("../../assets/forest/groves/sakura-light.jpg"),
  dark: require("../../assets/forest/groves/sakura-dark.jpg"),
};
const APPLE = {
  light: require("../../assets/forest/groves/apple-light.jpg"),
  dark: require("../../assets/forest/groves/apple-dark.jpg"),
};
const WILLOW = {
  light: require("../../assets/forest/groves/willow-light.jpg"),
  dark: require("../../assets/forest/groves/willow-dark.jpg"),
};

const GROVE_BY_FAMILY = {
  oak: OAK,
  birch: BIRCH,
  pine: PINE,
  maple: MAPLE,
  sakura: SAKURA,
  apple: APPLE,
  willow: WILLOW,
} as const;

type GroveFamily = keyof typeof GROVE_BY_FAMILY;

const SPECIES_FAMILY: Record<TreeSpecies, GroveFamily> = {
  oak: "oak",
  linden: "oak",
  bush: "oak",
  birch: "birch",
  pine: "pine",
  spruce: "pine",
  maple: "maple",
  rowan: "maple",
  sakura: "sakura",
  apple: "apple",
  willow: "willow",
};

export function getGroveScene(species: string, dark: boolean): ImageSourcePropType {
  const family = SPECIES_FAMILY[resolveSpecies(species)];
  const pair = GROVE_BY_FAMILY[family];
  return dark ? pair.dark : pair.light;
}
