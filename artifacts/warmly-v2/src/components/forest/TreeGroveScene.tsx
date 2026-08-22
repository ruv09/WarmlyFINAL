import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ScaleView } from "../animation";
import { TreeIllustration } from "../tree/TreeIllustration";
import { CatalogItem } from "../../services/forest/catalog";
import { getMoodById } from "../../constants/moods";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

const SCENE_LIGHT = require("../../../assets/forest/scene-light.jpg");
const SCENE_DARK = require("../../../assets/forest/scene-dark.jpg");

type Props = {
  item: CatalogItem;
  onClose: () => void;
};

function formatPlaqueDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Статичная сцена дерева: лес, выбранное дерево, деревянная табличка.
 * Кнопка назад — правый нижний угол, поверх сцены (не под ScaleView).
 */
export function TreeGroveScene({ item, onClose }: Props) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const [shown, setShown] = useState(false);
  const treeSize = Math.round(Math.min(width * 0.62, height * 0.36, 280));
  const plaqueMaxH = Math.round(height * 0.32);
  const mood = getMoodById(item.entry.moodId);

  useEffect(() => {
    setShown(true);
  }, []);

  return (
    <View style={styles.fill} accessibilityViewIsModal>
      <Image
        source={isDark ? SCENE_DARK : SCENE_LIGHT}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <SafeAreaView edges={["top", "left", "right"]} style={styles.fill} pointerEvents="box-none">
        <ScaleView visible={shown} from={0.96} duration="base" style={styles.stage} pointerEvents="box-none">
          <View style={styles.treeWrap} pointerEvents="none">
            <TreeIllustration tree={item.tree} size={treeSize} />
          </View>

          <View
            style={[
              styles.plaque,
              {
                backgroundColor: isDark ? "#3A3228F2" : "#E4C89AF2",
                borderColor: isDark ? "#6A5340" : "#B08958",
                maxHeight: plaqueMaxH,
                width: Math.min(width - 48, 360),
              },
            ]}
          >
            <View style={styles.plaqueInner}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.caption,
                  color: isDark ? "#D4C4A8" : "#6A5340",
                  textTransform: "capitalize",
                }}
                maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
              >
                {formatPlaqueDate(item.entry.date)}
              </Text>
              {mood ? (
                <View style={styles.moodRow}>
                  <View style={[styles.moodDot, { backgroundColor: mood.color }]} />
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.caption,
                      color: isDark ? "#F2EBE3" : "#3A342C",
                      fontWeight: theme.typography.weights.medium,
                    }}
                    maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
                  >
                    {mood.label}
                  </Text>
                </View>
              ) : null}
              <ScrollView
                style={{ maxHeight: plaqueMaxH - 72 }}
                contentContainerStyle={{ paddingTop: 12 }}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {item.entry.note.length > 0 ? (
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.body,
                      color: isDark ? "#F2EBE3" : "#3A342C",
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
          </View>
        </ScaleView>
      </SafeAreaView>

      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Назад к каталогу"
        hitSlop={12}
        style={[
          styles.backBtn,
          {
            right: 20,
            bottom: Math.max(insets.bottom, 10) + 18,
            backgroundColor: isDark ? "#2A2340F2" : "#FFF9F0F2",
            borderColor: isDark ? "#FFFFFF22" : "#C4A07A66",
          },
        ]}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 88,
  },
  treeWrap: {
    alignItems: "center",
    marginBottom: 8,
  },
  plaque: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 4,
  },
  plaqueInner: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(90, 70, 40, 0.22)",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  backBtn: {
    position: "absolute",
    zIndex: 30,
    elevation: 12,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
