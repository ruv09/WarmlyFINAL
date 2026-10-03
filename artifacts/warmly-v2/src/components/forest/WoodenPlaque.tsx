import React from "react";
import { Image, StyleSheet, View } from "react-native";
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

function plaqueCopy(item: CatalogItem): { note: string; extra?: string } {
  const note = (item.entry.note ?? "").trim();
  const extra = (item.entry.smallWin ?? "").trim();
  if (note && extra) return { note, extra };
  if (note) return { note };
  if (extra) return { note: extra };
  return { note: "Без текста" };
}

function formatPlaqueDate(dateKey: string, time?: string): string {
  const date = parseDateKey(dateKey).toLocaleDateString("ru-RU");
  return time ? `${date}  ${time}` : date;
}

function fitNote(text: string, compact: boolean, hasExtra: boolean): { fontSize: number; lineHeight: number; lines: number } {
  const len = text.length;
  if (compact) {
    const lines = hasExtra ? 2 : 3;
    if (len > 90) return { fontSize: 11, lineHeight: 15, lines };
    if (len > 50) return { fontSize: 12, lineHeight: 16, lines };
    return { fontSize: 13, lineHeight: 17, lines };
  }
  const lines = hasExtra ? 5 : 7;
  if (len > 220) return { fontSize: 15, lineHeight: 23, lines };
  if (len > 140) return { fontSize: 16, lineHeight: 25, lines };
  return { fontSize: 17, lineHeight: 26, lines };
}

/** Деревянная дощечка: запись и заметка, текстура дерева, тёмные чернила. */
export function WoodenPlaque({ item, width, compact = false }: Props) {
  const theme = useTheme();
  const ink = "#2A1C10";
  const muted = "#6A4A2C";
  const { note, extra } = plaqueCopy(item);
  const fit = fitNote(note, compact, Boolean(extra));
  const dateLabel = formatPlaqueDate(item.entry.date, compact ? undefined : item.entry.time);

  return (
    <View style={[styles.frame, { width }]} collapsable={false}>
      <Image source={WOOD_DAY} style={styles.woodImage} resizeMode="cover" accessibilityIgnoresInvertColors />
      <View style={[styles.inner, compact ? styles.innerCompact : null]} collapsable={false}>
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
        {extra ? (
          <Text
            face="serif"
            numberOfLines={compact ? 2 : 3}
            style={{
              marginTop: compact ? 6 : 8,
              color: ink,
              fontSize: compact ? 11 : 14,
              lineHeight: compact ? 15 : 21,
              textAlign: "center",
              fontStyle: "italic",
            }}
            maxFontSizeMultiplier={theme.typography.scaleLimits.content}
          >
            {extra}
          </Text>
        ) : null}
        <Text
          style={{
            marginTop: compact ? 6 : 8,
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
    backgroundColor: "#D8B07A",
  },
  woodImage: {
    ...StyleSheet.absoluteFill,
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
