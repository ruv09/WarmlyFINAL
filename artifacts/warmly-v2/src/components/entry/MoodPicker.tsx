import React from "react";
import { Text, View } from "react-native";
import { MOOD_PICKER_CATALOG } from "../../constants/moods";
import { MoodId } from "../../types";
import { PressableScale } from "../animation";
import { useTheme } from "../../theme";

interface MoodPickerProps {
  selectedMoodId?: MoodId;
  onSelect: (moodId: MoodId) => void;
}

/**
 * Ряд из 5 эмодзи настроения — как на макете дневника.
 */
export function MoodPicker({ selectedMoodId, onSelect }: MoodPickerProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: theme.spacing("xs"),
      }}
    >
      {MOOD_PICKER_CATALOG.map((mood) => {
        const isSelected = mood.id === selectedMoodId;
        return (
          <PressableScale
            key={mood.id}
            onPress={() => onSelect(mood.id)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: theme.spacing("sm"),
              borderRadius: theme.radius.lg,
              backgroundColor: isSelected ? `${mood.color}33` : theme.colors.surface,
              borderWidth: 1.5,
              borderColor: isSelected ? mood.color : theme.colors.border,
            }}
          >
            <Text style={{ fontSize: 28 }}>{mood.emoji}</Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 10,
                textAlign: "center",
                color: isSelected ? mood.color : theme.colors.textSecondary,
                fontWeight: isSelected
                  ? theme.typography.weights.semibold
                  : theme.typography.weights.regular,
              }}
              numberOfLines={1}
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
