import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Screen } from "../components/layout";
import { Button } from "../components/ui";
import { EntryCard } from "../components/entry";
import { TreeIllustration } from "../components/tree";
import { FadeView } from "../components/animation";
import { useEntries, useFavorites, useForest } from "../hooks";
import { useSettingsStore } from "../store";
import { useTheme } from "../theme";
import { ROUTES } from "../constants/routes";
import { getFallbackQuote, getGreeting, treesLabel } from "../utils";

/**
 * Главная: приветствие по имени, мысль дня с избранным (из v1),
 * записи сегодня и превью леса.
 */
export function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { todayEntries } = useEntries();
  const { trees, total } = useForest();
  const { favorites, addFavorite } = useFavorites();
  const settings = useSettingsStore((s) => s.settings);
  const [savedFlash, setSavedFlash] = useState(false);

  const greeting = useMemo(() => getGreeting(settings.name), [settings.name]);
  const hasEntriesToday = todayEntries.length > 0;
  const previewTrees = trees.slice(-3);

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
    <Screen edges={["top", "left", "right"]}>
      <Text
        style={{
          fontSize: theme.typography.sizes.largeTitle,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
        }}
      >
        {greeting}
      </Text>
      <Text
        style={{
          marginTop: 4,
          marginBottom: theme.spacing("lg"),
          fontSize: theme.typography.sizes.body,
          color: theme.colors.textSecondary,
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.content}
      >
        Заботься о себе сегодня
      </Text>

      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing("lg"),
          marginBottom: theme.spacing("lg"),
          gap: theme.spacing("sm"),
        }}
      >
        <Text
          style={{
            fontSize: theme.typography.sizes.caption,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.accent,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Мысль дня
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.subtitle,
            color: theme.colors.textPrimary,
            fontStyle: "italic",
            lineHeight: 26,
          }}
        >
          {quote}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
              {savedFlash ? "Сохранено!" : isFav ? "В избранном" : "В избранное"}
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

      <FadeView visible={!hasEntriesToday} style={{ display: hasEntriesToday ? "none" : "flex" }}>
        <Text
          style={{
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing("lg"),
          }}
        >
          Сегодня вы ещё ничего не записали.
        </Text>
      </FadeView>

      {hasEntriesToday && (
        <View style={{ marginBottom: theme.spacing("lg"), gap: theme.spacing("sm") }}>
          {todayEntries.map((entry) => (
            <FadeView key={entry.id} visible>
              <EntryCard entry={entry} onPress={() => router.push(ROUTES.entry(entry.id))} />
            </FadeView>
          ))}
        </View>
      )}

      <Button label="Новая запись" onPress={() => router.push(ROUTES.entryNew)} />

      {total > 0 && (
        <Pressable
          onPress={() => router.push(ROUTES.forest)}
          style={{ marginTop: theme.spacing("xxl") }}
        >
          <Text
            style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing("sm"),
            }}
          >
            В вашем лесу {treesLabel(total)}
          </Text>
          <View style={{ flexDirection: "row", gap: theme.spacing("sm") }}>
            {previewTrees.map((tree) => (
              <TreeIllustration key={tree.id} tree={tree} size={96} />
            ))}
          </View>
        </Pressable>
      )}
    </Screen>
  );
}
