import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { buildAiPhrase, getFallbackQuote, getGreeting, MOOD_ITEMS } from "@/utils/phrases";

const { width } = Dimensions.get("window");

function formatDate(): string {
  const now = new Date();
  const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

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

const softShadow = Platform.select({
  web: { boxShadow: "0px 2px 12px rgba(0,0,0,0.05)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
});

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, addFavorite } = useApp();
  const [saved, setSaved] = useState(false);

  const quote = useMemo(
    () => (state.aiEnabled ? buildAiPhrase(state.mood) : getFallbackQuote()),
    [state.aiEnabled, state.mood],
  );

  const isFav = state.favorites.includes(quote);

  const handleAddFav = () => {
    if (isFav) return;
    addFavorite(quote);
    setSaved(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setSaved(false), 2000);
  };

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const activeMoodItem = MOOD_ITEMS.find((m) => m.key === state.mood);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: 22,
      gap: 20,
    },
    header: { gap: 4 },
    date: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      letterSpacing: 0.2,
    },
    greeting: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    subtitle: {
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 4,
    },
    quoteCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 28,
      gap: 16,
      ...cardShadow,
    },
    quoteTopRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    quotePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.amber,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 100,
    },
    quotePillText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    quoteText: {
      fontSize: 20,
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
      lineHeight: 32,
      fontStyle: "italic",
    },
    quoteMark: {
      fontSize: 52,
      color: colors.primary,
      fontFamily: "Inter_700Bold",
      lineHeight: 44,
      opacity: 0.25,
    },
    quoteFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
    },
    favBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 100,
      backgroundColor: colors.muted,
    },
    favBtnActive: { backgroundColor: "#FCEEED" },
    favBtnText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
    favBtnTextActive: { color: "#D94F3D" },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    sectionLink: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
    },
    todayList: {
      backgroundColor: colors.card,
      borderRadius: 24,
      overflow: "hidden",
      ...cardShadow,
    },
    todayItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    todayItemDivider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    todayItemIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    todayItemBody: { flex: 1, gap: 2 },
    todayItemTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    todayItemSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    moodBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.amber,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 100,
      alignSelf: "flex-start",
      ...softShadow,
    },
    moodBadgeText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    favPreviewCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      ...softShadow,
    },
    favPreviewText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      fontStyle: "italic",
      lineHeight: 22,
    },
  });

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.date}>{formatDate()}</Text>
        <Text style={s.greeting}>{getGreeting(state.name)} 🌞</Text>
        <Text style={s.subtitle}>Заботься о себе сегодня</Text>
      </View>

      {/* Mood badge */}
      {activeMoodItem && (
        <View style={s.moodBadge}>
          <Text style={{ fontSize: 16 }}>{activeMoodItem.emoji}</Text>
          <Text style={s.moodBadgeText}>
            Настроение: {activeMoodItem.label.toLowerCase()}
          </Text>
        </View>
      )}

      {/* Quote card */}
      <View style={s.quoteCard}>
        <View style={s.quoteTopRow}>
          <View style={s.quotePill}>
            <Ionicons name="sunny" size={12} color={colors.primary} />
            <Text style={s.quotePillText}>Мысль дня</Text>
          </View>
        </View>
        <Text style={s.quoteMark}>"</Text>
        <Text style={s.quoteText}>{quote}</Text>
        <View style={s.quoteFooter}>
          <Pressable
            style={({ pressed }) => [
              s.favBtn,
              (isFav || saved) && s.favBtnActive,
              pressed && { opacity: 0.75 },
            ]}
            onPress={handleAddFav}
          >
            <Ionicons
              name={isFav || saved ? "heart" : "heart-outline"}
              size={16}
              color={isFav || saved ? "#D94F3D" : colors.mutedForeground}
            />
            <Text style={[s.favBtnText, (isFav || saved) && s.favBtnTextActive]}>
              {saved ? "Сохранено!" : isFav ? "В избранном" : "В избранное"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Today section */}
      <View style={{ gap: 12 }}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>На сегодня</Text>
        </View>

        <View style={s.todayList}>
          {/* Mood check-in */}
          <Pressable
            style={({ pressed }) => [s.todayItem, pressed && { opacity: 0.75 }]}
            onPress={() => router.push("/(tabs)/mood")}
          >
            <View style={[s.todayItemIcon, { backgroundColor: colors.rose }]}>
              <Ionicons name="pulse-outline" size={20} color="#D94F3D" />
            </View>
            <View style={s.todayItemBody}>
              <Text style={s.todayItemTitle}>Оценка настроения</Text>
              <Text style={s.todayItemSub}>
                {state.mood ? "Выполнено ✓" : "Как ты себя чувствуешь?"}
              </Text>
            </View>
            <Ionicons
              name={state.mood ? "checkmark-circle" : "chevron-forward"}
              size={20}
              color={state.mood ? "#5DAA7A" : colors.mutedForeground}
            />
          </Pressable>

          {/* Favorites */}
          <Pressable
            style={({ pressed }) => [s.todayItem, s.todayItemDivider, pressed && { opacity: 0.75 }]}
            onPress={() => router.push("/(tabs)/favorites")}
          >
            <View style={[s.todayItemIcon, { backgroundColor: colors.lavender }]}>
              <Ionicons name="heart-outline" size={20} color="#8B7BD4" />
            </View>
            <View style={s.todayItemBody}>
              <Text style={s.todayItemTitle}>Избранные цитаты</Text>
              <Text style={s.todayItemSub}>
                {state.favorites.length > 0
                  ? `${state.favorites.length} сохранённых`
                  : "Сохрани первую цитату"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
          </Pressable>

          {/* Daily note reminder */}
          <Pressable
            style={({ pressed }) => [s.todayItem, s.todayItemDivider, pressed && { opacity: 0.75 }]}
            onPress={() => router.push("/(tabs)/mood")}
          >
            <View style={[s.todayItemIcon, { backgroundColor: colors.mint }]}>
              <Ionicons name="journal-outline" size={20} color="#5DAA7A" />
            </View>
            <View style={s.todayItemBody}>
              <Text style={s.todayItemTitle}>Дневник настроения</Text>
              <Text style={s.todayItemSub}>
                {state.moodNoteSubmitted ? "Запись добавлена ✓" : "Запиши, как прошёл день"}
              </Text>
            </View>
            <Ionicons
              name={state.moodNoteSubmitted ? "checkmark-circle" : "chevron-forward"}
              size={20}
              color={state.moodNoteSubmitted ? "#5DAA7A" : colors.mutedForeground}
            />
          </Pressable>
        </View>
      </View>

      {/* Favorites preview */}
      {state.favorites.length > 0 && (
        <View style={{ gap: 12 }}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Избранное</Text>
            <Pressable onPress={() => router.push("/(tabs)/favorites")}>
              <Text style={s.sectionLink}>Все →</Text>
            </Pressable>
          </View>
          {state.favorites.slice(0, 2).map((fav, i) => (
            <View key={i} style={s.favPreviewCard}>
              <Text style={s.favPreviewText}>«{fav}»</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
