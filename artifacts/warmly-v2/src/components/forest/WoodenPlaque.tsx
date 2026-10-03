import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Text } from "../ui";
import { CatalogItem } from "../../services/forest/catalog";
import { SceneMode } from "../../types";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

const WOOD_DAY = require("../../../assets/forest/plaque-wood-light.jpg");

type Props = {
  item: CatalogItem;
  maxHeight: number;
  width: number;
  sceneMode: SceneMode;
  compact?: boolean;
};

function plaqueNote(item: CatalogItem): string {
  return item.entry.note.trim() || item.entry.smallWin?.trim() || "Без текста";
}

function formatPlaqueDate(dateKey: string, time?: string): string {
  const date = parseDateKey(dateKey).toLocaleDateString("ru-RU");
  return time ? `${date}  ${time}` : date;
}

function fitNote(text: string, compact: boolean): { fontSize: number; lineHeight: number; lines: number } {
  const len = text.length;
  if (compact) {
    if (len > 90) return { fontSize: 11, lineHeight: 15, lines: 3 };
    if (len > 50) return { fontSize: 12, lineHeight: 16, lines: 3 };
    return { fontSize: 13, lineHeight: 17, lines: 3 };
  }
  if (len > 220) return { fontSize: 15, lineHeight: 23, lines: 7 };
  if (len > 140) return { fontSize: 16, lineHeight: 25, lines: 7 };
  return { fontSize: 17, lineHeight: 26, lines: 7 };
}

/** Деревянная дощечка с мыслью: текстура дерева, тёмные чернила, дата внизу. */
export function WoodenPlaque({ item, maxHeight, width, compact = false }: Props) {
  const theme = useTheme();
  const ink = "#3A2A18";
  const muted = "#6A4A2C";
  const note = plaqueNote(item);
  const fit = fitNote(note, compact);
  const dateLabel = formatPlaqueDate(item.entry.date, compact ? undefined : item.entry.time);

  return (
    <View style={[styles.frame, { width, maxHeight }]}>
      <ImageBackground
        source={WOOD_DAY}
        style={[styles.wood, compact ? styles.woodCompact : styles.woodFull]}
        imageStyle={styles.woodImage}
        resizeMode="cover"
      >
        <View style={[styles.inner, compact ? styles.innerCompact : null]}>
          <Text
            face="serif"
            numberOfLines={fit.lines}
            style={{
              color: ink,
              fontSize: fit.fontSize,
              lineHeight: fit.lineHeight,
              textAlign: "center",
            }}
            maxFontSizeMultiplier={theme.typography.scaleLimits.content}
          >
            {note}
          </Text>
          <Text
            style={{
              marginTop: compact ? 5 : 8,
              color: muted,
              fontSize: compact ? 10 : theme.typography.sizes.caption,
              textAlign: "center",
              letterSpacing: 0.2,
            }}
            maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
          >
            {dateLabel}
          </Text>
        </View>
      </ImageBackground>
      <View pointerEvents="none" style={[styles.peg, { left: compact ? 10 : 14 }]} />
      <View pointerEvents="none" style={[styles.peg, { right: compact ? 10 : 14 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#8A6238",
    shadowColor: "#2A1A0C",
    shadowOpacity: 0.32,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  wood: {
    justifyContent: "center",
  },
  woodCompact: {
    minHeight: 76,
  },
  woodFull: {
    minHeight: 120,
  },
  woodImage: {
    borderRadius: 6,
  },
  inner: {
    margin: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#C9A06AAA",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  innerCompact: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
  },
  peg: {
    position: "absolute",
    top: 10,
    zIndex: 2,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#8A6238",
  },
});
