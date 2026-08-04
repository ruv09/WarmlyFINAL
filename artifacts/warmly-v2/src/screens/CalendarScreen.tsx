import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../components/layout";
import { EntryCard } from "../components/entry";
import { useEntries } from "../hooks";
import { useTheme } from "../theme";
import { ROUTES } from "../constants/routes";
import { formatHumanDate, toDateKey } from "../utils/date";
import { buildMonthGrid, formatMonthYear, WEEKDAY_LABELS_RU } from "../utils/calendarGrid";

/**
 * Сетка месяца (как в референсе) вместо горизонтального списка дат:
 * дни недели Пн-Вс, точка под днём с записями, кружок у выбранного/
 * сегодняшнего дня. Список записей выбранного дня — под сеткой.
 */
export function CalendarScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { entries } = useEntries();

  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string>(toDateKey());

  const datesWithEntries = useMemo(() => new Set(entries.map((entry) => entry.date)), [entries]);
  const grid = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor]);
  const todayKey = useMemo(() => toDateKey(today), [today]);

  const entriesForSelectedDate = useMemo(
    () => entries.filter((entry) => entry.date === selectedDate),
    [entries, selectedDate],
  );

  function changeMonth(delta: number) {
    setCursor((prev) => {
      const date = new Date(prev.year, prev.month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  const renderEntry = useCallback(
    ({ item }: { item: (typeof entriesForSelectedDate)[number] }) => (
      <View style={{ marginBottom: theme.spacing("sm") }}>
        <EntryCard entry={item} onPress={() => router.push(ROUTES.entry(item.id))} />
      </View>
    ),
    [theme, router],
  );

  const weeks = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  return (
    <Screen scroll={false} edges={["top", "left", "right"]}>
      <Text
        style={{
          fontSize: theme.typography.sizes.title,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing("md"),
        }}
      >
        Календарь
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: theme.spacing("sm"),
        }}
      >
        <Pressable onPress={() => changeMonth(-1)} hitSlop={8}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.textSecondary} />
        </Pressable>
        <Text style={{ color: theme.colors.textPrimary, fontWeight: theme.typography.weights.medium }}>
          {formatMonthYear(cursor.year, cursor.month)}
        </Text>
        <Pressable onPress={() => changeMonth(1)} hitSlop={8}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", marginBottom: theme.spacing("xs") }}>
        {WEEKDAY_LABELS_RU.map((label) => (
          <Text
            key={label}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: theme.typography.sizes.caption,
              color: theme.colors.textSecondary,
            }}
          >
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={{ flexDirection: "row" }}>
          {week.map((day) => {
            const isSelected = day.dateKey === selectedDate;
            const isToday = day.dateKey === todayKey;
            const hasEntries = datesWithEntries.has(day.dateKey);

            return (
              <Pressable
                key={day.dateKey}
                onPress={() => setSelectedDate(day.dateKey)}
                style={{ flex: 1, alignItems: "center", paddingVertical: theme.spacing("xs") }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: theme.radius.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? theme.colors.accent : "transparent",
                    borderWidth: isToday && !isSelected ? 1 : 0,
                    borderColor: theme.colors.accent,
                  }}
                >
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.caption,
                      color: isSelected
                        ? theme.colors.surface
                        : day.isCurrentMonth
                          ? theme.colors.textPrimary
                          : theme.colors.textSecondary,
                      opacity: day.isCurrentMonth ? 1 : 0.4,
                    }}
                  >
                    {day.date.getDate()}
                  </Text>
                </View>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    marginTop: 3,
                    backgroundColor: hasEntries ? theme.colors.accentWarm : "transparent",
                  }}
                />
              </Pressable>
            );
          })}
        </View>
      ))}

      <Text
        style={{
          color: theme.colors.textSecondary,
          marginVertical: theme.spacing("md"),
        }}
      >
        {formatHumanDate(selectedDate)}
      </Text>

      <View style={{ flex: 1 }}>
        {entriesForSelectedDate.length === 0 ? (
          <Text style={{ color: theme.colors.textSecondary }}>Нет записей за этот день.</Text>
        ) : (
          <FlatList
            data={entriesForSelectedDate}
            keyExtractor={(entry) => entry.id}
            renderItem={renderEntry}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Screen>
  );
}
