import React, { useState } from "react";
import { Switch, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { KeyboardScreen } from "../components/layout";
import { Button } from "../components/ui";
import { useSettings } from "../hooks";
import { useTheme } from "../theme";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Время и раздельные тумблеры утро/вечер.
 * Оба сразу — это потолок, не обязанность.
 */
export function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { settings, updateSettings } = useSettings();

  const [morningEnabled, setMorningEnabled] = useState(settings.notifications.morningEnabled !== false);
  const [eveningEnabled, setEveningEnabled] = useState(settings.notifications.eveningEnabled !== false);
  const [morningTime, setMorningTime] = useState(settings.notifications.morningTime);
  const [eveningTime, setEveningTime] = useState(settings.notifications.eveningTime);

  const isValid = TIME_PATTERN.test(morningTime) && TIME_PATTERN.test(eveningTime);

  async function handleSave() {
    if (!isValid) return;
    await updateSettings({
      notifications: {
        ...settings.notifications,
        morningEnabled,
        eveningEnabled,
        morningTime,
        eveningTime,
      },
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    router.back();
  }

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing("md"),
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.body,
  };

  const row = (label: string, value: boolean, onValueChange: (next: boolean) => void) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: theme.spacing("lg"),
        marginBottom: theme.spacing("sm"),
      }}
    >
      <Text style={{ color: theme.colors.textPrimary, flex: 1, paddingRight: 12 }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );

  return (
    <KeyboardScreen>
      <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>
        Самое большее два тихих напоминания в день, без звука. Вечернее не придёт, если день уже
        записан.
      </Text>

      {row("Утром", morningEnabled, setMorningEnabled)}
      <TextInput
        value={morningTime}
        onChangeText={setMorningTime}
        placeholder="09:00"
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="numbers-and-punctuation"
        editable={morningEnabled}
        style={[inputStyle, { opacity: morningEnabled ? 1 : 0.45 }]}
      />

      {row("Вечером", eveningEnabled, setEveningEnabled)}
      <TextInput
        value={eveningTime}
        onChangeText={setEveningTime}
        placeholder="21:00"
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="numbers-and-punctuation"
        editable={eveningEnabled}
        style={[inputStyle, { opacity: eveningEnabled ? 1 : 0.45 }]}
      />

      <Text style={{ height: theme.spacing("xl") }} />
      <Button label="Сохранить" onPress={handleSave} disabled={!isValid} />
    </KeyboardScreen>
  );
}
