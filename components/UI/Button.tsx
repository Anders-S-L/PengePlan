import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../../styles/theme";


export function Button({ title, onPress, disabled = false }) {
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
    paddingVertical: 12,
    borderRadius: theme.radius.pill,          // rund/pill-form
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  text: {
    color: theme.colors.textOnPrimary,        // hvid tekst
    fontSize: theme.typography.p.fontSize,
    fontWeight: "700",
  },
});
