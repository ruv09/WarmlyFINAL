import { ImageSourcePropType } from "react-native";
import { TreeSpecies } from "../types";
import { resolveSpecies } from "./treeSpecies";

/** Реальный размер JPG поляны. Не брать 946×2048 — это ломает contain. */
export const GROVE_SCENE_PIXELS = { width: 1024, height: 1536 } as const;

const MEADOW_01 = {
  light: require("../../assets/forest/meadows/meadow-01-day.jpg"),
  dark: require("../../assets/forest/meadows/meadow-01-night.jpg"),
};
const MEADOW_02 = {
  light: require("../../assets/forest/meadows/meadow-02-day.jpg"),
  dark: require("../../assets/forest/meadows/meadow-02-night.jpg"),
};

type MeadowId = "meadow-01" | "meadow-02";

const MEADOW_BY_ID = {
  "meadow-01": MEADOW_01,
  "meadow-02": MEADOW_02,
} as const;

/** Два места: домик справа / долина с прудом. Без главного дерева. */
const SPECIES_MEADOW: Record<TreeSpecies, MeadowId> = {
  oak: "meadow-01",
  linden: "meadow-01",
  bush: "meadow-01",
  maple: "meadow-01",
  rowan: "meadow-01",
  sakura: "meadow-01",
  apple: "meadow-01",
  birch: "meadow-02",
  pine: "meadow-02",
  spruce: "meadow-02",
  willow: "meadow-02",
};

export function getGroveScene(species: string, dark: boolean): ImageSourcePropType {
  const meadow = MEADOW_BY_ID[SPECIES_MEADOW[resolveSpecies(species)]];
  return dark ? meadow.dark : meadow.light;
}
