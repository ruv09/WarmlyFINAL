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
import { useResponsive } from "@/utils/responsive";

const cardShadow = Platform.select({
  web: { boxShadow: "0px 4px 24px rgba(0,0,0,0.07)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
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
  const { rf, hPad, isSmall } = useResponsive();
  const { state, removeFavorite } = useApp();

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 88;

  const handleRemove = (quote: string) => {
    removeFavorite(quote);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingTop: topPad + 20,
      paddingBottom: bottomPad,
      paddingHorizontal: hPad,
      gap: isSmall ? 12 : 16,
      flexGrow: 1,
    },
    title: { fontSize: rf(isSmall ? 26 : 30), fontFamily: "Inter_700Bold", color: colors.foreground, letterSpacing: -0.5 },
    countText: { fontSize: rf(14), fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: -8 },
    card: { backgroundColor: colors.card, borderRadius: 22, padding: isSmall ? 18 : 22, gap: 14, ...cardShadow },
    quoteMark: {
      fontSize: rf(40), color: colors.primary, fontFamily: "Inter_700Bold",
      lineHeight: rf(32), opacity: 0.2,
    },
    quoteText: {
      fontSize: rf(isSmall ? 15 : 16), fontFamily: "Inter_400Regular",
      color: colors.foreground, lineHeight: rf(26), fontStyle: "italic",
    },
    cardFooter: { flexDirection: "row", justifyContent: "flex-end" },
    removeBtn: {
      flexDirection: "row", alignItems: "center", gap: 6,
      paddingHorizontal: 14, paddingVertical: 8,
      borderRadius: 100, backgroundColor: colors.muted,
    },
    removeBtnText: { fontSize: rf(13), fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    emptyWrapper: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingBottom: 60 },
    emptyCircle: {
      width: 72, height: 72, borderRadius: 36,
      backgroundColor: colors.amber, alignItems: "center", justifyContent: "center",
      ...cardShadow,
    },
    emptyTitle: { fontSize: rf(20), fontFamily: "Inter_700Bold", color: colors.foreground },
    emptyText: {
      fontSize: rf(14), fontFamily: "Inter_400Regular",
      color: colors.mutedForeground, textAlign: "center", lineHeight: rf(22),
    },
  });

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.title}>Избранное</Text>

      {state.favorites.length === 0 ? (
        <>
          <View style={s.emptyWrapper}>
            <View style={s.emptyCircle}>
              <Ionicons name="heart-outline" size={30} color={colors.primary} />
            </View>
            <Text style={s.emptyTitle}>Пока пусто</Text>
            <Text style={s.emptyText}>
              Нажми на сердечко на главном экране,{"\n"}и цитата появится здесь
            </Text>
          </View>
        </>
      ) : (
        <>
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
        </>
      )}
    </ScrollView>
  );
}
