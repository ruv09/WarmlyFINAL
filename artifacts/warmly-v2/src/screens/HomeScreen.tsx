import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Screen } from "../components/layout";
import { Button } from "../components/ui";
import { EntryCard } from "../components/entry";
import { FadeView } from "../components/animation";
import { useEntries, useFavorites } from "../hooks";
import { useSettingsStore } from "../store";
import { useTheme } from "../theme";
import { ROUTES } from "../constants/routes";
import { getFallbackQuote, getGreeting } from "../utils";

/**
 * Главная Warmly: поддерживающая фраза — главный акцент экрана.
 */
export function HomeScreen() {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const router = useRouter();
  const { todayEntries } = useEntries();
  const { favorites, addFavorite } = useFavorites();
  const settings = useSettingsStore((s) => s.settings);
  const [savedFlash, setSavedFlash] = useState(false);

  const greeting = useMemo(() => getGreeting(settings.name), [settings.name]);
  const hasEntriesToday = todayEntries.length > 0;

  const quote = useMemo(() => {
    if (settings.supportivePhrasesEnabled) {
      return settings.dailyPhrase || getFallbackQuote();
    }
    return getFallbackQuote();
  }, [settings.supportivePhrasesEnabled, settings.dailyPhrase]);

  const isFav = favorites.includes(quote);

  async function handleAddFav() {
    if (isFav) return;
    await addFavorite(quote);
    setSavedFlash(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  return (
    <Screen edges={["top", "left", "right"]} scroll>
      <Text
        style={{
          fontSize: theme.typography.sizes.caption,
          color: theme.colors.textSecondary,
          letterSpacing: 0.4,
        }}
      >
        Warmly
      </Text>
      <Text
        style={{
          marginTop: 4,
          fontSize: theme.typography.sizes.largeTitle,
          fontWeight: theme.typography.weights.bold,
          color: theme.colors.textPrimary,
        }}
      >
        {greeting}
      </Text>

      {/* Мысль дня — герой экрана */}
      <View
        style={[
          styles.phraseHero,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            marginTop: theme.spacing("lg"),
            marginBottom: theme.spacing("lg"),
          },
        ]}
      >
        <Text
          style={{
            fontSize: theme.typography.sizes.caption,
            fontWeight: theme.typography.weights.semibold,
            color: isDark ? theme.colors.accentWarm : theme.colors.accent,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: theme.spacing("md"),
          }}
        >
          Мысль дня
        </Text>
        <Text
          style={{
            fontSize: 26,
            lineHeight: 34,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.textPrimary,
          }}
        >
          {quote}
        </Text>

        <View
          style={{
            marginTop: theme.spacing("lg"),
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={handleAddFav}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: theme.radius.full,
              backgroundColor: theme.colors.background,
            }}
          >
            <Ionicons
              name={isFav || savedFlash ? "heart" : "heart-outline"}
              size={16}
              color={isFav || savedFlash ? theme.colors.accentWarm : theme.colors.textSecondary}
            />
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.caption }}>
              {savedFlash ? "Сохранено" : isFav ? "В избранном" : "В избранное"}
            </Text>
          </Pressable>
          {favorites.length > 0 && (
            <Pressable onPress={() => router.push(ROUTES.favorites)}>
              <Text style={{ color: theme.colors.accent, fontSize: theme.typography.sizes.caption }}>
                Избранное →
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {!hasEntriesToday && (
        <Text
          style={{
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing("md"),
            lineHeight: 22,
          }}
        >
          Сегодня ещё нет записи — посади дерево в своём лесу.
        </Text>
      )}

      {hasEntriesToday && (
        <View style={{ marginBottom: theme.spacing("md"), gap: theme.spacing("sm") }}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.caption,
              marginBottom: 4,
            }}
          >
            Сегодня
          </Text>
          {todayEntries.map((entry) => (
            <FadeView key={entry.id} visible>
              <EntryCard entry={entry} onPress={() => router.push(ROUTES.entry(entry.id))} />
            </FadeView>
          ))}
        </View>
      )}

      <Button label="Новая запись" onPress={() => router.push(ROUTES.entryNew)} />

      <Pressable
        onPress={() => router.push(ROUTES.forest)}
        style={{ marginTop: theme.spacing("lg"), marginBottom: theme.spacing("xxl") }}
      >
        <Text style={{ color: theme.colors.accent, fontSize: theme.typography.sizes.body }}>
          Открыть мой лес →
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  phraseHero: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
  },
});
