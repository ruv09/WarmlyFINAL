import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { useTheme } from "../../theme";

interface KeyboardScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
}

/**
 * Экран с формой ввода: поднимает контент над клавиатурой
 * (сильная сторона UX из Warmly v1) и даёт keyboardShouldPersistTaps.
 */
export function KeyboardScreen({ children, edges, style }: KeyboardScreenProps) {
  const theme = useTheme();
  const paddingHorizontal = theme.spacing("md");
  const paddingVertical = theme.spacing("md");

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flexFill, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flexFill}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal, paddingVertical },
            style,
          ]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexFill: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
