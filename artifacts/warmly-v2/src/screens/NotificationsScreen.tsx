import React, { useState } from "react";
import { Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { KeyboardScreen } from "../components/layout";
import { Button } from "../components/ui";
import { useSettings } from "../hooks";
import { useTheme } from "../theme";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Простой текстовый ввод времени в формате HH:mm.
 */
export function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { settings, updateSettings } = useSettings();

  const [morningTime, setMorningTime] = useState(settings.notifications.morningTime);
  const [eveningTime, setEveningTime] = useState(settings.notifications.eveningTime);

  const isValid = TIME_PATTERN.test(morningTime) && TIME_PATTERN.test(eveningTime);

  async function handleSave() {
    if (!isValid) return;
    await updateSettings({
      notifications: { ...settings.notifications, morningTime, eveningTime },
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

  const label = (text: string) => (
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
    <KeyboardScreen>
      {label("Утреннее напоминание (ЧЧ:ММ)")}
      <TextInput
        value={morningTime}
        onChangeText={setMorningTime}
        placeholder="09:00"
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="numbers-and-punctuation"
        style={inputStyle}
      />

      {label("Вечернее напоминание (ЧЧ:ММ)")}
      <TextInput
        value={eveningTime}
        onChangeText={setEveningTime}
        placeholder="21:00"
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="numbers-and-punctuation"
        style={inputStyle}
      />

      <Text style={{ height: theme.spacing("xl") }} />
      <Button label="Сохранить" onPress={handleSave} disabled={!isValid} />
    </KeyboardScreen>
  );
}
