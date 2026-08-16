import React from "react";
import { Text, View } from "react-native";
import { Entry } from "../../types";
import { getMoodById } from "../../constants/moods";
import { useTheme } from "../../theme";
import { PressableScale } from "../animation";

interface EntryCardProps {
  entry: Entry;
  onPress?: () => void;
  /** Компактный вид для календаря: эмодзи + время + сниппет */
  compact?: boolean;
}

export function EntryCard({ entry, onPress, compact = false }: EntryCardProps) {
  const theme = useTheme();
  const mood = getMoodById(entry.moodId);
  const snippet = entry.note.trim() || entry.smallWin?.trim() || "Без текста";

  const content = (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.lg,
        padding: theme.spacing("md"),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: compact ? 22 : 20 }}>{mood?.emoji ?? "•"}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: theme.typography.sizes.caption, color: theme.colors.textSecondary }}
            maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
          >
            {entry.time}
            {mood ? ` · ${mood.label}` : ""}
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontSize: theme.typography.sizes.body,
              color: theme.colors.textPrimary,
              lineHeight: theme.typography.sizes.body * 1.35,
            }}
            numberOfLines={compact ? 2 : undefined}
            maxFontSizeMultiplier={theme.typography.scaleLimits.content}
          >
            {snippet}
          </Text>
        </View>
      </View>

      {!compact && entry.smallWin && entry.note.trim().length > 0 && (
        <Text
          style={{
            marginTop: theme.spacing("sm"),
            fontSize: theme.typography.sizes.caption,
            fontStyle: "italic",
            color: theme.colors.accent,
          }}
        >
          ✦ {entry.smallWin}
        </Text>
      )}
    </View>
  );

  if (!onPress) return content;
  return <PressableScale onPress={onPress}>{content}</PressableScale>;
}
