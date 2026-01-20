import React from "react";
import { StyleSheet, TextInput, View, TextInputProps } from "react-native";
import { theme } from "../../styles/theme";
import { AppText } from "./AppText";

type InputState = "default" | "focus" | "error";

type InputProps = TextInputProps & {
  label?: string;
  state?: InputState;
};

export function Input({
  label,
  state = "default",
  style,
  ...props
}: InputProps) {
  const borderColor =
    state === "error"
      ? theme.colors.borderError
      : state === "focus"
      ? theme.colors.borderFocus
      : theme.colors.border;

  return (
    <View style={styles.wrapper}>
      {label && (
        <AppText variant="p" style={styles.label}>
          {label}
        </AppText>
      )}

      <TextInput
        {...props}                 // ⭐ MEGET VIGTIG
        style={[
          styles.input,
          { borderColor },
          style,
        ]}
        placeholderTextColor={theme.colors.textDisabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.xs,
  },
  label: {
    color: theme.colors.textSecondary,
  },
  input: {
    height: 44,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
});
