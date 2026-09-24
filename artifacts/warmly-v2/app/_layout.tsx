import React, { useEffect } from "react";
import { ActivityIndicator, AppState, Keyboard, Platform, View } from "react-native";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { useSettingsStore } from "../src/store";
import { useTheme } from "../src/theme";

/**
 * Expo SDK 54 рисует Android edge-to-edge. expo-status-bar / expo-navigation-bar
 * на этом режиме используют устаревшие API, поэтому системные панели
 * скрываем через SystemBars из react-native-edge-to-edge (уже в дереве Expo).
 */
function useAndroidImmersive() {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const hide = () => {
      SystemBars.setHidden({ statusBar: true, navigationBar: true });
    };

    hide();
    const app = AppState.addEventListener("change", (state) => {
      if (state === "active") hide();
    });
    const keyboard = Keyboard.addListener("keyboardDidHide", hide);
    return () => {
      app.remove();
      keyboard.remove();
    };
  }, []);
}

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
  useAndroidImmersive();
  const barStyle = theme.mode === "dark" ? "light" : "dark";

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
      {Platform.OS === "android" ? (
        <SystemBars style={barStyle} hidden={{ statusBar: true, navigationBar: true }} />
      ) : (
        <StatusBar style={barStyle} />
      )}
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
  const theme = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <Bootstrap />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
