import { ImageSourcePropType } from "react-native";
import { SceneMode } from "../types";
import { MeadowId, getTreeDefinition } from "./treeDefinitions";

/** Реальный размер JPG поляны. Не брать 946×2048 — это ломает contain. */
export const GROVE_SCENE_PIXELS = { width: 1024, height: 1536 } as const;

const MEADOW_BY_ID: Record<MeadowId, { day: ImageSourcePropType; night: ImageSourcePropType }> = {
  "meadow-01": {
    day: require("../../assets/forest/meadows/meadow-01-day.jpg"),
    night: require("../../assets/forest/meadows/meadow-01-night.jpg"),
  },
  "meadow-02": {
    day: require("../../assets/forest/meadows/meadow-02-day.jpg"),
    night: require("../../assets/forest/meadows/meadow-02-night.jpg"),
  },
};

export function getGroveScene(species: string, mode: SceneMode | boolean): ImageSourcePropType {
  const resolved: SceneMode = mode === true || mode === "night" ? "night" : "day";
  const meadow = MEADOW_BY_ID[getTreeDefinition(species).meadow];
  return resolved === "night" ? meadow.night : meadow.day;
}
