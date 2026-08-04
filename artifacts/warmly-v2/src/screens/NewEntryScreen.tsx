import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { KeyboardScreen } from "../components/layout";
import { Button } from "../components/ui";
import { MoodPicker } from "../components/entry";
import { useEntries } from "../hooks";
import { useTheme } from "../theme";
import { MoodId } from "../types";
import { pickSupportPhrase } from "../utils";

export function NewEntryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { createEntry } = useEntries();

  const [moodId, setMoodId] = useState<MoodId | undefined>();
  const [note, setNote] = useState("");
  const [smallWin, setSmallWin] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);

  const canSave = Boolean(moodId) && !isSaving;

  async function handleSave() {
    if (!moodId) return;
    setIsSaving(true);
    try {
      await createEntry({ moodId, note, smallWin: smallWin || undefined });
      const phrase = pickSupportPhrase();
      setSupportPhrase(phrase);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      // Короткая пауза, чтобы пользователь увидел тёплую фразу из v1.
      setTimeout(() => router.back(), 900);
    } finally {
      setIsSaving(false);
    }
  }

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
      {supportPhrase ? (
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing("lg"),
            gap: theme.spacing("sm"),
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.caption,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.accent,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Warmly говорит
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.subtitle,
              color: theme.colors.textPrimary,
              lineHeight: 24,
            }}
          >
            {supportPhrase}
          </Text>
        </View>
      ) : (
        <>
          {label("Какое у вас настроение?")}
          <MoodPicker selectedMoodId={moodId} onSelect={setMoodId} />

          {label("Заметка (необязательно)")}
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            placeholder="Что произошло сегодня?"
            placeholderTextColor={theme.colors.textSecondary}
            maxFontSizeMultiplier={theme.typography.scaleLimits.content}
            style={{
              minHeight: 100,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing("md"),
              color: theme.colors.textPrimary,
              textAlignVertical: "top",
              fontSize: theme.typography.sizes.body,
            }}
          />

          {label("Маленькая победа (необязательно)")}
          <TextInput
            value={smallWin}
            onChangeText={setSmallWin}
            placeholder="Чем сегодня можно гордиться?"
            placeholderTextColor={theme.colors.textSecondary}
            maxFontSizeMultiplier={theme.typography.scaleLimits.content}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing("md"),
              color: theme.colors.textPrimary,
              fontSize: theme.typography.sizes.body,
            }}
          />

          <Text style={{ height: theme.spacing("xl") }} />
          <Button label="Сохранить" onPress={handleSave} disabled={!canSave} />
        </>
      )}
    </KeyboardScreen>
  );
}
