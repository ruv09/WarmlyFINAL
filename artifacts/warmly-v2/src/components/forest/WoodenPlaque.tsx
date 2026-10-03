import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "../ui";
import { CatalogItem } from "../../services/forest/catalog";
import { SceneMode } from "../../types";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

const PLAQUE_SIGN = require("../../../assets/forest/plaque-sign.png");

/** Вырез таблички со стойками. Высота считается только от этих чисел. */
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

/**
 * Дощечка фиксированного размера: картинка никогда не берёт
 * исходные 851×623, текст только на доске.
 */
export function WoodenPlaque({ item, width, maxHeight, compact = false }: Props) {
  const theme = useTheme();
  const ink = "#2A1C10";
  const muted = "#6A4A2C";
  const { note, extra } = plaqueCopy(item);

  const plaqueWidth = Math.max(72, Math.round(width));
  let plaqueHeight = Math.max(52, Math.round(plaqueWidth / PLAQUE_ASPECT));
  if (maxHeight > 0 && plaqueHeight > maxHeight) {
    plaqueHeight = Math.max(52, Math.round(maxHeight));
  }

  const dateLabel = formatPlaqueDate(item.entry.date, compact ? undefined : item.entry.time);
  const noteSize = plaqueWidth < 140 ? 10 : plaqueWidth < 180 ? 11 : 13;
  const extraSize = Math.max(9, noteSize - 1);

  return (
    <View style={[styles.frame, { width: plaqueWidth, height: plaqueHeight }]} collapsable={false}>
      <Image
        source={PLAQUE_SIGN}
        style={{ width: plaqueWidth, height: plaqueHeight }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <View
        pointerEvents="none"
        style={[
          styles.copy,
          {
            paddingHorizontal: Math.round(plaqueWidth * 0.12),
            paddingTop: Math.round(plaqueHeight * 0.2),
            paddingBottom: Math.round(plaqueHeight * 0.26),
          },
        ]}
      >
        <Text
          face="serif"
          numberOfLines={extra ? 2 : 3}
          style={{
            color: ink,
            fontSize: noteSize,
            lineHeight: noteSize + 3,
            textAlign: "center",
          }}
          maxFontSizeMultiplier={theme.typography.scaleLimits.content}
        >
          {note}
        </Text>
        {extra ? (
          <Text
            face="serif"
            numberOfLines={2}
            style={{
              marginTop: 2,
              color: ink,
              fontSize: extraSize,
              lineHeight: extraSize + 3,
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
            marginTop: 2,
            color: muted,
            fontSize: Math.max(8, extraSize - 1),
            textAlign: "center",
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
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  copy: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
  },
});
