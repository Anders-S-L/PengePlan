// View/TotalsView.tsx
import React from "react";
import { StyleSheet, View } from "react-native";

// Design-system komponenter og tokens
import { AppText } from "../components/UI/AppText";
import { Card } from "../components/UI/Card";
import { theme } from "../styles/theme";

type TotalItem = {
    name: string;
    value: number;
};

type Props = {
    totals: TotalItem[];
};

export function TotalsView({ totals }: Props) {
    return (
        <Card style={styles.card}>
            {totals.map((item, index) => {
                const normalizedValue = Object.is(item.value, -0) ? 0 : item.value;
                const isPositive = normalizedValue > 0;
                const isNegative = normalizedValue < 0;
                const isTotal = item.name === "Total brugt";

                return (
                    <View
                        key={item.name}
                        style={[styles.row, isTotal && styles.totalDivider]}
                    >
                        <AppText style={styles.label}>{item.name}</AppText>

                        <AppText
                            style={[
                                styles.value,
                                isPositive && styles.positive,
                                isNegative && styles.negative,
                            ]}
                        >
                            {isPositive ? "+" : ""}
                            {normalizedValue.toLocaleString("da-DK")} kr.
                        </AppText>
                    </View>
                );
            })}
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 0,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: theme.spacing.sm,
    },
    totalDivider: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.primary,
    },
    label: {
        color: theme.colors.textSecondary,
    },
    value: {
        fontWeight: "600",
        color: theme.colors.textPrimary,
    },
    positive: {
        color: theme.colors.success,
    },
    negative: {
        color: theme.colors.danger,
    },
});
