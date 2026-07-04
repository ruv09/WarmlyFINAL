import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
codex/continue-the-discussion-k4xcgp

  useWindowDimensions,
  Alert,
main
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useApp, type MoodEntry } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getTreeForMood, VICTORY_MAX_LENGTH } from "@/utils/journey";
import { MOOD_ITEMS, type MoodKey } from "@/utils/phrases";

const MAX_ENTRIES_PER_DAY = 20;

const cardShadow = Platform.select({
  web: { boxShadow: "0px 4px 24px rgba(0,0,0,0.07)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
});

const supportPhrases = [
codex/continue-the-discussion-k4xcgp
  "Каждая запись — это уже маленькая забота о себе 💛",
  "Ты сделал(а) важный шаг: заметил(а), что происходит внутри 🌿",
  "Даже тихий день становится частью твоего пути ✨",
  "Спасибо, что нашёл(ла) минуту для себя. Это имеет значение 🍊",

  "Спасибо, что заглянул(а) к себе 💛 Это важно.",
  "Запись сохранена. Ты молодец, что следишь за собой 🌿",
  "Ты не один(а). Warmly рядом ✨",
  "Отлично! Каждая запись — шаг к лучшему пониманию себя 🌸",
  "Сохранено. Береги себя сегодня 🍊",
 main
];

const moodDarkColors: Record<MoodKey, string> = {
  good: "#3A2D18",
  calm: "#1A2922",
  neutral: "#2A2520",
  tired: "#1E2820",
  anxious: "#2A1A1A",
  sad: "#1E1B2A",
};

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]!;

const moodMap = Object.fromEntries(MOOD_ITEMS.map((item) => [item.key, item]));

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

interface EditState {
  id: string;
  mood: MoodKey;
  note: string;
}

type EditState = "idle" | "editing" | "saved";

export default function MoodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
codex/continue-the-discussion-k4xcgp
  const { addMoodHistory } = useApp();

  const { getTodayEntries, addMoodHistory, editMoodEntry, deleteMoodEntry } = useApp();
main
  const isDark = colors.background === "#131110";
  const { width } = useWindowDimensions();

  const gridHorizontalPadding = 22 * 2;
  const gridGap = 16 * 2;
  const rawCircleSize = (width - gridHorizontalPadding - gridGap) / 3;
  const circleSize = Math.max(80, Math.min(rawCircleSize, 120));

