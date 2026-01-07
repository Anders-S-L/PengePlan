import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../../styles/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function Button({ title, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled
            ? theme.colors.primaryDisabled     // disabled state
            : pressed
            ? theme.colors.primaryPressed      // pressed / hover
            : theme.colors.primary,            // default
        },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,                               // matcher design
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,          // rund/pill-form
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.textOnPrimary,        // hvid tekst
    fontSize: theme.typography.p.fontSize,
    fontWeight: "700",
  },
});
