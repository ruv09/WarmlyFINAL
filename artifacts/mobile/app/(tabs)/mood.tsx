import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
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

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { MOOD_ITEMS, type MoodKey } from "@/utils/phrases";

const supportPhrases: Record<MoodKey, string[]> = {
  good: [
    "Это здорово! Сохрани эту энергию и поделись теплом с близкими 💛",
    "Твоя радость заразительна — пусть она длится как можно дольше 🌟",
  ],
  calm: [
    "Спокойствие — это твоя суперсила. Береги этот внутренний мир 🌿",
    "Тихий день — это тоже подарок. Ты в гармонии с собой ✨",
  ],
  neutral: [
    "Нейтральный день — отличное время для наблюдения и размышлений 🍃",
    "Не каждый день должен быть особенным — это тоже нормально 💙",
  ],
  tired: [
    "Ты много сделал(а) сегодня. Теперь позволь себе отдохнуть — ты это заслужил(а) 🌙",
    "Усталость — знак того, что ты старался(ась). Восстановление так же важно, как и движение 🫂",
  ],
  anxious: [
    "Сделай три глубоких вдоха. Ты справляешься — шаг за шагом. Мы рядом 💛",
    "Тревога не определяет тебя. Ты сильнее, чем кажется прямо сейчас 🌤",
  ],
  sad: [
    "Грустить — это нормально. Твои чувства важны, и они пройдут. Ты не один(а) 🤍",
    "Даже в самый серый день есть маленький свет. Ты справишься — по одному моменту 🕯",
  ],
};

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export default function MoodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateField } = useApp();

  const [noteText, setNoteText] = useState(state.moodNote ?? "");
  const [submitted, setSubmitted] = useState(state.moodNoteSubmitted ?? false);
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const handleMood = (key: MoodKey) => {
    if (state.mood === key) return;
    updateField("mood", key);
    updateField("moodNote", "");
    updateField("moodNoteSubmitted", false);
    setNoteText("");
    setSubmitted(false);
    setSupportPhrase(null);
    fadeAnim.setValue(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = () => {
    if (!noteText.trim() || !state.mood) return;
    Keyboard.dismiss();
    updateField("moodNote", noteText.trim());
    updateField("moodNoteSubmitted", true);
    setSubmitted(true);
    const phrase = pick(supportPhrases[state.mood]);
    setSupportPhrase(phrase);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const isDark = colors.background === "#1A1714";

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingTop: topPad + 24, paddingBottom: bottomPad, paddingHorizontal: 20 },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
    subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 4, marginBottom: 28 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    moodBtn: {
      width: "47%", borderRadius: 20, padding: 20,
      alignItems: "center", gap: 8, borderWidth: 2, borderColor: "transparent",
    },
    moodBtnSelected: { borderColor: colors.primary },
    moodEmoji: { fontSize: 36 },
    moodLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    noteSection: {
      marginTop: 24, backgroundColor: colors.card,
      borderRadius: 20, padding: 20,
      borderWidth: 1, borderColor: colors.border, gap: 14,
    },
    noteTitle: {
      fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.foreground,
    },
    noteSubtitle: {
      fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground,
      marginTop: -8,
    },
    noteInput: {
      fontSize: 15, fontFamily: "Inter_400Regular", color: colors.foreground,
      borderWidth: 1, borderColor: colors.border, borderRadius: 14,
      padding: 14, minHeight: 100, textAlignVertical: "top",
      backgroundColor: colors.background,
    },
    submitBtn: {
      backgroundColor: colors.primary, borderRadius: 14,
      paddingVertical: 13, alignItems: "center",
    },
    submitBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
    submittedNote: {
      fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground,
      fontStyle: "italic", lineHeight: 22,
    },
    supportCard: {
      marginTop: 20, borderRadius: 20, padding: 20,
      borderWidth: 1, borderColor: colors.border,
      backgroundColor: isDark ? colors.muted : colors.peachSoft,
      gap: 8,
    },
    supportLabel: {
      fontSize: 11, fontFamily: "Inter_600SemiBold", color: colors.primary,
      textTransform: "uppercase", letterSpacing: 0.8,
    },
    supportText: {
      fontSize: 16, fontFamily: "Inter_500Medium", color: colors.foreground,
      lineHeight: 26, fontStyle: "italic",
    },
    emptyTip: { marginTop: 28, alignItems: "center", paddingVertical: 12 },
    emptyTipText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground, textAlign: "center", lineHeight: 22 },
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.title}>Настроение</Text>
        <Text style={s.subtitle}>Как ты себя чувствуешь сегодня?</Text>

        <View style={s.grid}>
          {MOOD_ITEMS.map((item) => {
            const isSelected = state.mood === item.key;
            const bgColor = isDark
              ? item.key === "good" ? "#3A2D18"
              : item.key === "calm" ? "#1A2922"
              : item.key === "neutral" ? "#2A2520"
              : item.key === "tired" ? "#1E2820"
              : item.key === "anxious" ? "#2A1A1A"
              : "#1E1B2A"
              : item.color;
            return (
              <Pressable
                key={item.key}
                style={({ pressed }) => [
                  s.moodBtn,
                  { backgroundColor: bgColor },
                  isSelected && s.moodBtnSelected,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => handleMood(item.key)}
              >
                <Text style={s.moodEmoji}>{item.emoji}</Text>
                <Text style={s.moodLabel}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {state.mood && !submitted && (
          <View style={s.noteSection}>
            <Text style={s.noteTitle}>Расскажи подробнее</Text>
            <Text style={s.noteSubtitle}>Что произошло сегодня? Запиши — это помогает</Text>
            <TextInput
              style={s.noteInput}
              placeholder="Напиши всё, что хочешь..."
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
              <Text style={s.submitBtnText}>Отправить</Text>
            </Pressable>
          </View>
        )}

        {submitted && state.moodNote && (
          <View style={s.noteSection}>
            <Text style={s.noteTitle}>Твоя запись</Text>
            <Text style={s.submittedNote}>«{state.moodNote}»</Text>
            <Pressable onPress={() => { setSubmitted(false); setSupportPhrase(null); updateField("moodNoteSubmitted", false); }}>
              <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: colors.primary }}>Изменить запись</Text>
            </Pressable>
          </View>
        )}

        {supportPhrase && (
          <Animated.View style={[s.supportCard, { opacity: fadeAnim }]}>
            <Text style={s.supportLabel}>Warmly говорит</Text>
            <Text style={s.supportText}>{supportPhrase}</Text>
          </Animated.View>
        )}

        {!state.mood && (
          <View style={s.emptyTip}>
            <Text style={s.emptyTipText}>Регулярная оценка настроения{"\n"}помогает лучше понимать себя 🌱</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
