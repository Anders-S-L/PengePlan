// View/screens/BudgetScreen.js
import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { useBudgetViewModel } from "../../ViewModel/Budget/useBudgetViewModel";
// UI bygges via design-system komponenter og theme tokens
import { AppText } from "../../components/UI/AppText";
import { Button } from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";
import { Input } from "../../components/UI/Input";
import { TotalsView } from "../TotalsView";


export function BudgetScreen() {
    const vm = useBudgetViewModel();
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");

    if (vm.isLoading) return <AppText>Indlæser...</AppText>;
    if (!vm.budget) return <AppText>Ingen budget endnu</AppText>;

    const items = [
        { name: "Indtægter", value: vm.totals.income },
        { name: "Udgifter", value: -vm.totals.expenses },
        { name: "Rådighedsbeløb", value: vm.disposable },
    ];

    async function addFixedIncome() {
        if (!name || !amount) return;
        await vm.addFixedIncome({ name, amount: parseFloat(amount) });
        setName("");
        setAmount("");
    }

    async function addFixedExpense() {
        if (!name || !amount) return;
        await vm.addFixedExpense({ name, amount: parseFloat(amount) });
        setName("");
        setAmount("");
    }

    return (
        <View style={{ padding: 16 }}>
            <AppText style={{ fontSize: 24, fontWeight: "700", marginBottom: 30, marginTop: 50 }}>
                Velkommen til PengePlan!
            </AppText>
            <Card>
                <TotalsView totals={items} />
            </Card>
            <Card>
                <AppText style={{ marginTop: 20 }}>Navn</AppText>
                <Input
                    value={name}
                    onChangeText={setName}
                    placeholder="Løn / Husleje"
                    style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginTop: 15 }}
                />

                <AppText style={{ marginTop: 12 }}>Beløb</AppText>
                <Input
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="fx 12000"
                    keyboardType="numeric"
                    style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginTop: 6 }}
                />
            </Card>
            <Button title="Tilføj indtægt" onPress={addFixedIncome} />
            <Button title="Tilføj udgift" onPress={addFixedExpense} />
        </View>
    );
}

