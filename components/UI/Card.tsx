import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { theme } from "../../styles/theme";

type CardProps = ViewProps & {
  padded?: boolean;
  children?: React.ReactNode;
};

export function Card({ padded = true, style, children, ...props }: CardProps) {
  return (
    <View {...props} style={[styles.card, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
  },
  padded: {
    padding: theme.spacing.lg,
  },
});
