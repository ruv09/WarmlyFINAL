import React from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { CatalogItem } from "../../services/forest/catalog";
import { getMoodById } from "../../constants/moods";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

const WOOD_LIGHT = require("../../../assets/forest/plaque-wood-light.jpg");
const WOOD_DARK = require("../../../assets/forest/plaque-wood-dark.jpg");

type Props = {
  item: CatalogItem;
  maxHeight: number;
  width: number;
};

function formatPlaqueDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Табличка из горизонтальных досок — как на референсах сцены дерева. */
export function WoodenPlaque({ item, maxHeight, width }: Props) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const mood = getMoodById(item.entry.moodId);
  const ink = isDark ? "#F3E6D2" : "#3A2A18";
  const muted = isDark ? "#D4C4A8" : "#6A4A2C";

  return (
    <View
      style={[
        styles.frame,
        {
          width,
          maxHeight,
          borderColor: isDark ? "#2A1C10" : "#8A6238",
        },
      ]}
    >
      <ImageBackground
        source={isDark ? WOOD_DARK : WOOD_LIGHT}
        style={styles.wood}
        imageStyle={styles.woodImage}
        resizeMode="cover"
      >
        <View style={[styles.inner, { borderColor: isDark ? "#5A4030AA" : "#C9A06AAA" }]}>
          <View style={styles.header}>
            <Text
              style={[styles.date, { color: muted, fontSize: theme.typography.sizes.caption }]}
              maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
            >
              {formatPlaqueDate(item.entry.date)}
            </Text>
            {mood ? (
              <View style={styles.moodRow}>
                <View style={[styles.moodDot, { backgroundColor: mood.color }]} />
                <Text
                  style={{
                    color: ink,
                    fontSize: theme.typography.sizes.caption,
                    fontWeight: theme.typography.weights.medium,
                  }}
                  maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
                >
                  {mood.label}
                </Text>
              </View>
            ) : null}
          </View>

          <ScrollView
            style={{ maxHeight: maxHeight - 78 }}
            contentContainerStyle={styles.notePad}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {item.entry.note.length > 0 ? (
              <Text
                style={{
                  fontSize: theme.typography.sizes.body,
                  color: ink,
                  lineHeight: theme.typography.sizes.body * 1.5,
                }}
                maxFontSizeMultiplier={theme.typography.scaleLimits.content}
              >
                {item.entry.note}
              </Text>
            ) : null}
            {item.entry.smallWin ? (
              <Text
                style={{
                  marginTop: 10,
                  color: theme.colors.accentWarm,
                  fontStyle: "italic",
                  fontSize: theme.typography.sizes.caption,
                }}
                maxFontSizeMultiplier={theme.typography.scaleLimits.content}
              >
                ✦ {item.entry.smallWin}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 8,
    borderWidth: 3,
    overflow: "hidden",
    shadowColor: "#2A1A0C",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  wood: {
    minHeight: 128,
  },
  woodImage: {
    borderRadius: 5,
  },
  inner: {
    margin: 5,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  date: {
    flexShrink: 1,
    textTransform: "capitalize",
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notePad: {
    paddingTop: 12,
  },
});
