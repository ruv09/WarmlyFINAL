import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useResponsive } from "@/utils/responsive";

const cardShadow = Platform.select({
  web: { boxShadow: "0px 8px 32px rgba(0,0,0,0.08)" } as object,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 6,
  },
});

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { rf, hPad, isSmall } = useResponsive();
  const { updateField } = useApp();
  const { width } = useWindowDimensions();
  const isCompact = width < 360;
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 40 : insets.bottom + 24;

  const handleStart = () => {
    if (!name.trim()) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 7, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -7, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
      ]).start();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      inputRef.current?.focus();
      return;
    }
    Keyboard.dismiss();
    updateField("name", name.trim());
    updateField("isOnboarded", true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(tabs)");
  };

  const s = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: {
      flex: 1,
      paddingTop: topPad + 10,
      paddingBottom: bottomPad,
 fix/conflict-markers
      paddingHorizontal: isCompact ? 20 : 28,

      paddingHorizontal: hPad,
 main
      justifyContent: "space-between",
    },
    top: { flex: 1, justifyContent: "center", alignItems: "center", gap: 0 },
    decorRow: { flexDirection: "row", gap: isSmall ? 8 : 10, marginBottom: isSmall ? 24 : 32 },
    decorCircle: {
 fix/conflict-markers
      width: isCompact ? 48 : 56,
      height: isCompact ? 48 : 56,
      borderRadius: isCompact ? 24 : 28,
      alignItems: "center",
      justifyContent: "center",
    },
    decorEmoji: { fontSize: isCompact ? 24 : 28 },
    logoText: {
      fontSize: isCompact ? 42 : 52,

      width: isSmall ? 48 : 56, height: isSmall ? 48 : 56, borderRadius: isSmall ? 24 : 28,
      alignItems: "center", justifyContent: "center",
    },
    decorEmoji: { fontSize: isSmall ? 24 : 28 },
    logoText: {
      fontSize: rf(isSmall ? 44 : 52),
 main
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -2,
      textAlign: "center",
    },
    tagline: {
      fontSize: rf(15),
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 8,
      lineHeight: rf(24),
    },
    divider: {
      width: 36, height: 3, borderRadius: 10,
      backgroundColor: colors.primary, alignSelf: "center",
      marginTop: isSmall ? 20 : 28, opacity: 0.5,
    },
    bottom: { gap: 12, paddingTop: 8 },
    card: {
      backgroundColor: colors.card, borderRadius: 26,
      padding: isSmall ? 22 : 28, gap: 16, ...cardShadow,
    },
    cardTitle: {
      fontSize: rf(isSmall ? 19 : 22),
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.3,
    },
    cardSubtitle: {
      fontSize: rf(13),
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -8,
      lineHeight: rf(20),
    },
    input: {
      fontSize: rf(17),
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      backgroundColor: colors.muted,
      borderRadius: 14,
      paddingHorizontal: 18,
      paddingVertical: isSmall ? 13 : 16,
      borderWidth: 2,
      borderColor: focused ? colors.primary : "transparent",
    },
    startBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: isSmall ? 14 : 17,
      alignItems: "center",
    },
    startBtnText: { fontSize: rf(16), fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: 0.2 },
    skipBtn: { alignItems: "center", paddingVertical: 10 },
    skipText: { fontSize: rf(13), fontFamily: "Inter_400Regular", color: colors.mutedForeground },
  });

  const decorItems = [
    { bg: colors.rose,    emoji: "🌸" },
    { bg: colors.amber,   emoji: "☀️" },
    { bg: colors.mint,    emoji: "🌿" },
    { bg: colors.lavender, emoji: "💜" },
  ];

  return (
    <Pressable style={s.flex} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={s.container}>
          {/* Logo */}
          <View style={s.top}>
            <View style={s.decorRow}>
              {decorItems.map((item, i) => (
                <View key={i} style={[s.decorCircle, { backgroundColor: item.bg }]}>
                  <Text style={s.decorEmoji}>{item.emoji}</Text>
                </View>
              ))}
            </View>
            <Text style={s.logoText}>Warmly</Text>
            <Text style={s.tagline}>Маленькие вещи,{"\n"}большие чувства</Text>
            <View style={s.divider} />
          </View>

          {/* Card */}
          <View style={s.bottom}>
            <View style={s.card}>
              <Text style={s.cardTitle}>Как тебя зовут?</Text>
              <Text style={s.cardSubtitle}>
                Мы будем обращаться к тебе по имени каждый день 💛
              </Text>
              <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <TextInput
                  ref={inputRef}
                  style={s.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Введи своё имя..."
                  placeholderTextColor={colors.mutedForeground}
                  returnKeyType="done"
                  onSubmitEditing={handleStart}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </Animated.View>
              <Pressable
                style={({ pressed }) => [s.startBtn, pressed && { opacity: 0.85 }]}
                onPress={handleStart}
              >
                <Text style={s.startBtnText}>Начать →</Text>
              </Pressable>
            </View>

            <Pressable
              style={s.skipBtn}
              onPress={() => {
                updateField("name", "Друг");
                updateField("isOnboarded", true);
                router.replace("/(tabs)");
              }}
            >
              <Text style={s.skipText}>Пропустить</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}
