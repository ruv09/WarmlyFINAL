import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  Alert,
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
 codex/continue-the-discussion-dymt18
import { isBestDay } from "@/utils/journey";
import { MOOD_ITEMS } from "@/utils/phrases";

import { MOOD_ITEMS, type MoodKey } from "@/utils/phrases";
main

const moodMap = Object.fromEntries(MOOD_ITEMS.map((item) => [item.key, item]));

const cardShadow = Platform.select({
  web: { boxShadow: "0px 4px 16px rgba(0,0,0,0.06)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
});

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (isoDate === today) return "Сегодня";
  if (isoDate === yesterday) return "Вчера";
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

function getMostCommonMood(moods: MoodKey[]): MoodKey | null {
  if (moods.length === 0) return null;
  const counts: Partial<Record<MoodKey, number>> = {};
  for (const m of moods) counts[m] = (counts[m] ?? 0) + 1;
  return (Object.entries(counts) as [MoodKey, number][]).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
  )[0];
}

export default function CalendarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, deleteMoodEntry } = useApp();
  const [expandedDates, setExpandedDates] = useState<Set<string>>(
    () => new Set([new Date().toISOString().slice(0, 10)]),
  );

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const grouped = useMemo(() => {
    const map = new Map<string, typeof state.moodHistory>();
    for (const entry of state.moodHistory) {
      const date = entry.createdAt.slice(0, 10);
      const existing = map.get(date) ?? [];
      map.set(date, [...existing, entry]);
    }
    return [...map.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, entries]) => ({
        date,
        entries: [...entries].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      }));
  }, [state.moodHistory]);

  const totalEntries = state.moodHistory.length;
  const activeDays = grouped.length;

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const handleDelete = (entryId: string, moodKey: MoodKey, createdAt: string) => {
    const mood = moodMap[moodKey];
    Alert.alert(
      "Удалить запись?",
      `${mood?.emoji} ${mood?.label} · ${formatTime(createdAt)}`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: () => {
            deleteMoodEntry(entryId);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ],
    );
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: 22,
      gap: 16,
    },
    title: {
codex/continue-the-discussion-dymt18
      fontSize: 32,

      fontSize: 30,
 main
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -8,
    },
codex/continue-the-discussion-dymt18
    dayBlock: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      gap: 10,
    },
    dayTitle: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    row: {
      backgroundColor: colors.muted,
      borderRadius: 14,
      padding: 12,
      gap: 4,
    },
    bestRow: {
      backgroundColor: colors.amber,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    moodLine: {

    statsRow: {
      flexDirection: "row",
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 16,
      alignItems: "center",
      gap: 4,
      ...cardShadow,
    },
    statNumber: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    dayBlock: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      ...cardShadow,
    },
    dayHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    dayHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    dayTitle: {
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    dayStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    dayCount: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    topMoodPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.amber,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 100,
    },
    topMoodText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    entryRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 11,
      gap: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    entryEmoji: {
      fontSize: 22,
      width: 30,
      textAlign: "center",
    },
    entryBody: {
      flex: 1,
      gap: 2,
    },
    entryMoodRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    entryMood: {
main
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
codex/continue-the-discussion-dymt18
    note: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
    },
    victory: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      lineHeight: 20,

    entryTime: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    entryNote: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
    deleteBtn: {
      width: 30,
      height: 30,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.muted,
 main
    },
    empty: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 22,
    },
  });

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.title}>Календарь</Text>
      <Text style={s.subtitle}>История твоих чувств и заметок</Text>

codex/continue-the-discussion-dymt18
      {grouped.length === 0 ? (
        <Text style={s.empty}>
          Пока нет записей. Отметь настроение и добавь заметку на вкладке
          «Настроение».
        </Text>
      ) : (
        grouped.map(([date, entries]) => (
          <View key={date} style={s.dayBlock}>
            <Text style={s.dayTitle}>{date}</Text>
            {entries.map((entry) => {
              const mood = moodMap[entry.mood];
              return (
                <View
                  key={entry.id}
                  style={[s.row, isBestDay(entry) && s.bestRow]}
                >
                  <Text style={s.moodLine}>
                    {mood?.emoji} {mood?.label}
                  </Text>
                  <Text style={s.note}>{entry.note || "Без заметки"}</Text>
                  {entry.victory ? (
                    <Text style={s.victory}>⭐ {entry.victory}</Text>
                  ) : null}
                </View>

      {/* Overall stats */}
      {totalEntries > 0 && (
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statNumber}>{totalEntries}</Text>
            <Text style={s.statLabel}>Всего{"\n"}записей</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statNumber}>{activeDays}</Text>
            <Text style={s.statLabel}>Активных{"\n"}дней</Text>
          </View>
          <View style={s.statCard}>
            {(() => {
              const allMoods = state.moodHistory.map((e) => e.mood);
              const top = getMostCommonMood(allMoods);
              const mood = top ? moodMap[top] : null;
              return (
                <>
                  <Text style={s.statNumber}>{mood?.emoji ?? "—"}</Text>
                  <Text style={s.statLabel}>{mood?.label ?? "Нет данных"}</Text>
                </>
 main
              );
            })()}
          </View>
        </View>
      )}

      {grouped.length === 0 ? (
        <Text style={s.empty}>
          Пока нет записей. Отметь настроение на вкладке «Настроение».
        </Text>
      ) : (
        grouped.map(({ date, entries }) => {
          const isExpanded = expandedDates.has(date);
          const moods = entries.map((e) => e.mood);
          const topMood = getMostCommonMood(moods);
          const topMoodItem = topMood ? moodMap[topMood] : null;

          return (
            <View key={date} style={s.dayBlock}>
              <Pressable
                style={({ pressed }) => [s.dayHeader, pressed && { opacity: 0.8 }]}
                onPress={() => toggleDate(date)}
              >
                <View style={s.dayHeaderLeft}>
                  <View>
                    <Text style={s.dayTitle}>{formatDateLabel(date)}</Text>
                    <View style={s.dayStats}>
                      <Text style={s.dayCount}>{entries.length} {entries.length === 1 ? "запись" : entries.length < 5 ? "записи" : "записей"}</Text>
                      {topMoodItem && (
                        <View style={s.topMoodPill}>
                          <Text>{topMoodItem.emoji}</Text>
                          <Text style={s.topMoodText}>{topMoodItem.label}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>

              {isExpanded && entries.map((entry) => {
                const mood = moodMap[entry.mood];
                return (
                  <View key={entry.id} style={s.entryRow}>
                    <Text style={s.entryEmoji}>{mood?.emoji}</Text>
                    <View style={s.entryBody}>
                      <View style={s.entryMoodRow}>
                        <Text style={s.entryMood}>{mood?.label}</Text>
                        <Text style={s.entryTime}>{formatTime(entry.createdAt)}</Text>
                      </View>
                      {entry.note ? (
                        <Text style={s.entryNote}>{entry.note}</Text>
                      ) : (
                        <Text style={[s.entryNote, { fontStyle: "italic" }]}>Без заметки</Text>
                      )}
                    </View>
                    <Pressable
                      style={({ pressed }) => [s.deleteBtn, pressed && { opacity: 0.7 }]}
                      onPress={() => handleDelete(entry.id, entry.mood, entry.createdAt)}
                    >
                      <Ionicons name="trash-outline" size={14} color="#D94F3D" />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
