import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme";

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

/** Тёплая, спокойная заглушка ошибки — тон из Warmly v1. */
export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing("xl"),
        backgroundColor: theme.colors.background,
        gap: theme.spacing("md"),
      }}
    >
      <Text
        style={{
          fontSize: theme.typography.sizes.title,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
          textAlign: "center",
        }}
      >
        Что-то пошло не так
      </Text>
      <Text
        style={{
          fontSize: theme.typography.sizes.body,
          color: theme.colors.textSecondary,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        Ничего страшного. Попробуй перезагрузить экран — Warmly рядом.
      </Text>
      {__DEV__ && (
        <Text
          style={{
            fontSize: theme.typography.sizes.caption,
            color: theme.colors.textSecondary,
            textAlign: "center",
          }}
          selectable
        >
          {error.message}
        </Text>
      )}
      <Pressable
        onPress={resetError}
        style={{
          marginTop: theme.spacing("md"),
          backgroundColor: theme.colors.accent,
          borderRadius: theme.radius.full,
          paddingVertical: theme.spacing("md"),
          paddingHorizontal: theme.spacing("xl"),
        }}
      >
        <Text
          style={{
            color: theme.colors.surface,
            fontWeight: theme.typography.weights.semibold,
          }}
        >
          Попробовать снова
        </Text>
      </Pressable>
    </View>
  );
}
