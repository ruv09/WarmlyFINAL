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
import { useResponsive } from "@/utils/responsive";
import { MOOD_ITEMS, type MoodKey } from "@/utils/phrases";

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

const supportPhrases: Record<MoodKey, string[]> = {
  good:    ["Это здорово! Сохрани эту энергию и поделись теплом с близкими 💛", "Твоя радость заразительна — пусть она длится как можно дольше 🌟"],
  calm:    ["Спокойствие — это твоя суперсила. Береги этот внутренний мир 🌿", "Тихий день — это тоже подарок. Ты в гармонии с собой ✨"],
  neutral: ["Нейтральный день — отличное время для наблюдения и размышлений 🍃", "Не каждый день должен быть особенным — это тоже нормально 💙"],
  tired:   ["Ты много сделал(а) сегодня. Теперь позволь себе отдохнуть — ты это заслужил(а) 🌙", "Усталость — знак того, что ты старался(ась). Восстановление так же важно 🫂"],
  anxious: ["Сделай три глубоких вдоха. Ты справляешься — шаг за шагом 💛", "Тревога не определяет тебя. Ты сильнее, чем кажется прямо сейчас 🌤"],
  sad:     ["Грустить — это нормально. Твои чувства важны. Ты не один(а) 🤍", "Даже в самый серый день есть маленький свет. Ты справишься 🕯"],
};

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const moodDarkColors: Record<MoodKey, string> = {
  good: "#3A2D18", calm: "#1A2922", neutral: "#2A2520",
  tired: "#1E2820", anxious: "#2A1A1A", sad: "#1E1B2A",
};

export default function MoodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { rf, hPad, isSmall, width } = useResponsive();
  const { state, updateField } = useApp();
  const isDark = colors.background === "#131110";

  // Responsive circle size — computed from live window width
  const cols = 3;
  const gap = 12;
  const circleSize = Math.max(
    Math.floor((width - hPad * 2 - gap * (cols - 1)) / cols),
    72,
  );

  const [noteText, setNoteText] = useState(state.moodNote ?? "");
  const [submitted, setSubmitted] = useState(state.moodNoteSubmitted ?? false);
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 88;

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
    setSupportPhrase(pick(supportPhrases[state.mood]));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: hPad,
      gap: isSmall ? 18 : 22,
    },
    title: { fontSize: rf(isSmall ? 26 : 30), fontFamily: "Inter_700Bold", color: colors.foreground, letterSpacing: -0.5 },
    subtitle: { fontSize: rf(14), fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: -10 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap },
    circleWrapper: { width: circleSize, alignItems: "center", gap: 6 },
    circle: {
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
    },
    noteTitle: { fontSize: rf(17), fontFamily: "Inter_700Bold", color: colors.foreground },
    noteSubtitle: { fontSize: rf(13), fontFamily: "Inter_400Regular", color: colors.mutedForeground, lineHeight: rf(20), marginTop: -6 },
    noteInput: {
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
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.title}>Как ты себя{"\n"}чувствуешь?</Text>
        <Text style={s.subtitle}>Твоё настроение помогает нам быть рядом</Text>

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
                  ]}
                  onPress={() => handleMood(item.key)}
                >
                  <Text style={s.moodEmoji}>{item.emoji}</Text>
                </Pressable>
                <Text style={[s.moodLabel, isSelected && s.moodLabelSelected]}>{item.label}</Text>
              </View>
            );
          })}
        </View>

        {state.mood && !submitted && (
          <View style={s.noteCard}>
            <Text style={s.noteTitle}>Расскажи подробнее</Text>
            <Text style={s.noteSubtitle}>Что произошло сегодня? Записывай всё — это помогает</Text>
            <TextInput
              style={s.noteInput}
              placeholder="Напиши всё, что хочешь..."
              placeholderTextColor={colors.mutedForeground}
              value={noteText}
              onChangeText={setNoteText}
              multiline
            />
            <Pressable
              style={({ pressed }) => [s.submitBtn, pressed && { opacity: 0.85 }]}
              onPress={handleSubmit}
            >
              <Text style={s.submitBtnText}>Отправить</Text>
            </Pressable>
          </View>
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

        {!state.mood && (
          <View style={s.emptyState}>
            <Text style={{ fontSize: 32 }}>🌱</Text>
            <Text style={s.emptyText}>Регулярная оценка настроения{"\n"}помогает лучше понимать себя</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
