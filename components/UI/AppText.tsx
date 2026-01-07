import React from "react";
import { Text, TextProps } from "react-native";
import { theme } from "../../styles/theme";

// Tilladte tekst-varianter (matcher typography i theme.ts)
type Variant = keyof typeof theme.typography;

type AppTextProps = TextProps & {
  variant?: Variant; // fx "h1", "h2", "p"
};

export function AppText({
  variant = "p", // default er paragraph
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        theme.typography[variant],           // fontSize, lineHeight, weight
        { color: theme.colors.textPrimary }, // standard tekstfarve
        style,                               // evt. ekstra style (fx margin)
      ]}
    />
  );
}
