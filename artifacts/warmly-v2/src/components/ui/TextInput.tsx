import React, { forwardRef } from "react";
import { StyleSheet, TextInput as RNTextInput, TextInputProps } from "react-native";
import { mapFontWeight, resolveTypeface, TypefaceKind } from "../../theme/tokens/typography";

type Props = TextInputProps & {
  face?: TypefaceKind;
};

/**
 * Поле ввода в той же гарнитуре, что и текст: Nunito по умолчанию,
 * Literata для заметок дневника.
 */
export const TextInput = forwardRef<RNTextInput, Props>(function TextInput(
  { style, face = "ui", ...rest },
  ref,
) {
  const flat = StyleSheet.flatten(style);
  const italic = flat?.fontStyle === "italic";
  const weight = mapFontWeight(flat?.fontWeight);
  return (
    <RNTextInput
      ref={ref}
      {...rest}
      style={[style, { fontFamily: resolveTypeface(face, weight, italic), fontWeight: "400", fontStyle: "normal" }]}
    />
  );
});
