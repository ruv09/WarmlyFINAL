import { ImageSourcePropType } from "react-native";
import { SceneMode, TreeSpecies } from "../types";
import {
  TREE_DEFINITIONS,
  TreeDefinition,
  getTreeDefinition,
  getTreeImage as getDefinedTreeImage,
} from "./treeDefinitions";

export type SpeciesVisual = {
  species: TreeSpecies;
  labelRu: string;
  heightScale: number;
  image: ImageSourcePropType;
  imageDark: ImageSourcePropType;
  imagePlanted: ImageSourcePropType;
  imagePlantedDark: ImageSourcePropType;
};

function toVisual(def: TreeDefinition): SpeciesVisual {
  return {
    species: def.id,
    labelRu: def.name,
    heightScale: def.heightScale,
    image: def.dayImage,
    imageDark: def.nightImage,
    imagePlanted: def.dayImage,
    imagePlantedDark: def.nightImage,
  };
}

/** Совместимый каталог — источник правды в TREE_DEFINITIONS. */
export const TREE_SPECIES_CATALOG: SpeciesVisual[] = TREE_DEFINITIONS.map(toVisual);

export function getSpeciesVisual(species: string): SpeciesVisual {
  return toVisual(getTreeDefinition(species));
}

export function getTreeImage(
  species: string,
  nightOrMode: boolean | SceneMode,
  _planted = false,
): ImageSourcePropType {
  const mode: SceneMode = nightOrMode === true || nightOrMode === "night" ? "night" : "day";
  return getDefinedTreeImage(species, mode);
}
