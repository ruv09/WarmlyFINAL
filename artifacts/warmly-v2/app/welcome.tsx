import React, { useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { KeyboardScreen } from "../src/components/layout";
import { Button } from "../src/components/ui";
import { useSettingsStore } from "../src/store";
import { useTheme } from "../src/theme";

/**
 * Онбординг с именем — сильная сторона Warmly v1.
 * Спокойный первый экран, без давления.
 */
export default function WelcomeScreen() {
  const theme = useTheme();
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  async function handleStart() {
    if (!name.trim()) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
      inputRef.current?.focus();
      return;
    }

    Keyboard.dismiss();
    await completeOnboarding(name);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    router.replace("/(tabs)");
  }

  async function handleSkip() {
    await completeOnboarding("Друг");
    router.replace("/(tabs)");
  }

  return (
    <KeyboardScreen>
      <View style={{ flex: 1, justifyContent: "space-between", minHeight: 480 }}>
        <View style={{ alignItems: "center", marginTop: theme.spacing("xxl"), gap: 8 }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.largeTitle + 20,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.textPrimary,
              letterSpacing: -1.5,
            }}
          >
            Warmly
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.body,
              color: theme.colors.textSecondary,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Маленькие вещи,{"\n"}большие чувства
          </Text>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.xl,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing("lg"),
            gap: theme.spacing("md"),
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.title - 4,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.textPrimary,
            }}
          >
            Как тебя зовут?
          </Text>
          <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>
            Мы будем обращаться к тебе по имени каждый день 💛
          </Text>

          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <TextInput
              ref={inputRef}
              value={name}
              onChangeText={setName}
              placeholder="Введи своё имя..."
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleStart}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                fontSize: theme.typography.sizes.body + 2,
                color: theme.colors.textPrimary,
                backgroundColor: theme.colors.background,
                borderRadius: theme.radius.md,
                paddingHorizontal: theme.spacing("md"),
                paddingVertical: theme.spacing("md"),
                borderWidth: 2,
                borderColor: focused ? theme.colors.accent : "transparent",
              }}
            />
          </Animated.View>

          <Button label="Начать →" onPress={handleStart} />
        </View>

        <Pressable onPress={handleSkip} style={{ alignItems: "center", paddingVertical: 12 }}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.caption }}>
            Пропустить
          </Text>
        </Pressable>
      </View>
    </KeyboardScreen>
  );
}