codex/continue-the-discussion-k4xcgp
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [noteText, setNoteText] = useState("");
  const [victoryText, setVictoryText] = useState("");
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>("idle");

 codex/continue-the-discussion-dymt18
  const [noteText, setNoteText] = useState(state.moodNote ?? "");
  const [victoryText, setVictoryText] = useState("");
  const [submitted, setSubmitted] = useState(state.moodNoteSubmitted ?? false);

  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [noteText, setNoteText] = useState("");
 main
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
 main
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

 codex/continue-the-discussion-k4xcgp
  const handleMoodSelect = (key: MoodKey) => {
    setSelectedMood(key);
    setEditState("editing");

 codex/continue-the-discussion-dymt18
  const handleMood = (key: MoodKey) => {
    if (state.mood === key) return;
    updateField("mood", key);
    updateField("moodNote", "");
    updateField("moodNoteSubmitted", false);
    setNoteText("");
    setSubmitted(false);
    setVictoryText("");
main
    setSupportPhrase(null);
    fadeAnim.setValue(0);

  const todayEntries = getTodayEntries();
  const canAddMore = todayEntries.length < MAX_ENTRIES_PER_DAY;

  const handleMoodSelect = (key: MoodKey) => {
    setSelectedMood(key);
 main
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = () => {
 codex/continue-the-discussion-k4xcgp
    if (!selectedMood || !noteText.trim()) return;

    Keyboard.dismiss();
    const didAdd = addMoodHistory({
      mood: selectedMood,
      note: noteText.trim(),
      victory: victoryText.trim() || undefined,
    });

    if (!didAdd) {
      setSupportPhrase(
        "Сегодня уже достаточно записей. Можно просто отдохнуть 🌙",
      );
      return;
    }

    setSupportPhrase(pick(supportPhrases));
    setSelectedMood(null);
    setNoteText("");
    setVictoryText("");
    setEditState("saved");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    if (!selectedMood) return;
    Keyboard.dismiss();
codex/continue-the-discussion-dymt18
    const note = noteText.trim();
    updateField("moodNote", note);
    updateField("moodNoteSubmitted", true);
    const victory = victoryText.trim();
    addMoodHistory({ mood: state.mood, note, victory: victory || undefined });
    setSubmitted(true);
    const phrase = pick(supportPhrases[state.mood]);

    const added = addMoodHistory({ mood: selectedMood, note: noteText.trim() });
    if (!added) {
      Alert.alert("Лимит достигнут", `Максимум ${MAX_ENTRIES_PER_DAY} записей в день.`);
      return;
    }
    const phrase = pick(supportPhrases);
 main
    setSupportPhrase(phrase);
    setSelectedMood(null);
    setNoteText("");
    fadeAnim.setValue(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const handleEditOpen = (entry: MoodEntry) => {
    setEditState({ id: entry.id, mood: entry.mood, note: entry.note });
  };

  const handleEditSave = () => {
    if (!editState) return;
    Keyboard.dismiss();
    editMoodEntry(editState.id, editState.mood, editState.note);
    setEditState(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDelete = (entry: MoodEntry) => {
    Alert.alert(
      "Удалить запись?",
      `${moodMap[entry.mood]?.emoji} ${moodMap[entry.mood]?.label} · ${formatTime(entry.createdAt)}`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: () => {
            deleteMoodEntry(entry.id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ],
    );
 main
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      flexGrow: 1,
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: 22,
      gap: 20,
    },
    title: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -12,
    },
    sectionLabel: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: -4,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    circleWrapper: {
      width: circleSize,
      alignItems: "center",
      gap: 6,
    },
    circle: {
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2.5,
      borderColor: "transparent",
    },
codex/continue-the-discussion-k4xcgp
    circleSelected: { borderColor: colors.primary },
    moodEmoji: { fontSize: 34 },

    circleSelected: {
      borderColor: colors.primary,
    },
    moodEmoji: { fontSize: 30 },
 main
    moodLabel: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    moodLabelSelected: {
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
    },
    noteCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 22,
      gap: 14,
      ...cardShadow,
    },
    noteTitle: {
      fontSize: 17,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    noteSubtitle: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -6,
      lineHeight: 20,
    },
    noteInput: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      backgroundColor: colors.muted,
      borderRadius: 16,
      padding: 14,
      minHeight: 90,
      textAlignVertical: "top",
    },
    victoryInput: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      backgroundColor: colors.muted,
      borderRadius: 16,
      padding: 16,
      minHeight: 72,
      textAlignVertical: "top",
    },
 codex/continue-the-discussion-k4xcgp
    victoryInput: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      backgroundColor: colors.muted,
      borderRadius: 16,
      padding: 16,
      minHeight: 72,
      textAlignVertical: "top",
    },

main
    counterText: {
      alignSelf: "flex-end",
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -10,
    },
    treePreview: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.muted,
      borderRadius: 18,
      padding: 14,
    },
    treeEmoji: { fontSize: 28 },
    treeText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
    submitBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 13,
      alignItems: "center",
      opacity: noteText.trim() ? 1 : 0.7,
    },
    submitBtnDisabled: {
      opacity: 0.5,
    },
    submitBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    supportCard: {
      borderRadius: 24,
      padding: 22,
      gap: 8,
      backgroundColor: isDark ? colors.muted : colors.amber,
      ...cardShadow,
    },
    supportLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    supportText: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      lineHeight: 26,
    },
    todayCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      overflow: "hidden",
      ...cardShadow,
    },
    todayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    todayHeaderText: {
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    todayCountBadge: {
      backgroundColor: colors.amber,
      borderRadius: 100,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    todayCountText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    entryRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 12,
      gap: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    entryEmoji: {
      fontSize: 26,
      width: 36,
      textAlign: "center",
    },
    entryBody: {
      flex: 1,
      gap: 2,
    },
    entryMood: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    entryNote: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
    entryTime: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    entryActions: {
      flexDirection: "row",
      gap: 6,
    },
    entryBtn: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.muted,
    },
    limitText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingVertical: 8,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 28,
      gap: 8,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
    },
    editModalOverlay: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 22,
      gap: 14,
      ...cardShadow,
    },
    editMoodRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    editMoodBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 100,
      backgroundColor: colors.muted,
      borderWidth: 2,
      borderColor: "transparent",
    },
    editMoodBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.amber,
    },
    editMoodBtnText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    editMoodBtnTextActive: {
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
    },
    editInput: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      backgroundColor: colors.muted,
      borderRadius: 16,
      padding: 14,
      minHeight: 80,
      textAlignVertical: "top",
    },
    editActions: {
      flexDirection: "row",
      gap: 10,
    },
    cancelBtn: {
      flex: 1,
      borderRadius: 100,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: colors.muted,
    },
    cancelBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
    },
    saveBtn: {
      flex: 1,
      borderRadius: 100,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: colors.primary,
    },
    saveBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
  });

  return (
    <KeyboardAvoidingView
codex/continue-the-discussion-k4xcgp
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}

codex/continue-the-discussion-dymt18
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}

      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
 main
main
    >
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.title}>Как ты себя{"\n"}чувствуешь?</Text>
        <Text style={s.subtitle}>Твоё настроение помогает нам быть рядом</Text>

