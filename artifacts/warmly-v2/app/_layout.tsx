import React, { useEffect } from "react";
import { ActivityIndicator, AppState, Keyboard, Platform, View } from "react-native";
import { Stack, router, useSegments } from "expo-router";
import { NavigationBar, addVisibilityListener } from "expo-navigation-bar";
import { StatusBar, setStatusBarHidden } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { useSettingsStore } from "../src/store";
import { useTheme, useWarmlyFonts } from "../src/theme";

/**
 * Настоящий fullscreen на Android: скрываем системный Status Bar и Navigation Bar.
 * Нижняя навигация приложения (Дневник / Лес / Календарь / Профиль) остаётся.
 */
function useAndroidImmersive() {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const hide = () => {
      setStatusBarHidden(true, "none");
      NavigationBar.setHidden(true);
    };

    hide();
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const app = AppState.addEventListener("change", (state) => {
      if (state === "active") hide();
    });
    const keyboard = Keyboard.addListener("keyboardDidHide", hide);
    const visibility = addVisibilityListener(({ visibility: next }) => {
      if (next !== "visible") return;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 1600);
    });
    return () => {
      clearTimeout(hideTimer);
      app.remove();
      keyboard.remove();
      visibility.remove();
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
      <StatusBar hidden={Platform.OS === "android"} style={barStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="entry/[id]" />
        <Stack.Screen name="entry/new" options={{ presentation: "modal" }} />
        <Stack.Screen name="favorites" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useWarmlyFonts();
  const theme = useTheme();

  if (!fontsLoaded) {
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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <Bootstrap />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
