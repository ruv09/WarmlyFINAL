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

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, removeFavorite } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const handleRemove = (quote: string) => {
    removeFavorite(quote);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingTop: topPad + 24, paddingBottom: bottomPad, paddingHorizontal: 20, gap: 12 },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground, marginBottom: 4 },
    count: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginBottom: 12 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 16,
    },
    quoteText: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 26,
      fontStyle: "italic",
    },
    cardFooter: { flexDirection: "row", justifyContent: "flex-end" },
    removeBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.muted,
    },
    removeBtnText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingTop: 80 },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.peachSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground, textAlign: "center", lineHeight: 22 },
  });

  if (state.favorites.length === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, { flex: 1 }]}>
        <Text style={styles.title}>Избранное</Text>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Пока пусто</Text>
          <Text style={styles.emptyText}>Сохраняй цитаты с главного экрана,{"\n"}и они появятся здесь</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Избранное</Text>
      <Text style={styles.count}>{state.favorites.length} {state.favorites.length === 1 ? "цитата" : state.favorites.length < 5 ? "цитаты" : "цитат"}</Text>
      {state.favorites.map((quote, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.quoteText}>«{quote}»</Text>
          <View style={styles.cardFooter}>
            <Pressable
              style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.7 }]}
              onPress={() => handleRemove(quote)}
            >
              <Ionicons name="trash-outline" size={14} color={colors.mutedForeground} />
              <Text style={styles.removeBtnText}>Удалить</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
