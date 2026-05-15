import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { MOOD_ITEMS, type MoodKey } from "@/utils/phrases";

const moodTips: Record<MoodKey, string> = {
  good: "Поделись своей энергией с теми, кто рядом.",
  calm: "Спокойствие — это суперсила. Береги его.",
  neutral: "Нейтральный день — пространство для наблюдения.",
  tired: "Отдых — это не лень, это восстановление.",
  anxious: "Сделай три глубоких вдоха. Ты справляешься.",
  sad: "Позволь себе грустить. Это пройдёт.",
};

export default function MoodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateField } = useApp();

  const handleMood = (key: MoodKey) => {
    updateField("mood", key);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingTop: topPad + 24, paddingBottom: bottomPad, paddingHorizontal: 20 },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
    subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 4, marginBottom: 28 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    moodBtn: {
      width: "47%",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      gap: 8,
      borderWidth: 2,
      borderColor: "transparent",
    },
    moodBtnSelected: { borderColor: colors.primary },
    moodEmoji: { fontSize: 36 },
    moodLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    tipCard: {
      marginTop: 24,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tipTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: colors.primary, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 },
    tipText: { fontSize: 15, fontFamily: "Inter_400Regular", color: colors.foreground, lineHeight: 24, fontStyle: "italic" },
    emptyTip: {
      marginTop: 24,
      alignItems: "center",
      gap: 8,
      paddingVertical: 20,
    },
    emptyTipText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground, textAlign: "center" },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Настроение</Text>
      <Text style={styles.subtitle}>Как ты себя чувствуешь сегодня?</Text>

      <View style={styles.grid}>
        {MOOD_ITEMS.map((item) => {
          const isSelected = state.mood === item.key;
          return (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.moodBtn,
                { backgroundColor: item.color },
                isSelected && styles.moodBtnSelected,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => handleMood(item.key)}
            >
              <Text style={styles.moodEmoji}>{item.emoji}</Text>
              <Text style={styles.moodLabel}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {state.mood ? (
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Совет на сегодня</Text>
          <Text style={styles.tipText}>«{moodTips[state.mood]}»</Text>
        </View>
      ) : (
        <View style={styles.emptyTip}>
          <Text style={styles.emptyTipText}>Регулярная оценка настроения{"\n"}помогает лучше понимать себя</Text>
        </View>
      )}
    </ScrollView>
  );
}
