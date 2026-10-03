import React from "react";
import { Image, ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui";
import { TreeIllustration } from "../tree/TreeIllustration";
import { CatalogItem } from "../../services/forest/catalog";
import { getGroveScene } from "../../constants/groveScenes";
import { getSpeciesVisual } from "../../constants/treeSpecies";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

const WOOD_LIGHT = require("../../../assets/forest/plaque-wood-light.jpg");
const WOOD_DARK = require("../../../assets/forest/plaque-wood-dark.jpg");

type Props = {
  item: CatalogItem;
  index: number;
  onPress: () => void;
};

function formatCardDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("ru-RU");
}

/**
 * Карточка каталога как на референсе: поляна, дерево, маленькая табличка.
 * День/ночь берётся из темы, не дублируем пару карточек на одну запись.
 */
export function TreeCatalogCard({ item, index, onPress }: Props) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const visual = getSpeciesVisual(item.tree.species);
  const meadow = getGroveScene(item.tree.species, isDark);
  const ink = isDark ? "#F3E6D2" : "#3A2A18";
  const muted = isDark ? "#D4C4A8" : "#6A4A2C";
  const note = item.entry.note.trim() || item.entry.smallWin?.trim() || "Без текста";

  return (
    <View style={styles.wrap}>
      <Text
        style={{
          marginBottom: 6,
          fontSize: theme.typography.sizes.caption,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
        numberOfLines={1}
      >
        {index}. {visual.labelRu}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${visual.labelRu}, запись ${item.entry.date}`}
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <Image source={meadow} style={styles.meadow} resizeMode="cover" accessibilityIgnoresInvertColors />
        {isDark ? (
          <View style={styles.moon}>
            <Ionicons name="moon" size={12} color="#F6E7C3" />
          </View>
        ) : null}
        <View style={styles.treeSlot} pointerEvents="none">
          <TreeIllustration tree={item.tree} fillParent planted />
        </View>
        <ImageBackground
          source={isDark ? WOOD_DARK : WOOD_LIGHT}
          style={styles.plaque}
          imageStyle={styles.plaqueImage}
          resizeMode="cover"
        >
          <Text
            face="serif"
            numberOfLines={2}
            style={{
              color: ink,
              fontSize: 10,
              lineHeight: 13,
            }}
            maxFontSizeMultiplier={theme.typography.scaleLimits.content}
          >
            {note}
          </Text>
          <Text
            style={{
              marginTop: 3,
              color: muted,
              fontSize: 9,
            }}
            maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
          >
            {formatCardDate(item.entry.date)}
          </Text>
        </ImageBackground>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "48%",
    marginBottom: 16,
  },
  card: {
    aspectRatio: 0.78,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  meadow: {
    ...StyleSheet.absoluteFill,
  },
  moon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
  },
  treeSlot: {
    position: "absolute",
    left: "16%",
    right: "16%",
    top: "10%",
    bottom: "28%",
  },
  plaque: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  plaqueImage: {
    borderRadius: 4,
  },
});
