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

/**
 * Текст записи на дощечке референса.
 * Закрывает вшитый плейсхолдер, не рисует второе дерево.
 */
export function WoodenPlaque({ item, maxHeight, width, compact = false }: Props) {
  const theme = useTheme();
  const ink = "#3A2A18";
  const muted = "#6A4A2C";
  const note = plaqueNote(item);
  const fit = fitNote(note, compact);
  const dateLabel = formatPlaqueDate(item.entry.date, compact ? undefined : item.entry.time);

  return (
    <View style={[styles.frame, { width, height: maxHeight }]}>
      <ImageBackground
        source={WOOD_DAY}
        style={styles.wood}
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
              marginTop: compact ? 4 : 8,
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
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#C4A078",
  },
  wood: {
    flex: 1,
    justifyContent: "center",
  },
  woodImage: {
    borderRadius: 5,
  },
  inner: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  innerCompact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
