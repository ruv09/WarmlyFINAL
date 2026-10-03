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
 * Карточка = картина с референса. Меняется только текст на дощечке.
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
    Math.round(window.height * 0.64),
  );
  const plaqueWidth = Math.round(cardWidth * 0.68);
  const plaqueHeight = Math.round(cardHeight * 0.2);
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
      <View
        style={[
          styles.plaqueDock,
          {
            bottom: cardHeight * 0.095,
          },
        ]}
        pointerEvents="none"
      >
        <WoodenPlaque
          item={item}
          sceneMode={sceneMode}
          compact
          width={plaqueWidth}
          maxHeight={plaqueHeight}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 22,
    shadowColor: "#2A1A0C",
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  plaqueDock: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
