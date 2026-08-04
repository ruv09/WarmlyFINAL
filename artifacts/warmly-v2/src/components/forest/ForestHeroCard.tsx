import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme";
import { ForestBackdrop } from "./ForestBackdrop";

interface ForestHeroCardProps {
  title: string;
  subtitle: string;
  count: number;
  countLabel: string;
  width: number;
  height?: number;
}

/**
 * Крупная иллюстрированная карточка в духе референса: заголовок,
 * подзаголовок и большое число поверх декоративной сцены
 * (ForestBackdrop). `overlay` из темы — специально для того, чтобы
 * текст оставался читаемым на любом фоне, светлом или тёмном.
 */
export function ForestHeroCard({
  title,
  subtitle,
  count,
  countLabel,
  width,
  height = 190,
}: ForestHeroCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { width, height, borderRadius: theme.radius.xl }]}>
      <ForestBackdrop width={width} height={height} />

      <View style={StyleSheet.absoluteFill}>
        <View style={{ padding: theme.spacing("md") }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.title,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.textPrimary,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.caption,
              color: theme.colors.textSecondary,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        </View>

        <View style={{ position: "absolute", left: theme.spacing("md"), bottom: theme.spacing("md") }}>
          <View
            style={{
              backgroundColor: theme.colors.overlay,
              borderRadius: theme.radius.md,
              paddingVertical: theme.spacing("xs"),
              paddingHorizontal: theme.spacing("sm"),
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes.largeTitle,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.textPrimary,
              }}
            >
              {count}
            </Text>
            <Text style={{ fontSize: theme.typography.sizes.caption, color: theme.colors.textSecondary }}>
              {countLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
