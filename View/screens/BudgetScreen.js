// View/screens/BudgetScreen.js
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { PrimaryAddButton } from "../PrimaryAddButtons";
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
            <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 30, marginTop: 50 }}>
                Velkommen til PengePlan
            </AppText>

            <TotalsView totals={items} />

            <Text style={{ marginTop: 16 }}>Navn</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Løn / Husleje"
                style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginTop: 15 }}
            />

            <Text style={{ marginTop: 12 }}>Beløb</Text>
            <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="fx 12000"
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginTop: 6 }}
            />

            <PrimaryAddButton title="Tilføj indtægt" onPress={addFixedIncome} />
            <PrimaryAddButton title="Tilføj udgift" onPress={addFixedExpense} />
        </View>
    );
}

