import React from "react";
import { View, ViewStyle } from "react-native";
import { useDeviceMetrics } from "../../hooks/useDeviceMetrics";

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Отдельный от Screen примитив — пригодится, когда внутри одного
 * экрана нужно ограничить ширину только части контента (например,
 * широкий блок статистики "Лес" на весь экран, но текст записи —
 * в узкой читаемой колонке).
 */
export function Container({ children, style }: ContainerProps) {
  const { contentWidth, isTablet } = useDeviceMetrics();

  if (!isTablet) {
    return <View style={style}>{children}</View>;
  }

  return <View style={[style, { width: contentWidth, alignSelf: "center" }]}>{children}</View>;
}
