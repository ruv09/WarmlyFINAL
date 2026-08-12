import React, { useState } from "react";
import { Switch, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Screen } from "../components/layout";
import { Button } from "../components/ui";
import { useEntries, useFavorites, useSettings, useStatistics } from "../hooks";
import { useTheme } from "../theme";
import { ROUTES } from "../constants/routes";
import { ThemeMode } from "../types";
import { getMoodById } from "../constants/moods";
import { exportEntries } from "../services";
import { treesLabel } from "../utils";

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: "Светлая", value: "light" },
  { label: "Тёмная", value: "dark" },
  { label: "Системная", value: "auto" },
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
      }}
    >
      {text}
    </Text>
  );

  return (
    <Screen edges={["top", "left", "right"]}>
      <Text
        style={{
          fontSize: theme.typography.sizes.title,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
        }}
      >
        Профиль
      </Text>

      {sectionLabel("Имя")}
      {editingName ? (
        <View style={{ gap: theme.spacing("sm") }}>
          <TextInput
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Твоё имя"
            placeholderTextColor={theme.colors.textSecondary}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing("md"),
              color: theme.colors.textPrimary,
              fontSize: theme.typography.sizes.body,
            }}
          />
          <Button label="Сохранить имя" onPress={saveName} />
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.subtitle }}>
            {settings.name || "Друг"}
          </Text>
          <Button
            label="Изменить"
            variant="secondary"
            onPress={() => {
              setNameInput(settings.name);
              setEditingName(true);
            }}
          />
        </View>
      )}

      {sectionLabel("Статистика")}
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing("md"),
        }}
      >
        <StatRow label="Записей всего" value={String(stats.totalEntries)} />
        <StatRow label="Дней с записями" value={String(stats.totalDays)} />
        <StatRow label="Записей за 7 дней" value={String(stats.entriesLast7Days)} />
        <StatRow label="Деревьев посажено" value={treesLabel(stats.treesGrown)} />
        <StatRow label="Избранных фраз" value={String(favorites.length)} />
        {mostFrequentMood && (
          <StatRow
            label="Частое настроение"
            value={`${mostFrequentMood.emoji} ${mostFrequentMood.label}`}
          />
        )}
      </View>

      {sectionLabel("Тема оформления")}
      <View style={{ flexDirection: "row", gap: theme.spacing("sm"), flexWrap: "wrap" }}>
        {THEME_OPTIONS.map((option) => (
          <Button
            key={option.value}
            label={option.label}
            variant={settings.theme === option.value ? "primary" : "secondary"}
            onPress={() => {
              updateSettings({ theme: option.value });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
            }}
          />
        ))}
      </View>

      {sectionLabel("Поддерживающие фразы")}
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
      <Button
        label="Открыть избранное"
        variant="secondary"
        onPress={() => router.push(ROUTES.favorites)}
      />

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
