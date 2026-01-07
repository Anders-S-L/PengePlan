// View/screens/BudgetScreen.js
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useBudgetViewModel } from "../../ViewModel/Budget/useBudgetViewModel";
// UI bygges via design-system komponenter og theme tokens
import { AppText } from "../../components/UI/AppText";
import { Button } from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";
import { Input } from "../../components/UI/Input";
import { theme } from "../../styles/theme";
import { TotalsView } from "../TotalsView";

export function BudgetScreen() {
    const vm = useBudgetViewModel();
    const [incomeName, setIncomeName] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");

    if (vm.isLoading) return <AppText>Indlæser...</AppText>;
    if (!vm.budget) return <AppText>Ingen budget endnu</AppText>;

    const items = [
        { name: "Indtægter", value: vm.totals.income },
        { name: "Udgifter", value: -vm.totals.expenses },
        { name: "Rådighedsbeløb", value: vm.disposable },
    ];

    const handleAddIncome = async () => {
        const name = incomeName.trim();
        const amount = Number(incomeAmount.replace(",", "."));
        if (!name || !Number.isFinite(amount)) return;

        await vm.addFixedIncome({ name, amount });
        setIncomeName("");
        setIncomeAmount("");
    };

    const handleAddExpense = async () => {
        const name = expenseName.trim();
        const amount = Number(expenseAmount.replace(",", "."));
        if (!name || !Number.isFinite(amount)) return;

        await vm.addFixedExpense({ name, amount });
        setExpenseName("");
        setExpenseAmount("");
    };

    return (
        <View style={styles.container}>
            <AppText variant="h3" style={styles.title}>
                Velkommen til PengePlan
            </AppText>

            <View style={styles.section}>
                <TotalsView totals={items} />
            

            <Card style={styles.section}>
                <AppText variant="h4" style={styles.cardTitle}>
                    Tilføj fast indtægt
                </AppText>
                <Input
                    label="Navn"
                    placeholder="Fx Løn"
                    value={incomeName}
                    onChangeText={setIncomeName}
                />
                <Input
                    label="Beløb"
                    placeholder="Fx 20000"
                    value={incomeAmount}
                    onChangeText={setIncomeAmount}
                />
                <View style={styles.buttonRow}>
                    <Button title="Tilføj indtægt" onPress={handleAddIncome} />
                </View>
            </Card>

            <Card style={styles.section}>
                <AppText variant="h4" style={styles.cardTitle}>
                    Tilføj fast udgift
                </AppText>
                <Input
                    label="Navn"
                    placeholder="Fx Husleje"
                    value={expenseName}
                    onChangeText={setExpenseName}
                />
                <Input
                    label="Beløb"
                    placeholder="Fx 8500"
                    value={expenseAmount}
                    onChangeText={setExpenseAmount}
                />
                <View style={styles.buttonRow}>
                    <Button title="Tilføj udgift" onPress={handleAddExpense} />
                </View>
            </Card>
        </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.hero,
        backgroundColor: theme.colors.background,
    },
    title: {
        color: theme.colors.textPrimary,
        textAlign: "center",
    },
    section: {
        marginTop: theme.spacing.lg,
    },
    cardTitle: {
        marginBottom: theme.spacing.sm,
    },
    buttonRow: {
        marginTop: theme.spacing.md,
        alignItems: "flex-start",
    },
});
