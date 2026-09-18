import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect } from "react";
import { AppState, Keyboard, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";
import { ForestProvider } from "@/context/ForestContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { scheduleDailyNotifications } from "@/services/notifications";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

async function hideAndroidSystemBars() {
  try {
    await NavigationBar.setBehaviorAsync("overlay-swipe");
    await NavigationBar.setVisibilityAsync("hidden");
  } catch {
    // The API is Android-only and can be unavailable in Expo Go or on older devices.
  }
}

function RootLayoutNav() {
  const { state, isLoaded } = useApp();

  // Redirect to welcome if not onboarded yet
  useEffect(() => {
    if (!isLoaded) return;
    if (!state.isOnboarded) {
      router.replace("/welcome");
    }
  }, [isLoaded, state.isOnboarded]);

  // Initialise push notifications once state is loaded
  useEffect(() => {
    if (!isLoaded || !state.isOnboarded) return;
    scheduleDailyNotifications(state.notifications).catch(() => {});
  }, [isLoaded, state.isOnboarded, state.notifications]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    void hideAndroidSystemBars();

    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") void hideAndroidSystemBars();
      },
    );
    const keyboardSubscription = Keyboard.addListener("keyboardDidHide", () => {
      void hideAndroidSystemBars();
    });

    return () => {
      appStateSubscription.remove();
      keyboardSubscription.remove();
    };
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <StatusBar hidden animated={false} />
      <ThemeProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AppProvider>
              <ForestProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <KeyboardProvider>
                    <RootLayoutNav />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </ForestProvider>
            </AppProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
