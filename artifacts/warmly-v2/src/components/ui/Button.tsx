import React from "react";
import { PressableProps, StyleProp, Text, ViewStyle } from "react-native";
import { PressableScale } from "../animation";
import { useTheme } from "../../theme";

interface ButtonProps extends Omit<PressableProps, "style"> {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Единственная кнопка в приложении — экраны не пишут свой Pressable
 * со своими цветами/отступами. Тактильная обратная связь на нажатие —
 * через PressableScale (soft spring), см. /ANIMATION.md.
 */
export function Button({ label, variant = "primary", disabled, style, ...rest }: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === "primary";

  return (
    <PressableScale
      disabled={disabled}
      style={[
        {
          borderWidth: 1,
          borderColor: theme.colors.accent,
          borderRadius: theme.radius.md,
          paddingVertical: theme.spacing("md") - 2,
          paddingHorizontal: theme.spacing("lg"),
          alignItems: "center",
          backgroundColor: isPrimary ? theme.colors.accent : "transparent",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        style={{
          fontSize: theme.typography.sizes.body,
          fontWeight: theme.typography.weights.semibold,
          color: isPrimary ? theme.colors.surface : theme.colors.accent,
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        {label}
      </Text>
    </PressableScale>
  );
}
