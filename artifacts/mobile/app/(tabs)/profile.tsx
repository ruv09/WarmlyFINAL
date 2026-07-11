import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
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
 fix/conflict-markers
import { scheduleNotificationTestScenario } from "@/utils/notifications";

import { useResponsive } from "@/utils/responsive";
import {
  cancelAllNotifications,
  getNotificationPermissionStatus,
  requestNotificationPermission,
  scheduleDailyNotifications,
} from "@/services/notifications";
 main

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

 fix/conflict-markers
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

function Avatar({ name, colors, rf }: { name: string; colors: ReturnType<typeof useColors>; rf: (n: number) => number }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
  return (
    <View style={{
      width: 72, height: 72, borderRadius: 36,
      backgroundColor: colors.amber, alignItems: "center", justifyContent: "center",
      ...cardShadow,
    }}>
      <Text style={{ fontSize: rf(26), fontFamily: "Inter_700Bold", color: colors.primary }}>
 main
        {initials || "W"}
      </Text>
    </View>
  );
}

 fix/conflict-markers
const THEME_OPTIONS: {
  value: AppTheme;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: "light", label: "Светлая", icon: "sunny-outline" },
  { value: "dark", label: "Тёмная", icon: "moon-outline" },

const THEME_OPTIONS: { value: AppTheme; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "light",  label: "Светлая",  icon: "sunny-outline" },
  { value: "dark",   label: "Тёмная",   icon: "moon-outline" },
 main
  { value: "system", label: "Системная", icon: "phone-portrait-outline" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { rf, hPad, isSmall } = useResponsive();
  const { state, updateField } = useApp();
  const { theme, setTheme } = useTheme();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.name);
 fix/conflict-markers
  const [isSchedulingTest, setIsSchedulingTest] = useState(false);

  const [notifPermission, setNotifPermission] = useState<"granted" | "denied" | "undetermined">("undetermined");

  useEffect(() => {
    getNotificationPermissionStatus().then(setNotifPermission);
  }, []);
 main

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 88;

  const saveName = () => {
    if (nameInput.trim()) {
      updateField("name", nameInput.trim());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setEditingName(false);
  };

 fix/conflict-markers
  const runNotificationTest = async () => {
    if (isSchedulingTest) return;

    setIsSchedulingTest(true);
    try {
      const result = await scheduleNotificationTestScenario({
        recentPhrases: state.recentAiPhrases,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Тест запущен",
        `Запланировано уведомлений: ${result.count}. Первое придёт примерно через ${result.firstDelaySeconds} секунд. Сверни приложение или заблокируй экран.`,
      );
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Не удалось запустить тест",
        "Проверь, что уведомления разрешены для Warmly в настройках.",
      );
    } finally {
      setIsSchedulingTest(false);

  const handleNotifToggle = async (enabled: boolean) => {
    updateField("notifications", enabled);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (enabled) {
      const granted = await requestNotificationPermission();
      setNotifPermission(granted ? "granted" : "denied");
      if (granted) await scheduleDailyNotifications(true);
    } else {
      await cancelAllNotifications();
 main
    }
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
 fix/conflict-markers
      paddingHorizontal: 22,
      gap: 20,
    },
    title: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,

      paddingHorizontal: hPad,
      gap: isSmall ? 16 : 20,
 main
    },
    title: { fontSize: rf(isSmall ? 26 : 30), fontFamily: "Inter_700Bold", color: colors.foreground, letterSpacing: -0.5 },
    profileHeader: {
      backgroundColor: colors.card, borderRadius: 24, padding: isSmall ? 20 : 24,
      alignItems: "center", gap: 10, ...cardShadow,
    },
    userName: { fontSize: rf(18), fontFamily: "Inter_700Bold", color: colors.foreground },
    editBtn: {
 fix/conflict-markers
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

      flexDirection: "row", alignItems: "center", gap: 6,
      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, backgroundColor: colors.muted,
 main
    },
    editBtnText: { fontSize: rf(13), fontFamily: "Inter_500Medium", color: colors.primary },
    section: { backgroundColor: colors.card, borderRadius: 22, overflow: "hidden", ...cardShadow },
    sectionLabel: {
      fontSize: rf(11), fontFamily: "Inter_600SemiBold", color: colors.mutedForeground,
      textTransform: "uppercase", letterSpacing: 1,
      paddingHorizontal: hPad, paddingTop: 16, paddingBottom: 8,
    },
    row: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingHorizontal: hPad, paddingVertical: isSmall ? 12 : 14,
      borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
    },
    rowFirst: { borderTopWidth: 0 },
 fix/conflict-markers
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

    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, marginRight: 12 },
    iconCircle: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    rowLabelBlock: { flex: 1 },
    rowLabel: { fontSize: rf(14), fontFamily: "Inter_400Regular", color: colors.foreground },
    rowSub: { fontSize: rf(11), fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 1 },
    rowValue: { fontSize: rf(13), fontFamily: "Inter_400Regular", color: colors.mutedForeground, flexShrink: 0 },
 main
    nameEditPad: {
      paddingHorizontal: hPad, paddingBottom: 16, paddingTop: 6, gap: 10,
      borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
    },
    nameInput: {
 fix/conflict-markers
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

      fontSize: rf(15), fontFamily: "Inter_400Regular", color: colors.foreground,
      backgroundColor: colors.muted, borderRadius: 12,
      paddingHorizontal: 14, paddingVertical: 11,
 main
    },
    saveBtn: { backgroundColor: colors.primary, borderRadius: 100, paddingVertical: 12, alignItems: "center" },
    saveBtnText: { fontSize: rf(14), fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
    themeRow: { flexDirection: "row", gap: 8, paddingHorizontal: hPad, paddingBottom: 16 },
    themeOption: {
      flex: 1, alignItems: "center", gap: 6, paddingVertical: 12, borderRadius: 16,
      backgroundColor: colors.muted, borderWidth: 2, borderColor: "transparent",
    },
    themeOptionActive: { backgroundColor: colors.amber, borderColor: colors.primary },
    themeLabel: { fontSize: rf(10), fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    themeLabelActive: { color: colors.primary, fontFamily: "Inter_600SemiBold" },
    permBanner: {
      backgroundColor: colors.rose, borderRadius: 12,
      paddingHorizontal: 14, paddingVertical: 10, marginHorizontal: hPad, marginBottom: 4,
    },
 fix/conflict-markers
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

    permBannerText: { fontSize: rf(12), fontFamily: "Inter_400Regular", color: "#9B3A3A", lineHeight: rf(18) },
 main
  });

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.title}>Профиль</Text>

      {/* Avatar */}
      <View style={s.profileHeader}>
        <Avatar name={state.name} colors={colors} rf={rf} />
        <Text style={s.userName} numberOfLines={1}>{state.name}</Text>
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
              autoCapitalize="words"
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
 fix/conflict-markers
                <Ionicons
                  name={opt.icon}
                  size={22}
                  color={isActive ? colors.primary : colors.mutedForeground}
                />
                <Text style={[s.themeLabel, isActive && s.themeLabelActive]}>
                  {opt.label}
                </Text>

                <Ionicons name={opt.icon} size={20} color={isActive ? colors.primary : colors.mutedForeground} />
                <Text style={[s.themeLabel, isActive && s.themeLabelActive]}>{opt.label}</Text>
 main
              </Pressable>
            );
          })}
        </View>
      </View>

 fix/conflict-markers
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


 main
      {/* Notifications */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Уведомления</Text>
        {notifPermission === "denied" && state.notifications && (
          <View style={s.permBanner}>
            <Text style={s.permBannerText}>
              Разрешение на уведомления отклонено. Включи его в настройках телефона.
            </Text>
          </View>
        )}
        <View style={[s.row, s.rowFirst]}>
          <View style={s.rowLeft}>
            <View style={[s.iconCircle, { backgroundColor: colors.mint }]}>
 fix/conflict-markers
              <Ionicons
                name="notifications-outline"
                size={17}
                color="#5DAA7A"
              />

              <Ionicons name="notifications-outline" size={16} color="#5DAA7A" />
            </View>
            <View style={s.rowLabelBlock}>
              <Text style={s.rowLabel}>Напоминания</Text>
              <Text style={s.rowSub}>Поддерживающие сообщения</Text>
 main
            </View>
          </View>
          <Switch
            value={state.notifications}
 fix/conflict-markers
            onValueChange={(v) => {
              updateField("notifications", v);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}

            onValueChange={handleNotifToggle}
 main
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
 fix/conflict-markers
                  <Ionicons
                    name="sunny-outline"
                    size={17}
                    color={colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowLabel}>Поддержка днём</Text>
                  <Text style={s.rowSub}>Случайное время в диапазоне 8:00–22:00</Text>

                  <Ionicons name="sunny-outline" size={16} color={colors.primary} />
 main
                </View>
              </View>
 fix/conflict-markers
            </View>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View
                  style={[s.iconCircle, { backgroundColor: colors.lavender }]}
                >
                  <Ionicons name="moon-outline" size={17} color="#8B7BD4" />

              <Text style={s.rowValue}>09:00</Text>
            </View>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconCircle, { backgroundColor: colors.lavender }]}>
                  <Ionicons name="moon-outline" size={16} color="#8B7BD4" />
 main
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowLabel}>Напоминание о настроении</Text>
                  <Text style={s.rowSub}>После 20:00, если нет записей за день</Text>
                </View>
              </View>
 fix/conflict-markers

              <Text style={s.rowValue}>20:00</Text>
 main
            </View>
          </>
        )}
      </View>

 fix/conflict-markers
      {/* Notification test */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Тест уведомлений</Text>
        <View style={s.testBody}>
          <Text style={s.testText}>
            Запускает тестовый сценарий: несколько уведомлений с интервалом 10–70 сек.
            Сверни приложение для получения.
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
              {isSchedulingTest ? "Планируем…" : "Запустить тест"}
            </Text>
          </Pressable>

      {/* Quotes */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Цитаты</Text>
        <View style={[s.row, s.rowFirst]}>
          <View style={s.rowLeft}>
            <View style={[s.iconCircle, { backgroundColor: colors.amber }]}>
              <Ionicons name="sparkles-outline" size={16} color={colors.primary} />
            </View>
            <View style={s.rowLabelBlock}>
              <Text style={s.rowLabel}>ИИ-фразы</Text>
              <Text style={s.rowSub}>Персональные по настроению</Text>
            </View>
          </View>
          <Switch
            value={state.aiEnabled}
            onValueChange={(v) => { updateField("aiEnabled", v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            trackColor={{ false: colors.border, true: colors.peachSoft }}
            thumbColor={state.aiEnabled ? colors.primary : colors.mutedForeground}
          />
 main
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