codex/continue-the-discussion-k4xcgp
        <View style={s.grid}>
          {MOOD_ITEMS.map((item) => {
            const isSelected = selectedMood === item.key;
            const bgColor = isDark ? moodDarkColors[item.key] : item.color;
            return (
              <View key={item.key} style={s.circleWrapper}>

        {/* Support phrase after submit */}
        {supportPhrase && (
          <Animated.View style={[s.supportCard, { opacity: fadeAnim }]}>
            <Text style={s.supportLabel}>Warmly говорит</Text>
            <Text style={s.supportText}>{supportPhrase}</Text>
          </Animated.View>
        )}

        {/* Today's entries */}
        {todayEntries.length > 0 && (
          <View>
            <View style={[s.todayCard]}>
              <View style={s.todayHeader}>
                <Text style={s.todayHeaderText}>Записи за сегодня</Text>
                <View style={s.todayCountBadge}>
                  <Text style={s.todayCountText}>{todayEntries.length} / {MAX_ENTRIES_PER_DAY}</Text>
                </View>
              </View>
              {todayEntries.map((entry, idx) => (
                <View
                  key={entry.id}
                  style={[
                    s.entryRow,
                    idx === todayEntries.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Text style={s.entryEmoji}>{moodMap[entry.mood]?.emoji}</Text>
                  <View style={s.entryBody}>
                    <Text style={s.entryMood}>
                      {moodMap[entry.mood]?.label}
                      <Text style={s.entryTime}>{"  "}{formatTime(entry.createdAt)}</Text>
                    </Text>
                    {entry.note ? (
                      <Text style={s.entryNote} numberOfLines={2}>{entry.note}</Text>
                    ) : (
                      <Text style={s.entryNote}>Без заметки</Text>
                    )}
                  </View>
                  <View style={s.entryActions}>
                    <Pressable
                      style={({ pressed }) => [s.entryBtn, pressed && { opacity: 0.7 }]}
                      onPress={() => handleEditOpen(entry)}
                    >
                      <Ionicons name="pencil-outline" size={15} color={colors.mutedForeground} />
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [s.entryBtn, pressed && { opacity: 0.7 }]}
                      onPress={() => handleDelete(entry)}
                    >
                      <Ionicons name="trash-outline" size={15} color="#D94F3D" />
                    </Pressable>
                  </View>
                </View>
              ))}
              {!canAddMore && (
                <Text style={s.limitText}>Максимум {MAX_ENTRIES_PER_DAY} записей в день достигнут</Text>
              )}
            </View>
          </View>
        )}

        {/* Edit modal */}
        {editState && (
          <View style={s.editModalOverlay}>
            <Text style={s.noteTitle}>Редактировать запись</Text>
            <View style={s.editMoodRow}>
              {MOOD_ITEMS.map((item) => (
main
                <Pressable
                  key={item.key}
                  style={[
                    s.editMoodBtn,
                    editState.mood === item.key && s.editMoodBtnActive,
                  ]}
codex/continue-the-discussion-k4xcgp
                  onPress={() => handleMoodSelect(item.key)}

                  onPress={() => setEditState({ ...editState, mood: item.key })}
main
                >
                  <Text style={[s.editMoodBtnText, editState.mood === item.key && s.editMoodBtnTextActive]}>
                    {item.emoji} {item.label}
                  </Text>
                </Pressable>
codex/continue-the-discussion-k4xcgp
                <Text style={[s.moodLabel, isSelected && s.moodLabelSelected]}>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>

        {selectedMood && editState === "editing" && (
          <View style={s.noteCard}>
            <Text style={s.noteTitle}>Расскажи подробнее</Text>

              ))}
            </View>
            <TextInput
              style={s.editInput}
              value={editState.note}
              onChangeText={(t) => setEditState({ ...editState, note: t })}
              placeholder="Заметка (необязательно)"
              placeholderTextColor={colors.mutedForeground}
              multiline
            />
codex/continue-the-discussion-dymt18
            <Text style={s.noteTitle}>Маленькая победа</Text>
 main
            <Text style={s.noteSubtitle}>
              Что сегодня получилось? Можно пропустить
            </Text>
            <TextInput
              style={s.victoryInput}
              placeholder="Например: вышло отдохнуть без чувства вины"
              placeholderTextColor={colors.mutedForeground}
              value={victoryText}
              onChangeText={(value) =>
                setVictoryText(value.slice(0, VICTORY_MAX_LENGTH))
              }
              multiline
              maxLength={VICTORY_MAX_LENGTH}
              returnKeyType="default"
            />
codex/continue-the-discussion-k4xcgp
            <Text style={s.noteTitle}>Маленькая победа</Text>
            <Text style={s.noteSubtitle}>
              Что сегодня получилось? Можно пропустить
            </Text>
            <TextInput
              style={s.victoryInput}
              placeholder="Например: вышло отдохнуть без чувства вины"
              placeholderTextColor={colors.mutedForeground}
              value={victoryText}
              onChangeText={(value) =>
                setVictoryText(value.slice(0, VICTORY_MAX_LENGTH))
              }
              multiline
              maxLength={VICTORY_MAX_LENGTH}
              returnKeyType="default"
            />
main
            <Text style={s.counterText}>
              {victoryText.length}/{VICTORY_MAX_LENGTH}
            </Text>
            <View style={s.treePreview}>
              <Text style={s.treeEmoji}>
codex/continue-the-discussion-k4xcgp
                {getTreeForMood(selectedMood).emoji}
              </Text>
              <Text style={s.treeText}>
                После сохранения в твоём лесу появится{" "}
                {getTreeForMood(selectedMood).title.toLowerCase()}.
              </Text>
            </View>
            <Pressable
              disabled={!noteText.trim()}
              style={({ pressed }) => [
                s.submitBtn,
                pressed && noteText.trim() && { opacity: 0.85 },

                {getTreeForMood(state.mood).emoji}
              </Text>
              <Text style={s.treeText}>
                После сохранения в твоём лесу появится{" "}
                {getTreeForMood(state.mood).title.toLowerCase()}.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                s.submitBtn,
                pressed && { opacity: 0.85 },
main
              ]}
              onPress={handleSubmit}
            >
              <Text style={s.submitBtnText}>Отправить</Text>
            </Pressable>
          </View>
        )}

 codex/continue-the-discussion-k4xcgp
        {supportPhrase && (
          <Animated.View style={[s.supportCard, { opacity: fadeAnim }]}>
            <Text style={s.supportLabel}>Warmly говорит</Text>
            <Text style={s.supportText}>{supportPhrase}</Text>
          </Animated.View>
        )}

        {!selectedMood && editState !== "saved" && (

        {/* Submitted note */}
        {submitted && state.moodNote && (
          <View style={s.noteCard}>
            <Text style={s.noteTitle}>Твоя запись</Text>
            <Text style={s.submittedNote}>«{state.moodNote}»</Text>
            <Pressable
              onPress={() => {
                setSubmitted(false);
                setVictoryText("");
                setSupportPhrase(null);
                updateField("moodNoteSubmitted", false);
              }}
            >
              <Text style={s.editLink}>Изменить запись</Text>
            </Pressable>
          </View>
        )}

            <View style={s.editActions}>
              <Pressable
                style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.8 }]}
                onPress={() => setEditState(null)}
              >
                <Text style={s.cancelBtnText}>Отмена</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [s.saveBtn, pressed && { opacity: 0.85 }]}
                onPress={handleEditSave}
              >
                <Text style={s.saveBtnText}>Сохранить</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* New entry form */}
        {canAddMore && !editState && (
          <>
            <Text style={s.sectionLabel}>
              {todayEntries.length === 0 ? "Выбери настроение" : "Добавить ещё запись"}
            </Text>
 main

            {/* Mood grid */}
            <View style={s.grid}>
              {MOOD_ITEMS.map((item) => {
                const isSelected = selectedMood === item.key;
                const bgColor = isDark ? moodDarkColors[item.key] : item.color;
                return (
                  <View key={item.key} style={s.circleWrapper}>
                    <Pressable
                      style={({ pressed }) => [
                        s.circle,
                        { backgroundColor: bgColor },
                        isSelected && s.circleSelected,
                        pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                      ]}
                      onPress={() => handleMoodSelect(item.key)}
                    >
                      <Text style={s.moodEmoji}>{item.emoji}</Text>
                    </Pressable>
                    <Text style={[s.moodLabel, isSelected && s.moodLabelSelected]}>
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Note input */}
            {selectedMood && (
              <View style={s.noteCard}>
                <Text style={s.noteTitle}>Добавь заметку</Text>
                <Text style={s.noteSubtitle}>Необязательно, но это помогает</Text>
                <TextInput
                  style={s.noteInput}
                  placeholder="Как прошёл день? Что почувствовал(а)?"
                  placeholderTextColor={colors.mutedForeground}
                  value={noteText}
                  onChangeText={setNoteText}
                  multiline
                  returnKeyType="default"
                />
                <Pressable
                  style={({ pressed }) => [s.submitBtn, pressed && { opacity: 0.85 }]}
                  onPress={handleSubmit}
                >
                  <Text style={s.submitBtnText}>Сохранить запись</Text>
                </Pressable>
              </View>
            )}
          </>
        )}

        {/* Empty state */}
        {todayEntries.length === 0 && !selectedMood && (
 main
          <View style={s.emptyState}>
            <Text style={{ fontSize: 32 }}>🌱</Text>
            <Text style={s.emptyText}>
              Регулярная оценка настроения{"\n"}помогает лучше понимать себя
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
