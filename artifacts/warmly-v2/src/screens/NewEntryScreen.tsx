import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { KeyboardScreen } from "../components/layout";
import { Button, Text, TextInput } from "../components/ui";
import { MoodPicker } from "../components/entry";
import { useEntries } from "../hooks";
import { useTheme } from "../theme";
import { MoodId } from "../types";
import { ENTRY_TEXT_MAX } from "../constants/moods";
import { pickSupportPhrase } from "../utils";

/** Модальная новая запись — тот же UX, что и Дневник. */
export function NewEntryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { createEntry } = useEntries();

  const [moodId, setMoodId] = useState<MoodId | undefined>("good");
  const [note, setNote] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);

  const canSave = Boolean(moodId) && note.trim().length > 0 && !isSaving;

  const backButton = (
    <Pressable
      onPress={() => router.back()}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Назад"
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
      <Ionicons name="chevron-back" size={20} color={theme.colors.textPrimary} />
    </Pressable>
  );

  async function handleSave() {
    if (!moodId || !note.trim()) return;
    setIsSaving(true);
    try {
      await createEntry({
        moodId,
        note: note.trim(),
        smallWin: extraNote.trim() || undefined,
      });
      setSupportPhrase(pickSupportPhrase());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      setTimeout(() => router.back(), 900);
    } finally {
      setIsSaving(false);
    }
  }

  const label = (text: string) => (
    <Text
      style={{
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.weights.semibold,
        marginTop: theme.spacing("lg"),
        marginBottom: theme.spacing("sm"),
      }}
    >
      {text}
    </Text>
  );

  if (supportPhrase) {
    return (
      <KeyboardScreen>
        {backButton}
        <Text
          style={{
            color: theme.colors.accent,
            fontWeight: theme.typography.weights.semibold,
            marginTop: theme.spacing("md"),
          }}
        >
          Warmly рядом
        </Text>
        <Text
          face="serif"
          style={{ marginTop: 8, color: theme.colors.textPrimary, fontSize: theme.typography.sizes.subtitle }}
        >
          {supportPhrase}
        </Text>
      </KeyboardScreen>
    );
  }

  return (
    <KeyboardScreen>
      {backButton}
      {label("Как ты себя чувствуешь?")}
      <MoodPicker selectedMoodId={moodId} onSelect={setMoodId} />

      {label("Что произошло?")}
      <TextInput
        face="serif"
        value={note}
        onChangeText={(text) => setNote(text.slice(0, ENTRY_TEXT_MAX))}
        multiline
        maxLength={ENTRY_TEXT_MAX}
        placeholder="Коротко опиши день…"
        placeholderTextColor={theme.colors.textSecondary}
        style={{
          minHeight: 100,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing("md"),
          color: theme.colors.textPrimary,
          textAlignVertical: "top",
          backgroundColor: theme.colors.surface,
        }}
      />
      <Text style={{ alignSelf: "flex-end", color: theme.colors.textSecondary, fontSize: 12 }}>
        {note.length}/{ENTRY_TEXT_MAX}
      </Text>

      {label("Добавить заметку")}
      <TextInput
        face="serif"
        value={extraNote}
        onChangeText={(text) => setExtraNote(text.slice(0, ENTRY_TEXT_MAX))}
        multiline
        maxLength={ENTRY_TEXT_MAX}
        placeholder="Необязательно"
        placeholderTextColor={theme.colors.textSecondary}
        style={{
          minHeight: 80,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing("md"),
          color: theme.colors.textPrimary,
          textAlignVertical: "top",
          backgroundColor: theme.colors.surface,
        }}
      />
      <Text style={{ alignSelf: "flex-end", color: theme.colors.textSecondary, fontSize: 12 }}>
        {extraNote.length}/{ENTRY_TEXT_MAX}
      </Text>

      <View style={{ height: theme.spacing("xl") }} />
      <Button
        label={isSaving ? "Сохранение…" : "Сохранить запись"}
        icon="leaf"
        onPress={handleSave}
        disabled={!canSave}
      />
    </KeyboardScreen>
  );
}
