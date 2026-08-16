import React from "react";
import { PressableProps, StyleProp, Text, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "../animation";
import { useTheme } from "../../theme";

interface ButtonProps extends Omit<PressableProps, "style"> {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

/**
 * Единственная кнопка в приложении.
 */
export function Button({
  label,
  variant = "primary",
  disabled,
  icon,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === "primary";
  const labelColor = isPrimary ? theme.colors.surface : theme.colors.accent;

  return (
    <PressableScale
      disabled={disabled}
      style={[
        {
          borderWidth: 1,
          borderColor: theme.colors.accent,
          borderRadius: theme.radius.lg,
          paddingVertical: theme.spacing("md"),
          paddingHorizontal: theme.spacing("lg"),
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          backgroundColor: isPrimary ? theme.colors.accent : "transparent",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {icon ? <Ionicons name={icon} size={18} color={labelColor} /> : null}
      <Text
        style={{
          fontSize: theme.typography.sizes.body,
          fontWeight: theme.typography.weights.semibold,
          color: labelColor,
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        {label}
      </Text>
    </PressableScale>
  );
}
