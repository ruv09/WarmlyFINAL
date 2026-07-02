import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { isBestDay } from "@/utils/journey";
import { MOOD_ITEMS } from "@/utils/phrases";

const moodMap = Object.fromEntries(MOOD_ITEMS.map((item) => [item.key, item]));

export default function CalendarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useApp();

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const grouped = useMemo(() => {
    const map = new Map<string, typeof state.moodHistory>();
    for (const entry of state.moodHistory) {
      const date = entry.createdAt.slice(0, 10);
      map.set(date, [...(map.get(date) ?? []), entry]);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [state.moodHistory]);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: 22,
      gap: 16,
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
      marginTop: -8,
    },
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
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
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
      <Text style={s.subtitle}>История твоих чувств и заметок по дням</Text>

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
              );
            })}
          </View>
        ))
      )}
    </ScrollView>
  );
}
