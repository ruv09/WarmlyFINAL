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

function typeScale(width: number): number {
  if (width < 120) return 0.78;
  if (width < 150) return 0.86;
  if (width < 190) return 0.94;
  return 1;
}

function fitNote(
  text: string,
  compact: boolean,
  hasExtra: boolean,
  width: number,
): { fontSize: number; lineHeight: number; lines: number } {
  const scale = typeScale(width);
  const len = text.length;
  if (compact || width < 200) {
    const lines = hasExtra ? 2 : 3;
    if (len > 90) return { fontSize: Math.round(10 * scale), lineHeight: Math.round(13 * scale), lines };
    if (len > 50) return { fontSize: Math.round(11 * scale), lineHeight: Math.round(14 * scale), lines };
    return { fontSize: Math.round(12 * scale), lineHeight: Math.round(15 * scale), lines };
  }
  const lines = hasExtra ? 3 : 4;
  if (len > 220) return { fontSize: Math.round(13 * scale), lineHeight: Math.round(18 * scale), lines };
  if (len > 140) return { fontSize: Math.round(14 * scale), lineHeight: Math.round(19 * scale), lines };
  return { fontSize: Math.round(15 * scale), lineHeight: Math.round(20 * scale), lines };
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
  let plaqueWidth = width;
  let height = Math.round(plaqueWidth / PLAQUE_ASPECT);
  if (maxHeight > 0 && height > maxHeight) {
    height = maxHeight;
    plaqueWidth = Math.round(height * PLAQUE_ASPECT);
  }
  const fit = fitNote(note, compact, Boolean(extra), plaqueWidth);
  const dateLabel = formatPlaqueDate(item.entry.date, compact || plaqueWidth < 200 ? undefined : item.entry.time);
  const scale = typeScale(plaqueWidth);
  const padX = Math.round(plaqueWidth * 0.12);
  const padTop = Math.round(height * 0.2);
  const padBottom = Math.round(height * 0.26);

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
              marginTop: Math.max(3, Math.round(4 * scale)),
              color: ink,
              fontSize: Math.max(9, Math.round((compact ? 10 : 12) * scale)),
              lineHeight: Math.max(12, Math.round((compact ? 13 : 16) * scale)),
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
            marginTop: Math.max(3, Math.round(4 * scale)),
            color: muted,
            fontSize: Math.max(8, Math.round(10 * scale)),
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
