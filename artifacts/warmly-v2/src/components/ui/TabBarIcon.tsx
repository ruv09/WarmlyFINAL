import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme";

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}

/**
 * Активная вкладка получает мягкую "таблетку"-подложку вместо простой
 * смены цвета — так таб-бар ближе к референсу (скруглённые формы,
 * ничего резкого/угловатого). Единственное место, которое решает, как
 * выглядит иконка вкладки — таб-лейаут не дублирует эту разметку
 * пять раз.
 */
export function TabBarIcon({ name, focused }: TabBarIconProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        width: 40,
        height: 32,
        borderRadius: theme.radius.full,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? `${theme.colors.accent}26` : "transparent",
      }}
    >
      <Ionicons
        name={name}
        size={22}
        color={focused ? theme.colors.accent : theme.colors.textSecondary}
      />
    </View>
  );
}
