import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { useTheme } from "../../theme";

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  /**
   * Какие стороны учитывать под safe area. По умолчанию все —
   * но экран с нижней таб-баром обычно не должен резервировать
   * низ дважды (таб-бар уже учитывает inset снизу), поэтому
   * такие экраны передадут edges={["top", "left", "right"]}.
   */
  edges?: Edge[];
  style?: ViewStyle;
}

/**
 * Общая обёртка экрана.
 *
 * Использует SafeAreaView из react-native-safe-area-context, а не
 * встроенный в React Native SafeAreaView: встроенный работает только
 * на iOS и не учитывает Android-специфику (жестовая навигация,
 * кнопочная навигационная панель). react-native-safe-area-context
 * читает реальные системные отступы на обеих платформах, поэтому
 * контент не перекрывается ни чёлкой/Dynamic Island на iOS, ни
 * навигационной панелью на Android.
 *
 * Никаких фиксированных высот: контейнер растягивается через flex,
 * а не через заданные в dp размеры экрана — на iPhone SE, iPhone 16
 * Pro Max и планшетах это один и тот же код без веток по устройству.
 */
export function Screen({ children, scroll = true, edges, style }: ScreenProps) {
  const theme = useTheme();

  const paddingHorizontal = theme.spacing("md");
  const paddingVertical = theme.spacing("md");

  if (!scroll) {
    return (
      <SafeAreaView
        edges={edges}
        style={[
          styles.flexFill,
          { backgroundColor: theme.colors.background, paddingHorizontal, paddingVertical },
          style,
        ]}
      >
        <CenteredContent theme={theme}>{children}</CenteredContent>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} style={[styles.flexFill, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal, paddingVertical },
          style,
        ]}
      >
        <CenteredContent theme={theme}>{children}</CenteredContent>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * На планшетах (isTablet) ограничивает ширину контента и центрирует
 * его — см. constants/layout.ts MAX_CONTENT_WIDTH. На телефонах
 * не влияет ни на что: contentWidth равен ширине экрана.
 */
function CenteredContent({
  theme,
  children,
}: {
  theme: ReturnType<typeof useTheme>;
  children: React.ReactNode;
}) {
  if (!theme.isTablet) {
    return <>{children}</>;
  }
  return <View style={{ width: theme.contentWidth, alignSelf: "center" }}>{children}</View>;
}

const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
