// View/TotalsView.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../styles/theme";

type TotalItem = {
    name: string;
    value: number;
};

type Props = {
    totals: TotalItem[];
};

export function TotalsView({ totals }: Props) {
    return (
        <View style={styles.card}>
            {totals.map((item, index) => {
                const isPositive = item.value > 0;
                const isNegative = item.value < 0;

                return (
                    <View
                        key={item.name}
                        style={[
                            styles.row,
                            index !== totals.length - 1 && styles.divider,
                        ]}
                    >
                        <Text style={styles.label}>{item.name}</Text>

                        <Text
                            style={[
                                styles.value,
                                isPositive && styles.positive,
                                isNegative && styles.negative,
                            ]}
                        >
                            {item.value > 0 ? "+" : ""}
                            {item.value.toLocaleString("da-DK")} kr.
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: radius.md,
        padding: spacing.md,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.sm,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    label: {
        fontSize: 15,
        color: colors.textSecondary,
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    positive: {
        color: colors.positive,
    },
    negative: {
        color: colors.negative,
    },
});
