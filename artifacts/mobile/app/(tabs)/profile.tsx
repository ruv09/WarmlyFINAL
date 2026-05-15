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

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateField } = useApp();
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

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingTop: topPad + 24, paddingBottom: bottomPad, paddingHorizontal: 20, gap: 24 },
    profileHeader: { alignItems: "center", gap: 12 },
    userName: { fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground },
    editNameBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    editNameText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.primary },
    section: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    sectionTitle: {
      fontSize: 12, fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground, textTransform: "uppercase",
      letterSpacing: 0.8, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
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
    aiChip: {
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
      backgroundColor: state.aiEnabled ? colors.peachSoft : colors.muted,
    },
    aiChipText: { fontSize: 12, fontFamily: "Inter_500Medium", color: state.aiEnabled ? colors.primary : colors.mutedForeground },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <Avatar name={state.name} colors={colors} />
        <Text style={styles.userName}>{state.name}</Text>
        <Pressable style={styles.editNameBtn} onPress={() => { setEditingName(!editingName); setNameInput(state.name); }}>
          <Ionicons name="pencil-outline" size={14} color={colors.primary} />
          <Text style={styles.editNameText}>Изменить имя</Text>
        </Pressable>
      </View>

      {editingName && (
        <View style={styles.section}>
          <View style={styles.nameEditRow}>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Твоё имя"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={saveName}
            />
            <Pressable style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]} onPress={saveName}>
              <Text style={styles.saveBtnText}>Сохранить</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Цитаты</Text>
        <View style={[styles.row, { borderTopWidth: 0 }]}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconBg, { backgroundColor: colors.peachSoft }]}>
              <Ionicons name="sparkles-outline" size={16} color={colors.primary} />
            </View>
            <Text style={styles.rowLabel}>ИИ-фразы</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={styles.aiChip}>
              <Text style={styles.aiChipText}>{state.aiEnabled ? "Включено" : "Выключено"}</Text>
            </View>
            <Switch
              value={state.aiEnabled}
              onValueChange={(v) => {
                updateField("aiEnabled", v);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              trackColor={{ false: colors.muted, true: colors.peachSoft }}
              thumbColor={state.aiEnabled ? colors.primary : colors.mutedForeground}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Уведомления</Text>
        <View style={[styles.row, { borderTopWidth: 0 }]}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconBg, { backgroundColor: "#DDF3EC" }]}>
              <Ionicons name="notifications-outline" size={16} color="#4CAF82" />
            </View>
            <Text style={styles.rowLabel}>Напоминания</Text>
          </View>
          <Switch
            value={state.notifications}
            onValueChange={(v) => {
              updateField("notifications", v);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: colors.muted, true: colors.peachSoft }}
            thumbColor={state.notifications ? colors.primary : colors.mutedForeground}
          />
        </View>
        {state.notifications && (
          <>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: "#FCE8C5" }]}>
                  <Ionicons name="sunny-outline" size={16} color="#D29A6A" />
                </View>
                <Text style={styles.rowLabel}>Утреннее</Text>
              </View>
              <Text style={styles.rowValue}>{state.morning}</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: "#EAE4F8" }]}>
                  <Ionicons name="moon-outline" size={16} color="#9B85D4" />
                </View>
                <Text style={styles.rowLabel}>Вечернее</Text>
              </View>
              <Text style={styles.rowValue}>{state.evening}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О приложении</Text>
        <View style={[styles.row, { borderTopWidth: 0 }]}>
          <Text style={styles.rowLabel}>Версия</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Сделано с теплом</Text>
          <Text style={styles.rowValue}>💛</Text>
        </View>
      </View>
    </ScrollView>
  );
}
