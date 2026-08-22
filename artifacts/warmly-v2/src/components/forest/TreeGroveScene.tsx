import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ForestAtmosphere } from "./ForestAtmosphere";
import { ScaleView } from "../animation";
import { TreeIllustration } from "../tree/TreeIllustration";
import { CatalogItem } from "../../services/forest/catalog";
import { getMoodById } from "../../constants/moods";
import { ROUTES } from "../../constants/routes";
import { useFavorites } from "../../hooks";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

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
 * Статичная сцена одного дерева по макету: лес + дерево + деревянная табличка.
 */
export function TreeGroveScene({ item, onClose }: Props) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [shown, setShown] = useState(false);
  const treeSize = Math.round(Math.min(300, height * 0.38));
  const plaqueMaxH = Math.round(height * 0.3);
  const mood = getMoodById(item.entry.moodId);
  const favoriteText = item.entry.note.trim() || item.entry.smallWin?.trim() || "";
  const isFav = favoriteText.length > 0 && favorites.includes(favoriteText);

  useEffect(() => {
    setShown(true);
  }, []);

  function openEntryMenu() {
    Alert.alert("Запись", undefined, [
      {
        text: "Изменить",
        onPress: () => router.push(ROUTES.entry(item.entry.id)),
      },
      { text: "Закрыть", style: "cancel" },
    ]);
  }

  async function toggleFavorite() {
    if (!favoriteText) return;
    if (isFav) {
      await removeFavorite(favoriteText);
    } else {
      await addFavorite(favoriteText);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    }
  }

  const chromeBtn = {
    backgroundColor: isDark ? "#2A2340CC" : "#FFF9F0CC",
    borderColor: isDark ? "#FFFFFF22" : "#00000010",
  };

  return (
    <View style={styles.fill} accessibilityViewIsModal>
      <ForestAtmosphere />
      <SafeAreaView edges={["top", "left", "right"]} style={styles.fill}>
        <View style={styles.chromeRow} pointerEvents="box-none">
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Назад к каталогу"
            style={[styles.chromeBtn, chromeBtn]}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.textPrimary} />
          </Pressable>
          <Pressable
            onPress={openEntryMenu}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Меню записи"
            style={[styles.chromeBtn, chromeBtn]}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textPrimary} />
          </Pressable>
        </View>

        <ScaleView visible={shown} from={0.96} duration="base" style={styles.stage}>
          <View style={styles.treeWrap}>
            <TreeIllustration tree={item.tree} size={treeSize} />
          </View>

          <View
            style={[
              styles.plaque,
              {
                backgroundColor: isDark ? "#3A3228EE" : "#E8D4AEEE",
                borderColor: isDark ? "#5A4A38" : "#C4A07A",
                maxHeight: plaqueMaxH,
              },
            ]}
          >
            <View style={styles.plaqueHead}>
              <Text
                style={{
                  flex: 1,
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
            </View>

            <ScrollView
              style={{ maxHeight: plaqueMaxH - 56 }}
              contentContainerStyle={{ paddingTop: 12 }}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {item.entry.note.length > 0 ? (
                <Text
                  style={{
                    fontSize: theme.typography.sizes.body,
                    color: isDark ? "#F2EBE3" : "#3A342C",
                    lineHeight: theme.typography.sizes.body * 1.45,
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

          <Pressable
            onPress={toggleFavorite}
            disabled={!favoriteText}
            accessibilityRole="button"
            accessibilityLabel={isFav ? "Убрать из избранного" : "В избранное"}
            style={[
              styles.heartBtn,
              {
                backgroundColor: isDark ? "#2A2340EE" : "#FFF9F0EE",
                borderColor: theme.colors.border,
                marginBottom: Math.max(insets.bottom, 16) + 12,
                opacity: favoriteText ? 1 : 0.45,
              },
            ]}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={22}
              color={isFav ? theme.colors.accentWarm : theme.colors.textSecondary}
            />
          </Pressable>
        </ScaleView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  chromeRow: {
    position: "absolute",
    top: 8,
    left: 16,
    right: 16,
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chromeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 28,
  },
  treeWrap: {
    alignItems: "center",
    marginBottom: 4,
  },
  plaque: {
    alignSelf: "stretch",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    marginBottom: 16,
  },
  plaqueHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  heartBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
