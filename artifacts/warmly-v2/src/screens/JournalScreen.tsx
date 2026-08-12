import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Screen } from "../components/layout";
import { Button } from "../components/ui";
import { MoodPicker } from "../components/entry";
import { useEntries } from "../hooks";
import { useTheme } from "../theme";
import { MoodId } from "../types";
import { ENTRY_TEXT_MAX } from "../constants/moods";
import { pickSupportPhrase } from "../utils";

/**
 * Дневник по макету: настроение → «Что произошло?» → заметка → сохранить.
 */
export function JournalScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { createEntry } = useEntries();

  const [moodId, setMoodId] = useState<MoodId | undefined>("good");
  const [note, setNote] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);

  const canSave = Boolean(moodId) && note.trim().length > 0 && !isSaving;

  async function handleSave() {
    if (!moodId || !note.trim()) return;
    setIsSaving(true);
    try {
      await createEntry({
        moodId,
        note: note.trim(),
        smallWin: extraNote.trim() || undefined,
      });
      const phrase = pickSupportPhrase();
      setSupportPhrase(phrase);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      setTimeout(() => {
        setSupportPhrase(null);
        setNote("");
        setExtraNote("");
        setMoodId("good");
        router.push("/(tabs)/forest");
      }, 1100);
    } finally {
      setIsSaving(false);
    }
  }

  function FieldLabel({ children }: { children: string }) {
    return (
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontWeight: theme.typography.weights.semibold,
          fontSize: theme.typography.sizes.subtitle,
          marginTop: theme.spacing("lg"),
          marginBottom: theme.spacing("sm"),
        }}
      >
        {children}
      </Text>
    );
  }

  function Counter({ value }: { value: number }) {
    return (
      <Text
        style={{
          marginTop: 6,
          alignSelf: "flex-end",
          color: theme.colors.textSecondary,
          fontSize: theme.typography.sizes.caption,
        }}
      >
        {value}/{ENTRY_TEXT_MAX}
      </Text>
    );
  }

  if (supportPhrase) {
    return (
      <Screen edges={["top", "left", "right"]}>
        <View
          style={{
            marginTop: theme.spacing("xxl"),
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing("lg"),
            gap: theme.spacing("sm"),
          }}
        >
          <Text style={{ color: theme.colors.accent, fontWeight: theme.typography.weights.semibold }}>
            Warmly рядом
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
      </Screen>
    );
  }

  return (
    <Screen edges={["top", "left", "right"]}>
      <Text
        style={{
          fontSize: theme.typography.sizes.largeTitle,
          fontWeight: theme.typography.weights.bold,
          color: theme.colors.textPrimary,
        }}
      >
        Дневник
      </Text>
      <Text
        style={{
          marginTop: 4,
          marginBottom: theme.spacing("md"),
          color: theme.colors.textSecondary,
          fontSize: theme.typography.sizes.caption,
        }}
      >
        отметь настроение и посади дерево
      </Text>

      <FieldLabel>Как ты себя чувствуешь?</FieldLabel>
      <MoodPicker selectedMoodId={moodId} onSelect={setMoodId} />

      <FieldLabel>Что произошло?</FieldLabel>
      <TextInput
        value={note}
        onChangeText={(text) => setNote(text.slice(0, ENTRY_TEXT_MAX))}
        multiline
        maxLength={ENTRY_TEXT_MAX}
        placeholder="Коротко опиши день…"
        placeholderTextColor={theme.colors.textSecondary}
        maxFontSizeMultiplier={theme.typography.scaleLimits.content}
        style={{
          minHeight: 110,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing("md"),
          color: theme.colors.textPrimary,
          textAlignVertical: "top",
          fontSize: theme.typography.sizes.body,
          backgroundColor: theme.colors.surface,
        }}
      />
      <Counter value={note.length} />

      <FieldLabel>Добавить заметку</FieldLabel>
      <TextInput
        value={extraNote}
        onChangeText={(text) => setExtraNote(text.slice(0, ENTRY_TEXT_MAX))}
        multiline
        maxLength={ENTRY_TEXT_MAX}
        placeholder="Необязательно — чуть глубже о чувствах"
        placeholderTextColor={theme.colors.textSecondary}
        maxFontSizeMultiplier={theme.typography.scaleLimits.content}
        style={{
          minHeight: 88,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing("md"),
          color: theme.colors.textPrimary,
          textAlignVertical: "top",
          fontSize: theme.typography.sizes.body,
          backgroundColor: theme.colors.surface,
        }}
      />
      <Counter value={extraNote.length} />

      <View style={{ height: theme.spacing("xl") }} />
      <Button
        label={isSaving ? "Сохранение…" : "Сохранить запись"}
        icon="leaf"
        onPress={handleSave}
        disabled={!canSave}
      />
    </Screen>
  );
}
