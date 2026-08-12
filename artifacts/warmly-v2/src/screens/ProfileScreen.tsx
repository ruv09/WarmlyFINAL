import React, { useMemo, useState } from "react";
import { Image, Pressable, Switch, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Screen } from "../components/layout";
import { Button } from "../components/ui";
import { useEntries, useFavorites, useSettings, useStatistics } from "../hooks";
import { useTheme } from "../theme";
import { ROUTES } from "../constants/routes";
import { ThemeMode } from "../types";
import { getMoodById } from "../constants/moods";
import { exportEntries } from "../services";
import { formatHumanDate, getFallbackQuote, treesLabel } from "../utils";

const THEME_OPTIONS: { label: string; value: ThemeMode; preview: [string, string] }[] = [
  { label: "Светлая", value: "light", preview: ["#F3EBDC", "#8A9A6E"] },
  { label: "Тёмная", value: "dark", preview: ["#1A1230", "#E8B975"] },
  { label: "Системная", value: "auto", preview: ["#2A2048", "#F3EBDC"] },
];

function StatRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: theme.spacing("xs"),
      }}
    >
      <Text style={{ color: theme.colors.textSecondary }}>{label}</Text>
      <Text style={{ color: theme.colors.textPrimary, fontWeight: theme.typography.weights.medium }}>
        {value}
      </Text>
    </View>
  );
}

export function ProfileScreen() {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const { entries } = useEntries();
  const { favorites } = useFavorites();
  const stats = useStatistics();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(settings.name);

  const mostFrequentMood = stats.mostFrequentMoodId
    ? getMoodById(stats.mostFrequentMoodId)
    : undefined;

  const joinedLabel = useMemo(() => {
    if (!settings.joinedAt) return "с Warmly";
    return `с ${formatHumanDate(settings.joinedAt)}`;
  }, [settings.joinedAt]);

  const thoughtOfDay = settings.supportivePhrasesEnabled
    ? settings.dailyPhrase || getFallbackQuote()
    : getFallbackQuote();

  async function handleExport() {
    setIsExporting(true);
    setExportError(false);
    try {
      await exportEntries(entries);
    } catch {
      setExportError(true);
    } finally {
      setIsExporting(false);
    }
  }

  async function saveName() {
    const next = nameInput.trim();
    if (!next) return;
    await updateSettings({ name: next });
    setEditingName(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  }

  const sectionLabel = (text: string) => (
    <Text
      style={{
        color: theme.colors.textSecondary,
        marginTop: theme.spacing("lg"),
        marginBottom: theme.spacing("sm"),
        fontSize: theme.typography.sizes.caption,
        textTransform: "uppercase",
        letterSpacing: 0.6,
      }}
    >
      {text}
    </Text>
  );

  return (
    <Screen edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flexDirection: "row", gap: 14, flex: 1, alignItems: "center" }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              overflow: "hidden",
              backgroundColor: isDark ? "#3A3258" : "#E8DFD0",
              borderWidth: 2,
              borderColor: theme.colors.border,
            }}
          >
            <Image
              source={require("../../assets/brand/fox-avatar.png")}
              style={{ width: 64, height: 64 }}
              resizeMode="cover"
            />
          </View>
          <View style={{ flex: 1 }}>
            {editingName ? (
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Твоё имя"
                placeholderTextColor={theme.colors.textSecondary}
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing("sm"),
                  color: theme.colors.textPrimary,
                }}
              />
            ) : (
              <Text
                style={{
                  fontSize: theme.typography.sizes.title,
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.textPrimary,
                }}
              >
                {settings.name || "Друг"}
              </Text>
            )}
            <Text style={{ marginTop: 2, color: theme.colors.textSecondary, fontSize: theme.typography.sizes.caption }}>
              {joinedLabel}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            if (editingName) {
              saveName();
            } else {
              setNameInput(settings.name);
              setEditingName(true);
            }
          }}
          hitSlop={10}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Ionicons name={editingName ? "checkmark" : "pencil"} size={16} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      {sectionLabel("Статистика")}
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing("md"),
        }}
      >
        <StatRow label="Записей всего" value={String(stats.totalEntries)} />
        <StatRow label="Дней с записями" value={String(stats.totalDays)} />
        <StatRow label="Деревьев посажено" value={treesLabel(stats.treesGrown)} />
        {mostFrequentMood && (
          <StatRow
            label="Частое настроение"
            value={`${mostFrequentMood.emoji} ${mostFrequentMood.label}`}
          />
        )}
      </View>

      {sectionLabel("Тема")}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {THEME_OPTIONS.map((option) => {
          const selected = settings.theme === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => {
                updateSettings({ theme: option.value });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
              }}
              style={{
                flex: 1,
                borderRadius: 14,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? theme.colors.accent : theme.colors.border,
                overflow: "hidden",
                backgroundColor: theme.colors.surface,
              }}
            >
              <View style={{ height: 44, backgroundColor: option.preview[0] }}>
                <View
                  style={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: option.preview[1],
                  }}
                />
              </View>
              <Text
                style={{
                  textAlign: "center",
                  paddingVertical: 8,
                  fontSize: theme.typography.sizes.caption,
                  color: theme.colors.textPrimary,
                  fontWeight: selected
                    ? theme.typography.weights.semibold
                    : theme.typography.weights.regular,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {sectionLabel("Поддерживающие фразы")}
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing("md"),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing("sm"),
          }}
        >
          <View style={{ flex: 1, paddingRight: theme.spacing("md") }}>
            <Text style={{ color: theme.colors.textPrimary }}>Мысль дня</Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.caption }}>
              Уникальная фраза каждый день
            </Text>
          </View>
          <Switch
            value={settings.supportivePhrasesEnabled}
            onValueChange={(supportivePhrasesEnabled) => {
              updateSettings({ supportivePhrasesEnabled });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
            }}
          />
        </View>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontStyle: "italic",
            lineHeight: 22,
            marginBottom: theme.spacing("sm"),
          }}
        >
          «{thoughtOfDay}»
        </Text>
        <Button
          label="Открыть избранное"
          variant="secondary"
          onPress={() => router.push(ROUTES.favorites)}
        />
      </View>

      {sectionLabel("Напоминания")}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: theme.spacing("sm"),
        }}
      >
        <View style={{ flex: 1, paddingRight: theme.spacing("md") }}>
          <Text style={{ color: theme.colors.textPrimary }}>Напоминания</Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.caption }}>
            Утром — мысль дня, вечером — запись в лес
          </Text>
        </View>
        <Switch
          value={settings.notifications.enabled}
          onValueChange={(enabled) => {
            updateSettings({ notifications: { ...settings.notifications, enabled } });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
          }}
        />
      </View>
      <Button
        label="Настроить время"
        variant="secondary"
        onPress={() => router.push(ROUTES.profileNotifications)}
      />

      {sectionLabel("Данные")}
      <Button
        label={isExporting ? "Подготовка…" : "Экспортировать данные"}
        variant="secondary"
        onPress={handleExport}
        disabled={isExporting || entries.length === 0}
      />
      {favorites.length > 0 && (
        <Text
          style={{
            marginTop: theme.spacing("sm"),
            color: theme.colors.textSecondary,
            fontSize: theme.typography.sizes.caption,
          }}
        >
          Избранных фраз: {favorites.length}
        </Text>
      )}
      {exportError && (
        <Text
          style={{
            color: theme.colors.textSecondary,
            marginTop: theme.spacing("sm"),
            fontSize: theme.typography.sizes.caption,
          }}
        >
          Не получилось поделиться файлом. Попробуйте ещё раз.
        </Text>
      )}
    </Screen>
  );
}
