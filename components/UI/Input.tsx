import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { theme } from "../../styles/theme";
import { AppText } from "./AppText";

type InputState = "default" | "focus" | "error";

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: string;
  state?: InputState;
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  state = "default",
}: InputProps) {
  // Border-farve afhænger af input state
  const borderColor =
    state === "error"
      ? theme.colors.borderError
      : state === "focus"
        ? theme.colors.borderFocus
        : theme.colors.border;

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      <AppText variant="p" style={styles.label}>
        {label}
      </AppText>

      {/* Input felt */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textDisabled}
        style={[
          styles.input,
          { borderColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.xs,                     // afstand mellem label og input
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
  },
});
