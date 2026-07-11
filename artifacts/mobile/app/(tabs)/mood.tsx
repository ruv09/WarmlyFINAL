import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
 fix/conflict-markers
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useApp, type MoodEntry } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useResponsive } from "@/utils/responsive";
import { MOOD_ITEMS, type MoodKey } from "@/utils/phrases";

 fix/conflict-markers
const MAX_ENTRIES_PER_DAY = 20;


 main
const cardShadow = Platform.select({
  web: { boxShadow: "0px 4px 24px rgba(0,0,0,0.07)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
});

 fix/conflict-markers
const supportPhrases = [
  "Спасибо, что заглянул(а) к себе 💛 Это важно.",
  "Запись сохранена. Ты молодец, что следишь за собой 🌿",
  "Ты не один(а). Warmly рядом ✨",
  "Отлично! Каждая запись — шаг к лучшему пониманию себя 🌸",
  "Сохранено. Береги себя сегодня 🍊",
];

const supportPhrases: Record<MoodKey, string[]> = {
  good:    ["Это здорово! Сохрани эту энергию и поделись теплом с близкими 💛", "Твоя радость заразительна — пусть она длится как можно дольше 🌟"],
  calm:    ["Спокойствие — это твоя суперсила. Береги этот внутренний мир 🌿", "Тихий день — это тоже подарок. Ты в гармонии с собой ✨"],
  neutral: ["Нейтральный день — отличное время для наблюдения и размышлений 🍃", "Не каждый день должен быть особенным — это тоже нормально 💙"],
  tired:   ["Ты много сделал(а) сегодня. Теперь позволь себе отдохнуть — ты это заслужил(а) 🌙", "Усталость — знак того, что ты старался(ась). Восстановление так же важно 🫂"],
  anxious: ["Сделай три глубоких вдоха. Ты справляешься — шаг за шагом 💛", "Тревога не определяет тебя. Ты сильнее, чем кажется прямо сейчас 🌤"],
  sad:     ["Грустить — это нормально. Твои чувства важны. Ты не один(а) 🤍", "Даже в самый серый день есть маленький свет. Ты справишься 🕯"],
};
 main

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const moodDarkColors: Record<MoodKey, string> = {
  good: "#3A2D18", calm: "#1A2922", neutral: "#2A2520",
  tired: "#1E2820", anxious: "#2A1A1A", sad: "#1E1B2A",
};

 fix/conflict-markers
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

export default function MoodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getTodayEntries, addMoodHistory, editMoodEntry, deleteMoodEntry } = useApp();

