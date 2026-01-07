// View/screens/BudgetScreen.js
import React from "react";
import { View, Text } from "react-native";

import { useBudgetViewModel } from "../../ViewModel/Budget/useBudgetViewModel";
import { TotalsView } from "../TotalsView";

export function BudgetScreen() {
    const vm = useBudgetViewModel();

    if (vm.isLoading) return <Text>Indlæser...</Text>;
    if (!vm.budget) return <Text>Ingen budget endnu</Text>;

    const items = [
        { name: "Indtægter", value: vm.totals.income },
        { name: "Udgifter", value: -vm.totals.expenses },
        { name: "Rådighedsbeløb", value: vm.disposable },
    ];

    return (
        <View style={{ padding: 16, marginTop: 50 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", alignContent: "center" }}>
                Velkommen til PengePlan
            </Text>

            <View style={{ marginTop: 16 }}>
                <TotalsView totals={items} />
            </View>
        </View>
    );
}
