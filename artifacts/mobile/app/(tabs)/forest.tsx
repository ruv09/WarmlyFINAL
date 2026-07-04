import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import {
  formatEntryDate,
  getJourneyInsights,
  getTreeForMood,
  isBestDay,
 codex/continue-the-discussion-k4xcgp
  type MoodEntry,

  type MoodHistoryEntry,
 main
} from "@/utils/journey";
import { MOOD_ITEMS } from "@/utils/phrases";

const cardShadow = Platform.select({
  web: { boxShadow: "0px 4px 24px rgba(0,0,0,0.07)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
});

const moodMap = Object.fromEntries(MOOD_ITEMS.map((item) => [item.key, item]));

function pluralTrees(n: number): string {
  if (n === 1) return "дерево";
  if (n >= 2 && n <= 4) return "дерева";
  return "деревьев";
}

codex/continue-the-discussion-k4xcgp
function TreeCard({ entry }: { entry: MoodEntry }) {

function TreeCard({ entry }: { entry: MoodHistoryEntry }) {
main
  const colors = useColors();
  const tree = getTreeForMood(entry.mood);
  const mood = moodMap[entry.mood];
  const scale = useRef(new Animated.Value(0.86)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  const s = StyleSheet.create({
    treeCard: {
      width: 172,
      borderRadius: 24,
      backgroundColor: colors.card,
      padding: 16,
      gap: 10,
      ...cardShadow,
    },
    treeTop: {
      minHeight: 92,
      borderRadius: 20,
      backgroundColor:
        colors.background === "#131110" ? colors.muted : tree.softTint,
      alignItems: "center",
      justifyContent: "center",
    },
    treeEmoji: { fontSize: 46 },
    date: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    mood: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    note: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 18,
    },
    victory: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      lineHeight: 18,
    },
  });

  return (
    <Animated.View style={[s.treeCard, { opacity, transform: [{ scale }] }]}>
      <View style={s.treeTop}>
        <Text style={s.treeEmoji}>{tree.emoji}</Text>
      </View>
      <Text style={s.date}>{formatEntryDate(entry.createdAt)}</Text>
      <Text style={s.mood}>
        {mood?.emoji} {mood?.label} · {tree.title}
      </Text>
      <Text style={s.note} numberOfLines={3}>
        {entry.note || "Без заметки"}
      </Text>
      {entry.victory ? <Text style={s.victory}>⭐ {entry.victory}</Text> : null}
    </Animated.View>
  );
}

export default function ForestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { state } = useApp();
  const [zoom, setZoom] = useState(1);

  const entries = state.moodHistory;
  const victories = entries.filter((entry) => entry.victory?.trim());
  const bestDays = entries.filter(isBestDay);
  const insights = useMemo(() => getJourneyInsights(entries), [entries]);
  const latestFavorites = state.favorites.slice(0, 2);

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;
  const forestWidth = Math.max(width - 44, 360);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: 22,
      gap: 18,
    },
    title: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 22,
      marginTop: -8,
    },
    statsRow: { flexDirection: "row", gap: 10 },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      gap: 4,
      ...cardShadow,
    },
    statValue: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    zoomRow: { flexDirection: "row", gap: 8 },
    zoomBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      ...cardShadow,
    },
    forestShell: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 14,
      minHeight: 260,
      ...cardShadow,
    },
    forestCanvas: {
      width: forestWidth,
      minHeight: 230,
      borderRadius: 22,
      backgroundColor:
        colors.background === "#131110" ? colors.muted : colors.mint,
      padding: 14,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 14,
      alignContent: "flex-start",
    },
    emptyForest: {
      flex: 1,
      minHeight: 220,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: 24,
    },
    emptyTitle: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
    },
    warmCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 20,
      gap: 14,
      ...cardShadow,
    },
    warmRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    warmIcon: {
      width: 38,
      height: 38,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    warmTextWrap: { flex: 1, gap: 2 },
    warmTitle: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    warmSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 18,
    },
    insightCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 18,
      gap: 10,
      ...cardShadow,
    },
    insightText: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      lineHeight: 24,
    },
  });

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.title}>Мой лес</Text>
      <Text style={s.subtitle}>
        Каждая запись становится деревом. Даже тихий или грустный день — часть
        твоего пути.
      </Text>

      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statValue}>{entries.length}</Text>
          <Text style={s.statLabel}>{pluralTrees(entries.length)} в лесу</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValue}>{victories.length}</Text>
          <Text style={s.statLabel}>маленьких побед</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValue}>{bestDays.length}</Text>
          <Text style={s.statLabel}>лучших дней</Text>
        </View>
      </View>

      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Лес записей</Text>
        <View style={s.zoomRow}>
          <Pressable
            style={({ pressed }) => [s.zoomBtn, pressed && { opacity: 0.75 }]}
            onPress={() => setZoom((value) => Math.max(0.85, value - 0.1))}
          >
            <Ionicons name="remove" size={18} color={colors.primary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.zoomBtn, pressed && { opacity: 0.75 }]}
            onPress={() => setZoom((value) => Math.min(1.25, value + 0.1))}
          >
            <Ionicons name="add" size={18} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <View style={s.forestShell}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Animated.View
            style={[s.forestCanvas, { transform: [{ scale: zoom }] }]}
          >
            {entries.length === 0 ? (
              <View style={s.emptyForest}>
                <Text style={{ fontSize: 42 }}>🌱</Text>
                <Text style={s.emptyTitle}>Лес скоро появится</Text>
                <Text style={s.emptyText}>
                  Сохрани первую запись на вкладке «Настроение», и здесь
                  вырастет дерево.
                </Text>
              </View>
            ) : (
              entries.map((entry) => <TreeCard key={entry.id} entry={entry} />)
            )}
          </Animated.View>
        </ScrollView>
      </View>

      <Text style={s.sectionTitle}>Тёплые моменты</Text>
      <View style={s.warmCard}>
        <View style={s.warmRow}>
          <View style={[s.warmIcon, { backgroundColor: colors.amber }]}>
            <Text>⭐</Text>
          </View>
          <View style={s.warmTextWrap}>
            <Text style={s.warmTitle}>Маленькие победы</Text>
            <Text style={s.warmSub}>
              {victories[0]?.victory ??
                "Появятся здесь после сохранения записи."}
            </Text>
          </View>
        </View>
        <View style={s.warmRow}>
          <View style={[s.warmIcon, { backgroundColor: colors.rose }]}>
            <Text>❤️</Text>
          </View>
          <View style={s.warmTextWrap}>
            <Text style={s.warmTitle}>Любимые цитаты</Text>
            <Text style={s.warmSub}>
              {latestFavorites[0] ??
                "Сохрани цитату с главного экрана, чтобы вернуться к ней позже."}
            </Text>
          </View>
        </View>
        <View style={s.warmRow}>
          <View style={[s.warmIcon, { backgroundColor: colors.mint }]}>
            <Text>🌳</Text>
          </View>
          <View style={s.warmTextWrap}>
            <Text style={s.warmTitle}>Лучшие дни</Text>
            <Text style={s.warmSub}>
              {bestDays[0]
                ? `${formatEntryDate(bestDays[0].createdAt)} · ${bestDays[0].victory}`
                : "Дни с хорошим настроением и победой будут отмечаться автоматически."}
            </Text>
          </View>
        </View>
      </View>

      {insights.length > 0 && (
        <>
          <Text style={s.sectionTitle}>Инсайты</Text>
          {insights.map((insight) => (
            <View key={insight} style={s.insightCard}>
              <Text style={s.insightText}>🌱 {insight}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
