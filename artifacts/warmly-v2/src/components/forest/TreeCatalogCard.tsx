import React from "react";
import { Image, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TreeIllustration } from "../tree/TreeIllustration";
import { WoodenPlaque } from "./WoodenPlaque";
import { CatalogItem } from "../../services/forest/catalog";
import { getGroveScene } from "../../constants/groveScenes";
import { getTreeDefinition } from "../../constants/treeDefinitions";
import { SceneMode } from "../../types";
import { useTheme } from "../../theme";

type Props = {
  item: CatalogItem;
  sceneMode: SceneMode;
  onPress: () => void;
};

/**
 * Карточка записи как маленькая лесная сцена:
 * поляна, целое дерево, деревянная дощечка с мыслью.
 */
export function TreeCatalogCard({ item, sceneMode, onPress }: Props) {
  const theme = useTheme();
  const window = useWindowDimensions();
  const tree = getTreeDefinition(item.tree.species);
  const meadow = getGroveScene(item.tree.species, sceneMode);
  const isNight = sceneMode === "night";
  const cardWidth = Math.max(220, window.width - theme.spacing("lg") * 2);
  const cardHeight = Math.min(Math.round(cardWidth / 0.72), Math.round(window.height * 0.56));
  const plaqueWidth = Math.min(cardWidth - 36, 320);
  const plaqueMaxH = Math.round(cardHeight * 0.3);
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
        },
      ]}
    >
      <Image source={meadow} style={styles.meadow} resizeMode="cover" accessibilityIgnoresInvertColors />
      {isNight ? (
        <View style={styles.skyMark} pointerEvents="none">
          <Ionicons name="moon" size={16} color="#F6E7C3" />
        </View>
      ) : (
        <View style={styles.skyMark} pointerEvents="none">
          <Ionicons name="sunny" size={16} color="#F3D9A4" />
        </View>
      )}
      <View style={styles.treeSlot} pointerEvents="none">
        <TreeIllustration tree={item.tree} fillParent planted sceneMode={sceneMode} />
      </View>
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
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 22,
    shadowColor: "#2A1A0C",
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  meadow: {
    ...StyleSheet.absoluteFill,
  },
  skyMark: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  treeSlot: {
    position: "absolute",
    left: "18%",
    right: "18%",
    top: "8%",
    bottom: "32%",
  },
  plaqueDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 14,
    alignItems: "center",
  },
});
