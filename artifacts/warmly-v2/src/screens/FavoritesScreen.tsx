import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Screen } from "../components/layout";
import { useFavorites } from "../hooks";
import { useTheme } from "../theme";
import { pluralRu } from "../utils";

export function FavoritesScreen() {
  const theme = useTheme();
  const { favorites, removeFavorite } = useFavorites();

  async function handleRemove(quote: string) {
    await removeFavorite(quote);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
  }

  return (
    <Screen>
      <Text
        style={{
          fontSize: theme.typography.sizes.title,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing("sm"),
        }}
      >
        Избранное
      </Text>

      {favorites.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: theme.spacing("xxl"), gap: theme.spacing("md") }}>
          <Ionicons name="heart-outline" size={36} color={theme.colors.accent} />
          <Text style={{ color: theme.colors.textPrimary, fontWeight: theme.typography.weights.semibold }}>
            Пока пусто
          </Text>
          <Text style={{ color: theme.colors.textSecondary, textAlign: "center", lineHeight: 22 }}>
            Нажми на сердечко на главном экране,{"\n"}и цитата появится здесь
          </Text>
        </View>
      ) : (
        <>
          <Text
            style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing("md"),
            }}
          >
            {favorites.length}{" "}
            {pluralRu(favorites.length, "цитата", "цитаты", "цитат")} сохранено
          </Text>
          {favorites.map((quote) => (
            <View
              key={quote}
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: theme.spacing("lg"),
                marginBottom: theme.spacing("sm"),
                gap: theme.spacing("sm"),
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.sizes.body,
                  color: theme.colors.textPrimary,
                  fontStyle: "italic",
                  lineHeight: 24,
                }}
              >
                «{quote}»
              </Text>
              <Pressable
                onPress={() => handleRemove(quote)}
                style={{
                  alignSelf: "flex-end",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: theme.radius.full,
                  backgroundColor: theme.colors.background,
                }}
              >
                <Ionicons name="trash-outline" size={14} color={theme.colors.textSecondary} />
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.caption }}>
                  Удалить
                </Text>
              </Pressable>
            </View>
          ))}
        </>
      )}
    </Screen>
  );
}
