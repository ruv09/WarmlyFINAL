import React from "react";
import { Text, View } from "react-native";
import { MOOD_CATALOG } from "../../constants/moods";
import { MoodId } from "../../types";
import { PressableScale } from "../animation";
import { useTheme } from "../../theme";

interface MoodPickerProps {
  selectedMoodId?: MoodId;
  onSelect: (moodId: MoodId) => void;
}

/**
 * Рендерится из MOOD_CATALOG — добавление настроения в каталог
 * не требует правок здесь (см. constants/moods.ts).
 */
export function MoodPicker({ selectedMoodId, onSelect }: MoodPickerProps) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing("sm") }}>
      {MOOD_CATALOG.map((mood) => {
        const isSelected = mood.id === selectedMoodId;
        return (
          <PressableScale
            key={mood.id}
            onPress={() => onSelect(mood.id)}
            style={{
              borderWidth: 1,
              borderRadius: theme.radius.md,
              borderColor: isSelected ? mood.color : theme.colors.border,
              backgroundColor: isSelected ? mood.color : theme.colors.surface,
              paddingVertical: theme.spacing("sm"),
              paddingHorizontal: theme.spacing("md"),
              alignItems: "center",
              minWidth: 84,
            }}
          >
            <Text style={{ fontSize: 22 }}>{mood.emoji}</Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: theme.typography.sizes.caption,
                textAlign: "center",
                color: isSelected ? theme.colors.surface : theme.colors.textPrimary,
              }}
              maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
            >
              {mood.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
