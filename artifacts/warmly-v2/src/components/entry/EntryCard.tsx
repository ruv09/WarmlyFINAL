import React from "react";
import { Text, View } from "react-native";
import { Entry } from "../../types";
import { getMoodById } from "../../constants/moods";
import { useTheme } from "../../theme";
import { PressableScale } from "../animation";

interface EntryCardProps {
  entry: Entry;
  onPress?: () => void;
}

export function EntryCard({ entry, onPress }: EntryCardProps) {
  const theme = useTheme();
  const mood = getMoodById(entry.moodId);

  const content = (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.md,
        padding: theme.spacing("md"),
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>{mood?.emoji ?? "•"}</Text>
        <Text
          style={{ fontSize: theme.typography.sizes.caption, color: theme.colors.textSecondary }}
          maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
        >
          {entry.time}
        </Text>
      </View>

      {entry.note.length > 0 && (
        <Text
          style={{
            marginTop: theme.spacing("sm"),
            fontSize: theme.typography.sizes.body,
            color: theme.colors.textPrimary,
            lineHeight: theme.typography.sizes.body * 1.4,
          }}
          maxFontSizeMultiplier={theme.typography.scaleLimits.content}
        >
          {entry.note}
        </Text>
      )}

      {entry.smallWin && (
        <Text
          style={{
            marginTop: theme.spacing("sm"),
            fontSize: theme.typography.sizes.caption,
            fontStyle: "italic",
            color: theme.colors.accent,
          }}
          maxFontSizeMultiplier={theme.typography.scaleLimits.content}
        >
          ✦ {entry.smallWin}
        </Text>
      )}
    </View>
  );

  if (!onPress) return content;

  return <PressableScale onPress={onPress}>{content}</PressableScale>;
}
