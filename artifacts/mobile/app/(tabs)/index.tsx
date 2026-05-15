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
import { buildAiPhrase, getFallbackQuote, getGreeting } from "@/utils/phrases";

function formatDate(): string {
  const now = new Date();
  const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  const months = [
    "января","февраля","марта","апреля","мая","июня",
    "июля","августа","сентября","октября","ноября","декабря",
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

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

  const styles = makeStyles(colors, insets);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate()}</Text>
        <Text style={styles.greeting}>{getGreeting(state.name)}</Text>
      </View>

      <View style={styles.quoteCard}>
        <View style={styles.quoteIconRow}>
          <Ionicons name="sunny" size={20} color={colors.primary} />
          <Text style={styles.quoteLabel}>Мысль дня</Text>
        </View>
        <Text style={styles.quoteText}>«{quote}»</Text>
        <View style={styles.quoteActions}>
          <Pressable
            style={({ pressed }) => [styles.favBtn, (isFav || saved) && styles.favBtnActive, pressed && styles.pressed]}
            onPress={handleAddFav}
          >
            <Ionicons
              name={isFav || saved ? "heart" : "heart-outline"}
              size={18}
              color={isFav || saved ? "#E05A4A" : colors.mutedForeground}
            />
            <Text style={[styles.favBtnText, (isFav || saved) && styles.favBtnTextActive]}>
              {saved ? "Сохранено!" : isFav ? "В избранном" : "В избранное"}
            </Text>
          </Pressable>
        </View>
      </View>

      {state.mood && (
        <View style={styles.moodBanner}>
          <Text style={styles.moodBannerText}>
            Сегодня ты чувствуешь себя{" "}
            {state.mood === "good" ? "хорошо 🙂" :
             state.mood === "calm" ? "спокойно 😌" :
             state.mood === "neutral" ? "нейтрально 😐" :
             state.mood === "tired" ? "устал(а) 🥱" :
             state.mood === "anxious" ? "тревожно 😟" : "грустно 😔"}
          </Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [styles.moodCta, pressed && styles.pressed]}
        onPress={() => router.push("/(tabs)/mood")}
      >
        <View style={styles.moodCtaContent}>
          <View style={styles.moodCtaLeft}>
            <Ionicons name="pulse" size={22} color={colors.primary} />
            <View style={styles.moodCtaText}>
              <Text style={styles.moodCtaTitle}>Как прошёл твой день?</Text>
              <Text style={styles.moodCtaSubtitle}>Отметь своё настроение</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </View>
      </Pressable>

      {state.favorites.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Избранные цитаты</Text>
            <Pressable onPress={() => router.push("/(tabs)/favorites")}>
              <Text style={styles.sectionLink}>Все →</Text>
            </Pressable>
          </View>
          {state.favorites.slice(0, 2).map((fav, i) => (
            <View key={i} style={styles.favCard}>
              <Text style={styles.favCardText}>«{fav}»</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) {
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingTop: topPad + 24, paddingBottom: bottomPad, paddingHorizontal: 20, gap: 16 },
    header: { gap: 4, marginBottom: 4 },
    date: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    greeting: { fontSize: 28, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    quoteCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    quoteIconRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    quoteLabel: { fontSize: 12, color: colors.primary, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
    quoteText: { fontSize: 18, color: colors.foreground, fontFamily: "Inter_500Medium", lineHeight: 28, fontStyle: "italic" },
    quoteActions: { flexDirection: "row", marginTop: 4 },
    favBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.muted,
    },
    favBtnActive: { backgroundColor: "#FDE8E6" },
    favBtnText: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_500Medium" },
    favBtnTextActive: { color: "#E05A4A" },
    pressed: { opacity: 0.75 },
    moodBanner: {
      backgroundColor: colors.peachSoft,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    moodBannerText: { fontSize: 14, color: colors.foreground, fontFamily: "Inter_400Regular" },
    moodCta: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },
    moodCtaContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    moodCtaLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
    moodCtaText: { gap: 2 },
    moodCtaTitle: { fontSize: 15, color: colors.foreground, fontFamily: "Inter_600SemiBold" },
    moodCtaSubtitle: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    section: { gap: 12, marginTop: 8 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    sectionTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    sectionLink: { fontSize: 13, color: colors.primary, fontFamily: "Inter_500Medium" },
    favCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    favCardText: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontStyle: "italic", lineHeight: 22 },
  });
}
