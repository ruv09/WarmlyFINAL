import React, { useCallback } from "react";
import { FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../components/layout";
import { Button } from "../components/ui";
import { EntryCard } from "../components/entry";
import { useEntries } from "../hooks";
import { useTheme } from "../theme";
import { ROUTES } from "../constants/routes";
import { Entry } from "../types";

/**
 * FlatList вместо ScrollView.map — рендерит только видимые элементы,
 * что важно при большом количестве записей (см. требование
 * производительности в ТЗ: "не допускать тяжёлых перерисовок").
 */
export function JournalScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { entries, isLoading } = useEntries();

  const renderItem = useCallback(
    ({ item }: { item: Entry }) => (
      <View style={{ marginBottom: theme.spacing("sm") }}>
        <EntryCard entry={item} onPress={() => router.push(ROUTES.entry(item.id))} />
      </View>
    ),
    [theme, router],
  );

  return (
    <Screen scroll={false} edges={["top", "left", "right"]}>
      <Text
        style={{
          fontSize: theme.typography.sizes.title,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing("md"),
        }}
      >
        Дневник
      </Text>

      <Button label="Новая запись" onPress={() => router.push(ROUTES.entryNew)} />

      <View style={{ marginTop: theme.spacing("lg"), flex: 1 }}>
        {isLoading && (
          <Text style={{ color: theme.colors.textSecondary }}>Загрузка…</Text>
        )}
        {!isLoading && entries.length === 0 && (
          <Text style={{ color: theme.colors.textSecondary }}>
            Здесь появятся ваши записи.
          </Text>
        )}
        <FlatList
          data={entries}
          keyExtractor={(entry) => entry.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
}
