import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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
import { useResponsive } from "@/utils/responsive";
import { buildAiPhrase, getFallbackQuote, getGreeting, MOOD_ITEMS } from "@/utils/phrases";

const cardShadow = Platform.select({
  web: { boxShadow: "0px 4px 24px rgba(0,0,0,0.07)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
});

const softShadow = Platform.select({
  web: { boxShadow: "0px 2px 12px rgba(0,0,0,0.05)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
});

function formatDate(): string {
  const now = new Date();
  const days = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
  const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { rf, hPad, isSmall } = useResponsive();
  const { state, addFavorite } = useApp();
  const [saved, setSaved] = useState(false);

  const quote = useMemo(
    () => (state.aiEnabled ? buildAiPhrase(state.mood) : getFallbackQuote()),
    [state.aiEnabled, state.mood],
  );

  const isFav = state.favorites.includes(quote);
  const activeMoodItem = MOOD_ITEMS.find((m) => m.key === state.mood);

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 88;

  const handleAddFav = () => {
    if (isFav) return;
    addFavorite(quote);
    setSaved(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setSaved(false), 2000);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: hPad,
      gap: isSmall ? 14 : 18,
    },
    date: {
      fontSize: rf(13),
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    greeting: {
      fontSize: rf(isSmall ? 26 : 30),
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
      lineHeight: rf(isSmall ? 34 : 38),
    },
    subtitle: {
      fontSize: rf(14),
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    quoteCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: isSmall ? 20 : 26,
      gap: 12,
      ...cardShadow,
    },
    quotePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.amber,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 100,
      alignSelf: "flex-start",
    },
    quotePillText: {
      fontSize: rf(11),
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    quoteMark: {
      fontSize: rf(44),
      color: colors.primary,
      fontFamily: "Inter_700Bold",
      lineHeight: rf(36),
      opacity: 0.2,
    },
    quoteText: {
      fontSize: rf(isSmall ? 16 : 18),
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
      lineHeight: rf(isSmall ? 26 : 30),
      fontStyle: "italic",
    },
    quoteFooter: { flexDirection: "row" },
    favBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 100,
      backgroundColor: colors.muted,
    },
    favBtnActive: { backgroundColor: "#FCEEED" },
    favBtnText: { fontSize: rf(13), color: colors.mutedForeground, fontFamily: "Inter_500Medium" },
    favBtnTextActive: { color: "#D94F3D" },
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
    moodBadgeText: { fontSize: rf(13), fontFamily: "Inter_500Medium", color: colors.primary },
    sectionTitle: { fontSize: rf(17), fontFamily: "Inter_700Bold", color: colors.foreground },
    sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    sectionLink: { fontSize: rf(13), color: colors.primary, fontFamily: "Inter_500Medium" },
    todayList: {
      backgroundColor: colors.card,
      borderRadius: 24,
      overflow: "hidden",
      ...cardShadow,
    },
    todayItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: isSmall ? 16 : 20,
      paddingVertical: isSmall ? 13 : 15,
    },
    todayDivider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    todayIcon: {
      width: isSmall ? 38 : 44,
      height: isSmall ? 38 : 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
      flexShrink: 0,
    },
    todayBody: { flex: 1, gap: 2 },
    todayTitle: { fontSize: rf(14), fontFamily: "Inter_600SemiBold", color: colors.foreground },
    todaySub: { fontSize: rf(12), fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    favCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: isSmall ? 16 : 20,
      ...softShadow,
    },
    favCardText: {
      fontSize: rf(14),
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      fontStyle: "italic",
      lineHeight: rf(22),
    },
  });

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ gap: 2 }}>
        <Text style={s.date}>{formatDate()}</Text>
        <Text style={s.greeting} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
          {getGreeting(state.name)} 🌞
        </Text>
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
        <View style={s.quotePill}>
          <Ionicons name="sunny" size={12} color={colors.primary} />
          <Text style={s.quotePillText}>Мысль дня</Text>
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
              size={15}
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
        <Text style={s.sectionTitle}>На сегодня</Text>
        <View style={s.todayList}>
          <Pressable
            style={({ pressed }) => [s.todayItem, pressed && { opacity: 0.7 }]}
            onPress={() => router.push("/(tabs)/mood")}
          >
            <View style={[s.todayIcon, { backgroundColor: colors.rose }]}>
              <Ionicons name="pulse-outline" size={20} color="#D94F3D" />
            </View>
            <View style={s.todayBody}>
              <Text style={s.todayTitle} numberOfLines={1}>Оценка настроения</Text>
              <Text style={s.todaySub} numberOfLines={1}>
                {state.mood ? "Выполнено ✓" : "Как ты себя чувствуешь?"}
              </Text>
            </View>
            <Ionicons
              name={state.mood ? "checkmark-circle" : "chevron-forward"}
              size={20}
              color={state.mood ? "#5DAA7A" : colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.todayItem, s.todayDivider, pressed && { opacity: 0.7 }]}
            onPress={() => router.push("/(tabs)/favorites")}
          >
            <View style={[s.todayIcon, { backgroundColor: colors.lavender }]}>
              <Ionicons name="heart-outline" size={20} color="#8B7BD4" />
            </View>
            <View style={s.todayBody}>
              <Text style={s.todayTitle} numberOfLines={1}>Избранные цитаты</Text>
              <Text style={s.todaySub} numberOfLines={1}>
                {state.favorites.length > 0
                  ? `${state.favorites.length} сохранённых`
                  : "Сохрани первую цитату"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.todayItem, s.todayDivider, pressed && { opacity: 0.7 }]}
            onPress={() => router.push("/(tabs)/mood")}
          >
            <View style={[s.todayIcon, { backgroundColor: colors.mint }]}>
              <Ionicons name="journal-outline" size={20} color="#5DAA7A" />
            </View>
            <View style={s.todayBody}>
              <Text style={s.todayTitle} numberOfLines={1}>Дневник настроения</Text>
              <Text style={s.todaySub} numberOfLines={1}>
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
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Избранное</Text>
            <Pressable onPress={() => router.push("/(tabs)/favorites")}>
              <Text style={s.sectionLink}>Все →</Text>
            </Pressable>
          </View>
          {state.favorites.slice(0, 2).map((fav, i) => (
            <View key={i} style={s.favCard}>
              <Text style={s.favCardText} numberOfLines={3}>«{fav}»</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
