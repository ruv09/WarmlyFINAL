import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  useWindowDimensions,
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
import { getTreeForMood, VICTORY_MAX_LENGTH } from "@/utils/journey";
import { MOOD_ITEMS, type MoodKey } from "@/utils/phrases";

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
    "Усталость — знак того, что ты старался(ась). Восстановление так же важно 🫂",
  ],
  anxious: [
    "Сделай три глубоких вдоха. Ты справляешься — шаг за шагом. Мы рядом 💛",
    "Тревога не определяет тебя. Ты сильнее, чем кажется прямо сейчас 🌤",
  ],
  sad: [
    "Грустить — это нормально. Твои чувства важны, и они пройдут. Ты не один(а) 🤍",
    "Даже в самый серый день есть маленький свет. Ты справишься 🕯",
  ],
};

const moodDarkColors: Record<MoodKey, string> = {
  good: "#3A2D18",
  calm: "#1A2922",
  neutral: "#2A2520",
  tired: "#1E2820",
  anxious: "#2A1A1A",
  sad: "#1E1B2A",
};

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export default function MoodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateField, addMoodHistory } = useApp();
  const isDark = colors.background === "#131110";
  const { width } = useWindowDimensions();
  const gridHorizontalPadding = 22 * 2;
  const gridGap = 16 * 2;
  const rawCircleSize = (width - gridHorizontalPadding - gridGap) / 3;
  const circleSize = Math.max(84, Math.min(rawCircleSize, 132));

  const [noteText, setNoteText] = useState(state.moodNote ?? "");
  const [victoryText, setVictoryText] = useState("");
  const [submitted, setSubmitted] = useState(state.moodNoteSubmitted ?? false);
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const handleMood = (key: MoodKey) => {
    if (state.mood === key) return;
    updateField("mood", key);
    updateField("moodNote", "");
    updateField("moodNoteSubmitted", false);
    setNoteText("");
    setSubmitted(false);
    setVictoryText("");
    setSupportPhrase(null);
    fadeAnim.setValue(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = () => {
    if (!noteText.trim() || !state.mood) return;
    Keyboard.dismiss();
    const note = noteText.trim();
    updateField("moodNote", note);
    updateField("moodNoteSubmitted", true);
    const victory = victoryText.trim();
    addMoodHistory({ mood: state.mood, note, victory: victory || undefined });
    setSubmitted(true);
    const phrase = pick(supportPhrases[state.mood]);
    setSupportPhrase(phrase);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: 22,
      gap: 24,
    },
    title: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -16,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    circleWrapper: {
      width: circleSize,
      alignItems: "center",
      gap: 8,
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
    circleSelected: {
      borderColor: colors.primary,
    },
    moodEmoji: { fontSize: 34 },
    moodLabel: {
      fontSize: 12,
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
      padding: 24,
      gap: 16,
      ...cardShadow,
    },
    noteTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    noteSubtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -8,
      lineHeight: 22,
    },
    noteInput: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      backgroundColor: colors.muted,
      borderRadius: 16,
      padding: 16,
      minHeight: 110,
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
      paddingVertical: 14,
      alignItems: "center",
    },
    submitBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    submittedNote: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      fontStyle: "italic",
      lineHeight: 24,
    },
    editLink: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    supportCard: {
      borderRadius: 24,
      padding: 24,
      gap: 10,
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
      fontSize: 17,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      lineHeight: 28,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 24,
      gap: 8,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.title}>Как ты себя{"\n"}чувствуешь?</Text>
        <Text style={s.subtitle}>Твоё настроение помогает нам быть рядом</Text>

        {/* Mood circles */}
        <View style={s.grid}>
          {MOOD_ITEMS.map((item) => {
            const isSelected = state.mood === item.key;
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
                  onPress={() => handleMood(item.key)}
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
        {state.mood && !submitted && (
          <View style={s.noteCard}>
            <Text style={s.noteTitle}>Расскажи подробнее</Text>
            <Text style={s.noteSubtitle}>
              Что произошло сегодня? Записывай всё — это помогает
            </Text>
            <TextInput
              style={s.noteInput}
              placeholder="Напиши всё, что хочешь..."
              placeholderTextColor={colors.mutedForeground}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              returnKeyType="default"
            />
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
            <Text style={s.counterText}>
              {victoryText.length}/{VICTORY_MAX_LENGTH}
            </Text>
            <View style={s.treePreview}>
              <Text style={s.treeEmoji}>
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
              ]}
              onPress={handleSubmit}
            >
              <Text style={s.submitBtnText}>Отправить</Text>
            </Pressable>
          </View>
        )}

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

        {/* Support phrase */}
        {supportPhrase && (
          <Animated.View style={[s.supportCard, { opacity: fadeAnim }]}>
            <Text style={s.supportLabel}>Warmly говорит</Text>
            <Text style={s.supportText}>{supportPhrase}</Text>
          </Animated.View>
        )}

        {!state.mood && (
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
