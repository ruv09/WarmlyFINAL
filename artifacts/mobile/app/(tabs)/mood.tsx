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
  useWindowDimensions,
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

const supportPhrases = [
  "Каждая запись — это уже маленькая забота о себе 💛",
  "Ты сделал(а) важный шаг: заметил(а), что происходит внутри 🌿",
  "Даже тихий день становится частью твоего пути ✨",
  "Спасибо, что нашёл(ла) минуту для себя. Это имеет значение 🍊",
];

const moodDarkColors: Record<MoodKey, string> = {
  good: "#3A2D18",
  calm: "#1A2922",
  neutral: "#2A2520",
  tired: "#1E2820",
  anxious: "#2A1A1A",
  sad: "#1E1B2A",
};

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

type EditState = "idle" | "editing" | "saved";

export default function MoodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addMoodHistory } = useApp();
  const isDark = colors.background === "#131110";
  const { width } = useWindowDimensions();
  const gridHorizontalPadding = 22 * 2;
  const gridGap = 16 * 2;
  const rawCircleSize = (width - gridHorizontalPadding - gridGap) / 3;
  const circleSize = Math.max(84, Math.min(rawCircleSize, 132));

  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [noteText, setNoteText] = useState("");
  const [victoryText, setVictoryText] = useState("");
  const [supportPhrase, setSupportPhrase] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>("idle");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const handleMoodSelect = (key: MoodKey) => {
    setSelectedMood(key);
    setEditState("editing");
    setSupportPhrase(null);
    fadeAnim.setValue(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = () => {
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
    circleSelected: { borderColor: colors.primary },
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
      opacity: noteText.trim() ? 1 : 0.7,
    },
    submitBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
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

        {selectedMood && editState === "editing" && (
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
              ]}
              onPress={handleSubmit}
            >
              <Text style={s.submitBtnText}>Отправить</Text>
            </Pressable>
          </View>
        )}

        {supportPhrase && (
          <Animated.View style={[s.supportCard, { opacity: fadeAnim }]}>
            <Text style={s.supportLabel}>Warmly говорит</Text>
            <Text style={s.supportText}>{supportPhrase}</Text>
          </Animated.View>
        )}

        {!selectedMood && editState !== "saved" && (
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
