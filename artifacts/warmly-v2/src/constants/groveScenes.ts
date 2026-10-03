import { ImageSourcePropType } from "react-native";
import { SceneMode } from "../types";
import { getTreeImage } from "./treeDefinitions";

export type MeadowEdges = { sky: string; ground: string };

function resolveMode(mode: SceneMode | boolean): SceneMode {
  return mode === true || mode === "night" ? "night" : "day";
}

export function getGroveScene(species: string, mode: SceneMode | boolean): ImageSourcePropType {
  return getTreeImage(species, resolveMode(mode));
}

/** Поля вокруг contain-сцены — цвет «бумаги» референса, не обрезка картины. */
export function getGroveEdges(_species: string, mode: SceneMode | boolean): MeadowEdges {
  return resolveMode(mode) === "night"
    ? { sky: "#070B16", ground: "#070B16" }
    : { sky: "#F4F2EE", ground: "#F4F2EE" };
}
