import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "../ui";
import { CatalogItem } from "../../services/forest/catalog";
import { SceneMode } from "../../types";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

const PLAQUE_SIGN = require("../../../assets/forest/plaque-sign.png");

/** Вырез таблички со стойками, без обрезки скруглением. */
export const PLAQUE_ASPECT = 851 / 623;

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
  const lines = hasExtra ? 4 : 5;
  if (len > 220) return { fontSize: 15, lineHeight: 22, lines };
  if (len > 140) return { fontSize: 16, lineHeight: 24, lines };
  return { fontSize: 17, lineHeight: 25, lines };
}

/**
 * Дощечка из готового выреза: доска и стойки как на фото,
 * текст только на самой доске.
 */
export function WoodenPlaque({ item, width, maxHeight, compact = false }: Props) {
  const theme = useTheme();
  const ink = "#2A1C10";
  const muted = "#6A4A2C";
  const { note, extra } = plaqueCopy(item);
  const fit = fitNote(note, compact, Boolean(extra));
  const dateLabel = formatPlaqueDate(item.entry.date, compact ? undefined : item.entry.time);
  let plaqueWidth = width;
  let height = Math.round(plaqueWidth / PLAQUE_ASPECT);
  if (maxHeight > 0 && height > maxHeight) {
    height = maxHeight;
    plaqueWidth = Math.round(height * PLAQUE_ASPECT);
  }
  const padX = Math.round(plaqueWidth * (compact ? 0.1 : 0.11));
  const padTop = Math.round(height * (compact ? 0.19 : 0.18));
  const padBottom = Math.round(height * (compact ? 0.26 : 0.25));

  return (
    <View style={[styles.frame, { width: plaqueWidth, height }]} collapsable={false}>
      <Image
        source={PLAQUE_SIGN}
        style={styles.sign}
        resizeMode="stretch"
        accessibilityIgnoresInvertColors
      />
      <View
        style={[styles.inner, { paddingHorizontal: padX, paddingTop: padTop, paddingBottom: padBottom }]}
        collapsable={false}
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
        {extra ? (
          <Text
            face="serif"
            numberOfLines={compact ? 2 : 3}
            style={{
              marginTop: compact ? 5 : 7,
              color: ink,
              fontSize: compact ? 11 : 14,
              lineHeight: compact ? 15 : 20,
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
            marginTop: compact ? 5 : 7,
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
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: "transparent",
  },
  sign: {
    ...StyleSheet.absoluteFill,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
  },
});
