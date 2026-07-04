import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { type AppTheme, useTheme } from "@/context/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { scheduleNotificationTestScenario } from "@/utils/notifications";

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

function Avatar({
  name,
  colors,
}: {
  name: string;
  colors: ReturnType<typeof useColors>;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.amber,
        alignItems: "center",
        justifyContent: "center",
        ...cardShadow,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontFamily: "Inter_700Bold",
          color: colors.primary,
        }}
      >
        {initials || "W"}
      </Text>
    </View>
  );
}

const THEME_OPTIONS: {
  value: AppTheme;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: "light", label: "Светлая", icon: "sunny-outline" },
  { value: "dark", label: "Тёмная", icon: "moon-outline" },
  { value: "system", label: "Системная", icon: "phone-portrait-outline" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateField } = useApp();
  const { theme, setTheme } = useTheme();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.name);
  const [isSchedulingTest, setIsSchedulingTest] = useState(false);

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const saveName = () => {
    if (nameInput.trim()) {
      updateField("name", nameInput.trim());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setEditingName(false);
  };

  const runNotificationTest = async () => {
    if (isSchedulingTest) return;

    setIsSchedulingTest(true);
    try {
      const result = await scheduleNotificationTestScenario({
 codex/continue-the-discussion-k4xcgp
        mood: state.mood,

codex/continue-the-discussion-dymt18
        mood: state.mood,
main
 main
        recentPhrases: state.recentAiPhrases,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Тест запущен",
 codex/continue-the-discussion-k4xcgp
        `Запланировано уведомлений: ${result.count}. Первое придёт примерно через ${result.firstDelaySeconds} секунд. Для полной проверки сверни приложение или заблокируй экран.`,

codex/continue-the-discussion-dymt18
        `Запланировано уведомлений: ${result.count}. Первое придёт примерно через ${result.firstDelaySeconds} секунд. Для полной проверки сверни приложение или заблокируй экран.`,

        `Запланировано уведомлений: ${result.count}. Первое придёт примерно через ${result.firstDelaySeconds} секунд. Сверни приложение или заблокируй экран.`,
 main
 main
      );
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Не удалось запустить тест",
 codex/continue-the-discussion-k4xcgp
        "Проверь разрешение уведомлений в настройках устройства.",

codex/continue-the-discussion-dymt18
        "Проверь, что уведомления разрешены для Expo Go / Warmly в настройках iOS.",

        "Проверь, что уведомления разрешены для Warmly в настройках.",
main
 main
      );
    } finally {
      setIsSchedulingTest(false);
    }
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: 22,
      gap: 20,
    },
    title: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    profileHeader: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 24,
      alignItems: "center",
      gap: 12,
      ...cardShadow,
    },
    userName: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    editBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 100,
      backgroundColor: colors.muted,
    },
    editBtnText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 24,
      overflow: "hidden",
      ...cardShadow,
    },
    sectionLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
      paddingHorizontal: 22,
      paddingTop: 18,
      paddingBottom: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 22,
      paddingVertical: 15,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    rowFirst: { borderTopWidth: 0 },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
      paddingRight: 12,
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    rowLabel: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      flexShrink: 1,
    },
    rowSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      flexShrink: 1,
    },
    rowValue: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    nameEditPad: {
      paddingHorizontal: 22,
      paddingBottom: 18,
      paddingTop: 6,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      gap: 12,
    },
    nameInput: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      backgroundColor: colors.muted,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    saveBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 12,
      alignItems: "center",
    },
    saveBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    themeRow: {
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 22,
      paddingBottom: 18,
    },
    themeOption: {
      flex: 1,
      alignItems: "center",
      gap: 7,
      paddingVertical: 14,
      borderRadius: 18,
      backgroundColor: colors.muted,
      borderWidth: 2,
      borderColor: "transparent",
    },
    themeOptionActive: {
      backgroundColor: colors.amber,
      borderColor: colors.primary,
    },
    themeLabel: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    themeLabelActive: {
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
    },
    testBody: {
      paddingHorizontal: 22,
      paddingBottom: 18,
      gap: 12,
    },
    testText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
    },
    testBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 13,
      alignItems: "center",
      opacity: isSchedulingTest ? 0.7 : 1,
    },
    testBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
  });

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.title}>Профиль</Text>

      {/* Avatar + name */}
      <View style={s.profileHeader}>
        <Avatar name={state.name} colors={colors} />
        <Text style={s.userName}>{state.name}</Text>
        <Pressable
          style={({ pressed }) => [s.editBtn, pressed && { opacity: 0.75 }]}
          onPress={() => {
            setEditingName(!editingName);
            setNameInput(state.name);
          }}
        >
          <Ionicons name="pencil-outline" size={14} color={colors.primary} />
          <Text style={s.editBtnText}>Изменить имя</Text>
        </Pressable>
      </View>

      {/* Name edit */}
      {editingName && (
        <View style={s.section}>
          <View style={s.nameEditPad}>
            <TextInput
              style={s.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Твоё имя"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={saveName}
            />
            <Pressable
              style={({ pressed }) => [s.saveBtn, pressed && { opacity: 0.85 }]}
              onPress={saveName}
            >
              <Text style={s.saveBtnText}>Сохранить</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Theme */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Тема оформления</Text>
        <View style={s.themeRow}>
          {THEME_OPTIONS.map((opt) => {
            const isActive = theme === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={({ pressed }) => [
                  s.themeOption,
                  isActive && s.themeOptionActive,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => {
                  setTheme(opt.value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons
                  name={opt.icon}
                  size={22}
                  color={isActive ? colors.primary : colors.mutedForeground}
                />
                <Text style={[s.themeLabel, isActive && s.themeLabelActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Quotes */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Цитаты</Text>
        <View style={[s.row, s.rowFirst]}>
          <View style={s.rowLeft}>
            <View style={[s.iconCircle, { backgroundColor: colors.amber }]}>
              <Ionicons
                name="sparkles-outline"
                size={17}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>Поддерживающие фразы</Text>
              <Text style={s.rowSub}>Случайное время, 8:00–22:00</Text>
            </View>
          </View>
          <Switch
            value={state.aiEnabled}
            onValueChange={(v) => {
              updateField("aiEnabled", v);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: colors.border, true: colors.peachSoft }}
            thumbColor={
              state.aiEnabled ? colors.primary : colors.mutedForeground
            }
          />
        </View>
      </View>

      {/* Notifications */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Уведомления</Text>
        <View style={[s.row, s.rowFirst]}>
          <View style={s.rowLeft}>
            <View style={[s.iconCircle, { backgroundColor: colors.mint }]}>
              <Ionicons
                name="notifications-outline"
                size={17}
                color="#5DAA7A"
              />
            </View>
            <Text style={s.rowLabel}>Напоминания</Text>
          </View>
          <Switch
            value={state.notifications}
            onValueChange={(v) => {
              updateField("notifications", v);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: colors.border, true: colors.peachSoft }}
            thumbColor={
              state.notifications ? colors.primary : colors.mutedForeground
            }
          />
        </View>
        {state.notifications && (
          <>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconCircle, { backgroundColor: colors.amber }]}>
                  <Ionicons
                    name="sunny-outline"
                    size={17}
                    color={colors.primary}
                  />
 codex/continue-the-discussion-k4xcgp

                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowLabel}>Поддержка днём</Text>
                  <Text style={s.rowSub}>Случайное время в диапазоне 8:00–22:00</Text>
 main
                </View>
              </View>
            </View>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View
                  style={[s.iconCircle, { backgroundColor: colors.lavender }]}
                >
                  <Ionicons name="moon-outline" size={17} color="#8B7BD4" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowLabel}>Напоминание о настроении</Text>
                  <Text style={s.rowSub}>После 20:00, если нет записей за день</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Notification test */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Тест уведомлений</Text>
        <View style={s.testBody}>
          <Text style={s.testText}>
 codex/continue-the-discussion-k4xcgp
            Запускает тестовый сценарий: несколько уведомлений с интервалом
            10–70 сек.

          codex/continue-the-discussion-dymt18
            Запускает короткий сценарий из AI-фраз и вечерних чек-инов, чтобы не
            ждать 08:00 и проверить разные тексты прямо в Expo на iPhone.

            Запускает тестовый сценарий: несколько уведомлений с интервалом 10–70 сек.
            Сверни приложение для получения.
main
 main
          </Text>
          <Pressable
            disabled={isSchedulingTest}
            style={({ pressed }) => [
              s.testBtn,
              pressed && !isSchedulingTest && { opacity: 0.85 },
            ]}
            onPress={runNotificationTest}
          >
            <Text style={s.testBtnText}>
 codex/continue-the-discussion-k4xcgp
              {isSchedulingTest ? "Планируем…" : "Запустить тест"}

 codex/continue-the-discussion-dymt18
              {isSchedulingTest ? "Планируем…" : "Запустить тестовый сценарий"}

              {isSchedulingTest ? "Планируем…" : "Запустить тест"}
main
 main
            </Text>
          </Pressable>
        </View>
      </View>

      {/* About */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>О приложении</Text>
        <View style={[s.row, s.rowFirst]}>
          <Text style={s.rowLabel}>Версия</Text>
          <Text style={s.rowValue}>1.0.0</Text>
        </View>
        <View style={s.row}>
          <Text style={s.rowLabel}>Сделано с теплом</Text>
          <Text style={s.rowValue}>💛</Text>
        </View>
      </View>
    </ScrollView>
  );
}
