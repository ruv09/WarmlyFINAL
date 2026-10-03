import React from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { WoodenPlaque } from "./WoodenPlaque";
import { ForestSceneBackdrop } from "./ForestSceneBackdrop";
import { CatalogItem } from "../../services/forest/catalog";
import { getGroveEdges, getGroveScene } from "../../constants/groveScenes";
import { getTreeDefinition } from "../../constants/treeDefinitions";
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
  const plaqueWidth = Math.min(cardWidth - 36, 300);
  const plaqueMaxH = Math.round(cardHeight * 0.28);
  const note = item.entry.note.trim() || item.entry.smallWin?.trim() || "Без текста";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${tree.name}. ${note}`}
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
      <View style={styles.plaqueDock} pointerEvents="none">
        <WoodenPlaque
          item={item}
          sceneMode={sceneMode}
          compact
          width={plaqueWidth}
          maxHeight={plaqueMaxH}
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
  plaqueDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 14,
    alignItems: "center",
  },
});
