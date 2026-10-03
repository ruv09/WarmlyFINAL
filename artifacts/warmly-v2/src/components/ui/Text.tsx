import React from "react";
import { StyleSheet, Text as RNText, TextProps } from "react-native";
import { mapFontWeight, resolveTypeface, TypefaceKind } from "../../theme/tokens/typography";

type Props = TextProps & {
  /** ui — Nunito, serif — Literata (цитаты, записи, дощечка). */
  face?: TypefaceKind;
};

/**
 * Текст Warmly: сам подставляет файл шрифта по fontWeight / italic,
 * чтобы Android не синтезировал жирность поверх Nunito_400.
 */
export function Text({ style, face = "ui", ...rest }: Props) {
  const flat = StyleSheet.flatten(style);
  const italic = flat?.fontStyle === "italic";
  const weight = mapFontWeight(flat?.fontWeight);
  return (
    <RNText
      {...rest}
      style={[style, { fontFamily: resolveTypeface(face, weight, italic), fontWeight: "400", fontStyle: "normal" }]}
    />
  );
}
