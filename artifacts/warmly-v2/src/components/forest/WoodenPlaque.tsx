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
    if (len > 110) return { fontSize: 12, lineHeight: 16, lines: 4 };
    if (len > 70) return { fontSize: 13, lineHeight: 18, lines: 4 };
    return { fontSize: 14, lineHeight: 20, lines: 4 };
  }
  if (len > 220) return { fontSize: 15, lineHeight: 24, lines: 10 };
  if (len > 140) return { fontSize: 16, lineHeight: 26, lines: 10 };
  return { fontSize: 17, lineHeight: 27, lines: 10 };
}

/**
 * Деревянная дощечка: текст мысли сверху, дата снизу.
 * Не системная карточка — текстура доски и тёплые чернила.
 */
export function WoodenPlaque({ item, maxHeight, width, sceneMode, compact = false }: Props) {
  const theme = useTheme();
  const isNight = sceneMode === "night";
  const ink = "#3A2A18";
  const muted = "#6A4A2C";
  const note = plaqueNote(item);
  const fit = fitNote(note, compact);
  const dateLabel = formatPlaqueDate(item.entry.date, compact ? undefined : item.entry.time);

  return (
    <View
      style={[
        styles.frame,
        {
          width,
          maxHeight,
          borderColor: isNight ? "#2A1C10" : "#8A6238",
        },
      ]}
    >
      <ImageBackground
        source={WOOD_DAY}
        style={[styles.wood, compact ? styles.woodCompact : null]}
        imageStyle={styles.woodImage}
        resizeMode="cover"
      >
        <View
          style={[
            styles.inner,
            compact ? styles.innerCompact : null,
            { borderColor: isNight ? "#5A4030AA" : "#C9A06AAA" },
          ]}
        >
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
              marginTop: compact ? 6 : 10,
              color: muted,
              fontSize: compact ? 11 : theme.typography.sizes.caption,
              textAlign: "center",
              letterSpacing: 0.2,
            }}
            maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
          >
            {dateLabel}
          </Text>
        </View>
      </ImageBackground>
      <View
        pointerEvents="none"
        style={[styles.peg, { left: compact ? 10 : 14, backgroundColor: isNight ? "#2A1C10" : "#8A6238" }]}
      />
      <View
        pointerEvents="none"
        style={[styles.peg, { right: compact ? 10 : 14, backgroundColor: isNight ? "#2A1C10" : "#8A6238" }]}
      />
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
  woodCompact: {
    minHeight: 78,
  },
  woodImage: {
    borderRadius: 5,
  },
  inner: {
    margin: 5,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  innerCompact: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  peg: {
    position: "absolute",
    top: 11,
    zIndex: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.9,
  },
});
