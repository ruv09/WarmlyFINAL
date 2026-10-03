import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui";
import { CatalogItem } from "../../services/forest/catalog";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

const BOARD = require("../../../assets/forest/plaque-board.png");
const BOARD_ASPECT = 851 / 462;

type Props = {
  item: CatalogItem;
  onClose: () => void;
};

function fullNote(item: CatalogItem): { note: string; extra?: string } {
  const note = (item.entry.note ?? "").trim();
  const extra = (item.entry.smallWin ?? "").trim();
  if (note && extra) return { note, extra };
  if (note) return { note };
  if (extra) return { note: extra };
  return { note: "Без текста" };
}

/**
 * Большая доска поверх сцены: весь текст записи, без обрезки.
 */
export function PlaqueReading({ item, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const { note, extra } = fullNote(item);
  const dateLabel = [
    parseDateKey(item.entry.date).toLocaleDateString("ru-RU"),
    item.entry.time,
  ]
    .filter(Boolean)
    .join("  ");

  const width = Math.min(window.width - 32, 400);
  const height = Math.min(Math.round(width / BOARD_ASPECT), Math.round(window.height * 0.62));

  return (
    <View style={styles.layer} accessibilityViewIsModal>
      <Pressable
        style={styles.dim}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Закрыть запись"
      />
      <View
        style={[
          styles.boardWrap,
          {
            width,
            height,
            marginBottom: Math.max(insets.bottom, 12),
          },
        ]}
        accessibilityRole="text"
        accessibilityLabel={`${note}${extra ? `. ${extra}` : ""}. ${dateLabel}`}
      >
        <Image
          source={BOARD}
          style={{ width, height }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{
            paddingHorizontal: Math.round(width * 0.1),
            paddingTop: Math.round(height * 0.14),
            paddingBottom: Math.round(height * 0.16),
            flexGrow: 1,
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator
        >
          <Text
            face="serif"
            style={{
              color: "#2A1C10",
              fontSize: 17,
              lineHeight: 26,
              textAlign: "center",
            }}
            maxFontSizeMultiplier={theme.typography.scaleLimits.content}
          >
            {note}
          </Text>
          {extra ? (
            <Text
              face="serif"
              style={{
                marginTop: 12,
                color: "#2A1C10",
                fontSize: 15,
                lineHeight: 23,
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
              marginTop: 14,
              color: "#6A4A2C",
              fontSize: theme.typography.sizes.caption,
              textAlign: "center",
            }}
            maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
          >
            {dateLabel}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
    elevation: 40,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(18, 16, 12, 0.42)",
  },
  boardWrap: {
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  scroll: {
    ...StyleSheet.absoluteFill,
  },
});
