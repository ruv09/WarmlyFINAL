import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { useSettingsStore } from "../src/store";
import { useTheme } from "../src/theme";

/**
 * GestureHandlerRootView должен быть самым внешним элементом дерева —
 * это требование react-native-gesture-handler, без него составные
 * жесты (пан + пинч-зум) в Лесу не будут работать корректно.
 *
 * При старте гидратируем настройки (тема, имя, уведомления) и
 * направляем на онбординг, если пользователь ещё не прошёл welcome.
 */
function Bootstrap() {
  const theme = useTheme();
  const isHydrated = useSettingsStore((s) => s.isHydrated);
  const isOnboarded = useSettingsStore((s) => s.settings.isOnboarded);
  const load = useSettingsStore((s) => s.load);
  const segments = useSegments();

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  useEffect(() => {
    if (!isHydrated) return;
    const onWelcome = segments[0] === "welcome";
    if (!isOnboarded && !onWelcome) {
      router.replace("/welcome");
    } else if (isOnboarded && onWelcome) {
      router.replace("/(tabs)");
    }
  }, [isHydrated, isOnboarded, segments]);

  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="entry/[id]" options={{ headerShown: true, title: "Запись" }} />
        <Stack.Screen
          name="entry/new"
          options={{ presentation: "modal", headerShown: true, title: "Новая запись" }}
        />
        <Stack.Screen name="favorites" options={{ headerShown: true, title: "Избранное" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <Bootstrap />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