export default function MoodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { rf, hPad, isSmall, width } = useResponsive();
  const { state, updateField } = useApp();
 main
  const isDark = colors.background === "#131110";
  const { width } = useWindowDimensions();

 fix/conflict-markers
  const gridHorizontalPadding = 22 * 2;
  const gridGap = 16 * 2;
  const rawCircleSize = (width - gridHorizontalPadding - gridGap) / 3;
  const circleSize = Math.max(80, Math.min(rawCircleSize, 120));

  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [noteText, setNoteText] = useState("");

  // Responsive circle size — computed from live window width
  const cols = 3;
  const gap = 12;
  const circleSize = Math.max(
    Math.floor((width - hPad * 2 - gap * (cols - 1)) / cols),
    72,
  );

  const [noteText, setNoteText] = useState(state.moodNote ?? "");
  const [submitted, setSubmitted] = useState(state.moodNoteSubmitted ?? false);
 main
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 88;

  const todayEntries = getTodayEntries();
  const canAddMore = todayEntries.length < MAX_ENTRIES_PER_DAY;

  const handleMoodSelect = (key: MoodKey) => {
    setSelectedMood(key);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    Keyboard.dismiss();
 fix/conflict-markers
    const added = addMoodHistory({ mood: selectedMood, note: noteText.trim() });
    if (!added) {
      Alert.alert("Лимит достигнут", `Максимум ${MAX_ENTRIES_PER_DAY} записей в день.`);
      return;
    }
    const phrase = pick(supportPhrases);
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

    updateField("moodNote", noteText.trim());
    updateField("moodNoteSubmitted", true);
    setSubmitted(true);
    setSupportPhrase(pick(supportPhrases[state.mood]));
 main
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
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      flexGrow: 1,
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
 fix/conflict-markers
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

      paddingHorizontal: hPad,
      gap: isSmall ? 18 : 22,
 main
    },
    title: { fontSize: rf(isSmall ? 26 : 30), fontFamily: "Inter_700Bold", color: colors.foreground, letterSpacing: -0.5 },
    subtitle: { fontSize: rf(14), fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: -10 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap },
    circleWrapper: { width: circleSize, alignItems: "center", gap: 6 },
    circle: {
 fix/conflict-markers
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2.5,
      borderColor: "transparent",
    },
    circleSelected: {
      borderColor: colors.primary,
    },
    moodEmoji: { fontSize: 30 },
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

      width: circleSize, height: circleSize,
      borderRadius: circleSize / 2,
      alignItems: "center", justifyContent: "center",
      borderWidth: 2.5, borderColor: "transparent",
    },
    circleSelected: { borderColor: colors.primary },
    moodEmoji: { fontSize: Math.min(circleSize * 0.48, 36) },
    moodLabel: { fontSize: rf(11), fontFamily: "Inter_500Medium", color: colors.mutedForeground, textAlign: "center" },
    moodLabelSelected: { color: colors.primary, fontFamily: "Inter_600SemiBold" },
    noteCard: {
      backgroundColor: colors.card, borderRadius: 22,
      padding: isSmall ? 18 : 22, gap: 14, ...cardShadow,
 main
    },
    noteTitle: { fontSize: rf(17), fontFamily: "Inter_700Bold", color: colors.foreground },
    noteSubtitle: { fontSize: rf(13), fontFamily: "Inter_400Regular", color: colors.mutedForeground, lineHeight: rf(20), marginTop: -6 },
    noteInput: {
 fix/conflict-markers
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      backgroundColor: colors.muted,
      borderRadius: 16,
      padding: 14,
      minHeight: 90,
      textAlignVertical: "top",
    },
    submitBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 13,
      alignItems: "center",
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

      fontSize: rf(15), fontFamily: "Inter_400Regular", color: colors.foreground,
      backgroundColor: colors.muted, borderRadius: 14,
      padding: 14, minHeight: 100, textAlignVertical: "top",
    },
    submitBtn: { backgroundColor: colors.primary, borderRadius: 100, paddingVertical: 13, alignItems: "center" },
    submitBtnText: { fontSize: rf(15), fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
    submittedNote: {
      fontSize: rf(14), fontFamily: "Inter_400Regular", color: colors.foreground,
      fontStyle: "italic", lineHeight: rf(22),
    },
    editLink: { fontSize: rf(13), fontFamily: "Inter_500Medium", color: colors.primary },
    supportCard: {
      borderRadius: 22, padding: isSmall ? 18 : 22, gap: 8,
      backgroundColor: isDark ? colors.muted : colors.amber, ...cardShadow,
    },
    supportLabel: {
      fontSize: rf(11), fontFamily: "Inter_600SemiBold", color: colors.primary,
      textTransform: "uppercase", letterSpacing: 1,
    },
    supportText: { fontSize: rf(16), fontFamily: "Inter_500Medium", color: colors.foreground, lineHeight: rf(26) },
    emptyState: { alignItems: "center", paddingVertical: 20, gap: 8 },
    emptyText: { fontSize: rf(14), fontFamily: "Inter_400Regular", color: colors.mutedForeground, textAlign: "center", lineHeight: rf(22) },
 main
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.title}>Как ты себя{"\n"}чувствуешь?</Text>
        <Text style={s.subtitle}>Твоё настроение помогает нам быть рядом</Text>

 fix/conflict-markers
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
                <Pressable
                  key={item.key}
                  style={[
                    s.editMoodBtn,
                    editState.mood === item.key && s.editMoodBtnActive,

        <View style={s.grid}>
          {MOOD_ITEMS.map((item) => {
            const isSelected = state.mood === item.key;
            const bg = isDark ? moodDarkColors[item.key] : item.color;
            return (
              <View key={item.key} style={s.circleWrapper}>
                <Pressable
                  style={({ pressed }) => [
                    s.circle,
                    { backgroundColor: bg },
                    isSelected && s.circleSelected,
                    pressed && { opacity: 0.8, transform: [{ scale: 0.94 }] },
 main
                  ]}
                  onPress={() => setEditState({ ...editState, mood: item.key })}
                >
                  <Text style={[s.editMoodBtnText, editState.mood === item.key && s.editMoodBtnTextActive]}>
                    {item.emoji} {item.label}
                  </Text>
                </Pressable>
 fix/conflict-markers
              ))}
            </View>

                <Text style={[s.moodLabel, isSelected && s.moodLabelSelected]}>{item.label}</Text>
              </View>
            );
          })}
        </View>

        {state.mood && !submitted && (
          <View style={s.noteCard}>
            <Text style={s.noteTitle}>Расскажи подробнее</Text>
            <Text style={s.noteSubtitle}>Что произошло сегодня? Записывай всё — это помогает</Text>
 main
            <TextInput
              style={s.editInput}
              value={editState.note}
              onChangeText={(t) => setEditState({ ...editState, note: t })}
              placeholder="Заметка (необязательно)"
              placeholderTextColor={colors.mutedForeground}
              multiline
            />
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

 fix/conflict-markers
        {/* New entry form */}
        {canAddMore && !editState && (
          <>
            <Text style={s.sectionLabel}>
              {todayEntries.length === 0 ? "Выбери настроение" : "Добавить ещё запись"}
            </Text>

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

        {submitted && state.moodNote ? (
          <View style={s.noteCard}>
            <Text style={s.noteTitle}>Твоя запись</Text>
            <Text style={s.submittedNote}>«{state.moodNote}»</Text>
            <Pressable onPress={() => { setSubmitted(false); setSupportPhrase(null); updateField("moodNoteSubmitted", false); }}>
              <Text style={s.editLink}>Изменить запись</Text>
            </Pressable>
          </View>
        ) : null}

        {supportPhrase ? (
          <Animated.View style={[s.supportCard, { opacity: fadeAnim }]}>
            <Text style={s.supportLabel}>Warmly говорит</Text>
            <Text style={s.supportText}>{supportPhrase}</Text>
          </Animated.View>
        ) : null}
 main

        {/* Empty state */}
        {todayEntries.length === 0 && !selectedMood && (
          <View style={s.emptyState}>
            <Text style={{ fontSize: 32 }}>🌱</Text>
            <Text style={s.emptyText}>Регулярная оценка настроения{"\n"}помогает лучше понимать себя</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
