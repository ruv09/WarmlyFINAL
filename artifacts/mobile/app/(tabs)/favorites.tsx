import { Ionicons } from "@expo/vector-icons";
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

const cardShadow = Platform.select({
  web: { boxShadow: "0px 4px 24px rgba(0,0,0,0.07)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
});

function pluralQuotes(n: number): string {
  if (n === 1) return "цитата";
  if (n >= 2 && n <= 4) return "цитаты";
  return "цитат";
}

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, removeFavorite } = useApp();

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const handleRemove = (quote: string) => {
    removeFavorite(quote);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: 22,
      gap: 16,
    },
    title: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    countText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -8,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 24,
      gap: 18,
      ...cardShadow,
    },
    quoteText: {
      fontSize: 17,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 28,
      fontStyle: "italic",
    },
    quoteMark: {
      fontSize: 48,
      color: colors.primary,
      fontFamily: "Inter_700Bold",
      lineHeight: 40,
      opacity: 0.2,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    removeBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 100,
      backgroundColor: colors.muted,
    },
    removeBtnText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    emptyWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      paddingTop: 80,
    },
    emptyCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.amber,
      alignItems: "center",
      justifyContent: "center",
      ...cardShadow,
    },
    emptyTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    emptyText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 24,
    },
  });

  if (state.favorites.length === 0) {
    return (
      <ScrollView style={s.container} contentContainerStyle={[s.content, { flex: 1 }]}>
        <Text style={s.title}>Избранное</Text>
        <View style={s.emptyWrapper}>
          <View style={s.emptyCircle}>
            <Ionicons name="heart-outline" size={32} color={colors.primary} />
          </View>
          <Text style={s.emptyTitle}>Пока пусто</Text>
          <Text style={s.emptyText}>
            Нажми на сердечко на главном экране,{"\n"}и цитата появится здесь
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.title}>Избранное</Text>
      <Text style={s.countText}>
        {state.favorites.length} {pluralQuotes(state.favorites.length)} сохранено
      </Text>

      {state.favorites.map((quote, i) => (
        <View key={i} style={s.card}>
          <Text style={s.quoteMark}>"</Text>
          <Text style={s.quoteText}>{quote}</Text>
          <View style={s.cardFooter}>
            <Pressable
              style={({ pressed }) => [s.removeBtn, pressed && { opacity: 0.7 }]}
              onPress={() => handleRemove(quote)}
            >
              <Ionicons name="trash-outline" size={14} color={colors.mutedForeground} />
              <Text style={s.removeBtnText}>Удалить</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
