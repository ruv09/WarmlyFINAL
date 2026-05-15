import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
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

function Avatar({ name, colors }: { name: string; colors: ReturnType<typeof useColors> }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <View style={{
      width: 72, height: 72, borderRadius: 36,
      backgroundColor: colors.peachSoft,
      alignItems: "center", justifyContent: "center",
      borderWidth: 2, borderColor: colors.border,
    }}>
      <Text style={{ fontSize: 26, fontFamily: "Inter_600SemiBold", color: colors.primary }}>
        {initials || "W"}
      </Text>
    </View>
  );
}

const THEME_OPTIONS: { value: AppTheme; label: string; icon: string }[] = [
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

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const saveName = () => {
    if (nameInput.trim()) {
      updateField("name", nameInput.trim());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setEditingName(false);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingTop: topPad + 24, paddingBottom: bottomPad, paddingHorizontal: 20, gap: 20 },
    profileHeader: { alignItems: "center", gap: 12 },
    userName: { fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground },
    editNameBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    editNameText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.primary },
    section: {
      backgroundColor: colors.card, borderRadius: 18,
      borderWidth: 1, borderColor: colors.border, overflow: "hidden",
    },
    sectionTitle: {
      fontSize: 12, fontFamily: "Inter_600SemiBold", color: colors.mutedForeground,
      textTransform: "uppercase", letterSpacing: 0.8,
      paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10,
    },
    row: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingHorizontal: 20, paddingVertical: 14,
      borderTopWidth: 1, borderTopColor: colors.border,
    },
    rowLabel: { fontSize: 15, fontFamily: "Inter_400Regular", color: colors.foreground },
    rowValue: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    iconBg: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    nameEditRow: {
      paddingHorizontal: 20, paddingVertical: 14,
      borderTopWidth: 1, borderTopColor: colors.border, gap: 10,
    },
    nameInput: {
      fontSize: 15, fontFamily: "Inter_400Regular", color: colors.foreground,
      borderWidth: 1, borderColor: colors.primary, borderRadius: 10,
      paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.background,
    },
    saveBtn: {
      backgroundColor: colors.primary, borderRadius: 10,
      paddingVertical: 10, alignItems: "center",
    },
    saveBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
    themeRow: {
      flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingBottom: 16,
    },
    themeOption: {
      flex: 1, alignItems: "center", gap: 6, paddingVertical: 12,
      borderRadius: 14, borderWidth: 2, borderColor: "transparent",
      backgroundColor: colors.muted,
    },
    themeOptionActive: { borderColor: colors.primary, backgroundColor: colors.peachSoft },
    themeOptionLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    themeOptionLabelActive: { color: colors.primary },
  });

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.profileHeader}>
        <Avatar name={state.name} colors={colors} />
        <Text style={s.userName}>{state.name}</Text>
        <Pressable style={s.editNameBtn} onPress={() => { setEditingName(!editingName); setNameInput(state.name); }}>
          <Ionicons name="pencil-outline" size={14} color={colors.primary} />
          <Text style={s.editNameText}>Изменить имя</Text>
        </Pressable>
      </View>

      {editingName && (
        <View style={s.section}>
          <View style={s.nameEditRow}>
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
            <Pressable style={({ pressed }) => [s.saveBtn, pressed && { opacity: 0.85 }]} onPress={saveName}>
              <Text style={s.saveBtnText}>Сохранить</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Theme */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Тема оформления</Text>
        <View style={s.themeRow}>
          {THEME_OPTIONS.map((opt) => {
            const isActive = theme === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={({ pressed }) => [s.themeOption, isActive && s.themeOptionActive, pressed && { opacity: 0.8 }]}
                onPress={() => {
                  setTheme(opt.value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name={opt.icon as any} size={22} color={isActive ? colors.primary : colors.mutedForeground} />
                <Text style={[s.themeOptionLabel, isActive && s.themeOptionLabelActive]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Quotes */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Цитаты</Text>
        <View style={[s.row, { borderTopWidth: 0 }]}>
          <View style={s.rowLeft}>
            <View style={[s.iconBg, { backgroundColor: colors.peachSoft }]}>
              <Ionicons name="sparkles-outline" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={s.rowLabel}>ИИ-фразы</Text>
              <Text style={[s.rowValue, { fontSize: 12 }]}>Персональные фразы по настроению</Text>
            </View>
          </View>
          <Switch
            value={state.aiEnabled}
            onValueChange={(v) => {
              updateField("aiEnabled", v);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: colors.border, true: colors.peachSoft }}
            thumbColor={state.aiEnabled ? colors.primary : colors.mutedForeground}
          />
        </View>
      </View>

      {/* Notifications */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Уведомления</Text>
        <View style={[s.row, { borderTopWidth: 0 }]}>
          <View style={s.rowLeft}>
            <View style={[s.iconBg, { backgroundColor: colors.mint }]}>
              <Ionicons name="notifications-outline" size={16} color="#4CAF82" />
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
            thumbColor={state.notifications ? colors.primary : colors.mutedForeground}
          />
        </View>
        {state.notifications && (
          <>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconBg, { backgroundColor: "#FCE8C5" }]}>
                  <Ionicons name="sunny-outline" size={16} color="#D29A6A" />
                </View>
                <Text style={s.rowLabel}>Утреннее</Text>
              </View>
              <Text style={s.rowValue}>{state.morning}</Text>
            </View>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconBg, { backgroundColor: colors.lavender }]}>
                  <Ionicons name="moon-outline" size={16} color="#9B85D4" />
                </View>
                <Text style={s.rowLabel}>Вечернее</Text>
              </View>
              <Text style={s.rowValue}>{state.evening}</Text>
            </View>
          </>
        )}
      </View>

      {/* About */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>О приложении</Text>
        <View style={[s.row, { borderTopWidth: 0 }]}>
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
