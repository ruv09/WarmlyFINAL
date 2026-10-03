import React from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { WoodenPlaque, PLAQUE_ASPECT } from "./WoodenPlaque";
import { ForestSceneBackdrop } from "./ForestSceneBackdrop";
import { CatalogItem } from "../../services/forest/catalog";
import { getGroveEdges, getGroveScene } from "../../constants/groveScenes";
import { getTreeDefinition } from "../../constants/treeDefinitions";
import { getContainedSceneFrame, layoutPlaqueInScene } from "../../services/forest/backgroundFit";
import { SceneMode } from "../../types";
import { useTheme } from "../../theme";

type Props = {
  item: CatalogItem;
  sceneMode: SceneMode;
  onPress: () => void;
};

/**
 * Полнокадровая сцена + наша деревянная дощечка с текстом записи.
 */
export function TreeCatalogCard({ item, sceneMode, onPress }: Props) {
  const theme = useTheme();
  const window = useWindowDimensions();
  const tree = getTreeDefinition(item.tree.species);
  const scene = getGroveScene(item.tree.species, sceneMode);
  const edges = getGroveEdges(item.tree.species, sceneMode);
  const cardWidth = Math.max(220, window.width - theme.spacing("lg") * 2);
  const cardHeight = Math.min(
    Math.round(cardWidth / tree.sceneAspect),
    Math.round(window.height * 0.58),
  );
  const sceneFrame = getContainedSceneFrame(cardWidth, cardHeight, tree.sceneAspect);
  const plaque = layoutPlaqueInScene(sceneFrame, PLAQUE_ASPECT);
  const note = (item.entry.note ?? "").trim();
  const extra = (item.entry.smallWin ?? "").trim();
  const spoken = [note, extra].filter(Boolean).join(". ") || "Без текста";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${tree.name}. ${spoken}`}
      onPress={onPress}
      style={[
        styles.card,
        {
          width: cardWidth,
          height: cardHeight,
          alignSelf: "center",
          backgroundColor: edges.sky,
        },
      ]}
    >
      <ForestSceneBackdrop
        source={scene}
        edges={edges}
        width={cardWidth}
        height={cardHeight}
        aspect={tree.sceneAspect}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: plaque.left,
          top: plaque.top,
          width: plaque.width,
          height: plaque.height,
          overflow: "hidden",
        }}
      >
        <WoodenPlaque
          item={item}
          sceneMode={sceneMode}
          compact
          width={plaque.width}
          maxHeight={plaque.height}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 22,
    shadowColor: "#2A1A0C",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
