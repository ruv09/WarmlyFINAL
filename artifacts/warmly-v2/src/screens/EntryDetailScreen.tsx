import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { KeyboardScreen } from "../components/layout";
import { Button } from "../components/ui";
import { MoodPicker } from "../components/entry";
import { useEntries, useEntry } from "../hooks";
import { useTheme } from "../theme";
import { MoodId } from "../types";

interface EntryDetailScreenProps {
  entryId: string | undefined;
}

/** Просмотр, редактирование и удаление одной записи — с подтверждением удаления. */
export function EntryDetailScreen({ entryId }: EntryDetailScreenProps) {
  const theme = useTheme();
  const router = useRouter();
  const entry = useEntry(entryId);
  const { updateEntry, deleteEntry } = useEntries();

  const [moodId, setMoodId] = useState<MoodId | undefined>();
  const [note, setNote] = useState("");
  const [smallWin, setSmallWin] = useState("");

  useEffect(() => {
    if (entry) {
      setMoodId(entry.moodId);
      setNote(entry.note);
      setSmallWin(entry.smallWin ?? "");
    }
  }, [entry?.id]);

  if (!entry) {
    return (
      <KeyboardScreen>
        <Text style={{ color: theme.colors.textSecondary }}>Запись не найдена.</Text>
      </KeyboardScreen>
    );
  }

  async function handleSave() {
    if (!moodId) return;
    await updateEntry(entry!.id, { moodId, note, smallWin: smallWin || undefined });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    router.back();
  }

  function handleDelete() {
    Alert.alert("Удалить запись?", "Вместе с записью исчезнет и дерево в лесу.", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          await deleteEntry(entry!.id);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
          router.back();
        },
      },
    ]);
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
      {label("Настроение")}
      <MoodPicker selectedMoodId={moodId} onSelect={setMoodId} />

      {label("Заметка")}
      <TextInput
        value={note}
        onChangeText={setNote}
        multiline
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

      {label("Маленькая победа")}
      <TextInput
        value={smallWin}
        onChangeText={setSmallWin}
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
      <Button label="Сохранить изменения" onPress={handleSave} />
      <Text style={{ height: theme.spacing("sm") }} />
      <Button label="Удалить запись" variant="secondary" onPress={handleDelete} />
    </KeyboardScreen>
  );
}
