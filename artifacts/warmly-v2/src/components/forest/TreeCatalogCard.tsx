import React from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Text } from "../ui";
import { ForestSceneBackdrop } from "./ForestSceneBackdrop";
import { CatalogItem } from "../../services/forest/catalog";
import { getGroveEdges, getGroveScene } from "../../constants/groveScenes";
import { getTreeDefinition } from "../../constants/treeDefinitions";
import { SceneMode } from "../../types";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

type Props = {
  item: CatalogItem;
  sceneMode: SceneMode;
  onPress: () => void;
};

function cardDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("ru-RU");
}

/**
 * Карточка — полнокадровая сцена. Текст записи под картиной, без дощечки.
 */
export function TreeCatalogCard({ item, sceneMode, onPress }: Props) {
  const theme = useTheme();
  const window = useWindowDimensions();
  const tree = getTreeDefinition(item.tree.species);
  const scene = getGroveScene(item.tree.species, sceneMode);
  const edges = getGroveEdges(item.tree.species, sceneMode);
  const cardWidth = Math.max(220, window.width - theme.spacing("lg") * 2);
  const imageHeight = Math.min(
    Math.round(cardWidth / tree.sceneAspect),
    Math.round(window.height * 0.58),
  );
  const note = item.entry.note.trim() || item.entry.smallWin?.trim() || "Без текста";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${tree.name}. ${note}`}
      onPress={onPress}
      style={styles.wrap}
    >
      <View
        style={[
          styles.scene,
          {
            width: cardWidth,
            height: imageHeight,
            backgroundColor: edges.sky,
          },
        ]}
      >
        <ForestSceneBackdrop
          source={scene}
          edges={edges}
          width={cardWidth}
          height={imageHeight}
          aspect={tree.sceneAspect}
        />
      </View>
      <Text
        face="serif"
        numberOfLines={2}
        style={{
          marginTop: 10,
          color: theme.colors.textPrimary,
          fontSize: theme.typography.sizes.body,
          lineHeight: 22,
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.content}
      >
        {note}
      </Text>
      <Text
        style={{
          marginTop: 4,
          marginBottom: 22,
          color: theme.colors.textSecondary,
          fontSize: theme.typography.sizes.caption,
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        {cardDate(item.entry.date)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  scene: {
    borderRadius: 16,
    overflow: "hidden",
  },
});
