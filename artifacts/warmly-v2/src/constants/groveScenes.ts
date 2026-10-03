import { ImageSourcePropType } from "react-native";
import { SceneMode } from "../types";
import { MeadowId, getTreeDefinition } from "./treeDefinitions";

/** Реальный размер JPG поляны. Не брать 946×2048 — это ломает contain. */
export const GROVE_SCENE_PIXELS = { width: 1024, height: 1536 } as const;

export type MeadowEdges = { sky: string; ground: string };

const MEADOW_BY_ID: Record<
  MeadowId,
  { day: ImageSourcePropType; night: ImageSourcePropType; dayEdges: MeadowEdges; nightEdges: MeadowEdges }
> = {
  "meadow-01": {
    day: require("../../assets/forest/meadows/meadow-01-day.jpg"),
    night: require("../../assets/forest/meadows/meadow-01-night.jpg"),
    dayEdges: { sky: "#BCC2BF", ground: "#7D6F28" },
    nightEdges: { sky: "#010119", ground: "#0A1010" },
  },
  "meadow-02": {
    day: require("../../assets/forest/meadows/meadow-02-day.jpg"),
    night: require("../../assets/forest/meadows/meadow-02-night.jpg"),
    dayEdges: { sky: "#DACBC3", ground: "#8C794C" },
    nightEdges: { sky: "#010118", ground: "#020C0D" },
  },
};

function resolveMode(mode: SceneMode | boolean): SceneMode {
  return mode === true || mode === "night" ? "night" : "day";
}

export function getGroveScene(species: string, mode: SceneMode | boolean): ImageSourcePropType {
  const meadow = MEADOW_BY_ID[getTreeDefinition(species).meadow];
  return resolveMode(mode) === "night" ? meadow.night : meadow.day;
}

/** Цвета краёв той же картины — для полей contain, без обрезки кадра. */
export function getGroveEdges(species: string, mode: SceneMode | boolean): MeadowEdges {
  const meadow = MEADOW_BY_ID[getTreeDefinition(species).meadow];
  return resolveMode(mode) === "night" ? meadow.nightEdges : meadow.dayEdges;
}
