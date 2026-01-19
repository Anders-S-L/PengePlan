import { useEffect, useState } from "react";
import { Modal, View, ScrollView } from "react-native";
import { AppText } from "../components/UI/AppText";
import { Button } from "../components/UI/Button";
import { Card } from "../components/UI/Card";
import { Input } from "../components/UI/Input";

export function ResetBudgetModal({
    visible,
    onClose,
    onResetAll,
    onResetFixed,
    onResetVariable,
    budget,
    onSaveFixed,
}) {
    const [fixedIncomeDraft, setFixedIncomeDraft] = useState([]);
    const [fixedExpensesDraft, setFixedExpensesDraft] = useState([]);

    useEffect(() => {
        if (!visible) return;
        setFixedIncomeDraft(
            (budget?.fixedIncome ?? []).map((entry) => ({
                ...entry,
                amount: entry?.amount?.toString?.() ?? "",
            }))
        );
        setFixedExpensesDraft(
            (budget?.fixedExpenses ?? []).map((entry) => ({
                ...entry,
                amount: entry?.amount?.toString?.() ?? "",
            }))
        );
    }, [visible, budget]);

    function toNumber(value) {
        if (value === null || value === undefined) return 0;
        const normalized = String(value).replace(/\./g, "").replace(",", ".").trim();
        const numberValue = Number(normalized);
        return Number.isFinite(numberValue) ? numberValue : 0;
    }

    function updateFixedIncome(index, field, value) {
        setFixedIncomeDraft((current) =>
            current.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
        );
    }

    function updateFixedExpense(index, field, value) {
        setFixedExpensesDraft((current) =>
            current.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
        );
    }

    async function handleSaveFixed() {
        const nextFixedIncome = fixedIncomeDraft.map((entry) => ({
            ...entry,
            amount: toNumber(entry.amount),
        }));
        const nextFixedExpenses = fixedExpensesDraft.map((entry) => ({
            ...entry,
            amount: toNumber(entry.amount),
        }));
        await onSaveFixed?.({
            fixedIncome: nextFixedIncome,
            fixedExpenses: nextFixedExpenses,
        });
        onClose();
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.3)" }}>
                <Card>
                    <AppText variant="h4">Nulstil budget</AppText>
                    <AppText variant="p">Vælg hvilke dele der skal nulstilles.</AppText>

                    <View style={{ gap: 12, marginTop: 16 }}>
                        <Button title="Nulstil alt" onPress={onResetAll} />
                        <Button title="Nulstil faste poster" onPress={onResetFixed} />
                        <Button title="Nulstil variable poster" onPress={onResetVariable} />
                    </View>

                    <AppText variant="h4" style={{ marginTop: 20 }}>
                        Rediger faste poster
                    </AppText>
                    <ScrollView style={{ maxHeight: 260 }} contentContainerStyle={{ gap: 12, paddingVertical: 8 }}>
                        <View>
                            <AppText style={{ fontWeight: "600" }}>Faste indtægter</AppText>
                            {fixedIncomeDraft.length === 0 && (
                                <AppText>Ingen faste indtægter endnu.</AppText>
                            )}
                            {fixedIncomeDraft.map((entry, index) => (
                                <View key={`income-${index}`} style={{ gap: 8, marginTop: 8 }}>
                                    <Input
                                        label="Navn"
                                        value={entry.name ?? ""}
                                        onChangeText={(value) => updateFixedIncome(index, "name", value)}
                                    />
                                    <Input
                                        label="Beløb"
                                        value={entry.amount ?? ""}
                                        onChangeText={(value) => updateFixedIncome(index, "amount", value)}
                                        keyboardType="numeric"
                                    />
                                </View>
                            ))}
                        </View>

                        <View>
                            <AppText style={{ fontWeight: "600" }}>Faste udgifter</AppText>
                            {fixedExpensesDraft.length === 0 && (
                                <AppText>Ingen faste udgifter endnu.</AppText>
                            )}
                            {fixedExpensesDraft.map((entry, index) => (
                                <View key={`expense-${index}`} style={{ gap: 8, marginTop: 8 }}>
                                    <Input
                                        label="Navn"
                                        value={entry.name ?? ""}
                                        onChangeText={(value) => updateFixedExpense(index, "name", value)}
                                    />
                                    <Input
                                        label="Beløb"
                                        value={entry.amount ?? ""}
                                        onChangeText={(value) => updateFixedExpense(index, "amount", value)}
                                        keyboardType="numeric"
                                    />
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={{ marginTop: 16, gap: 10 }}>
                        <Button title="Gem faste ændringer" onPress={handleSaveFixed} />
                        <Button title="Luk" onPress={onClose} />
                    </View>
                </Card>
            </View>
        </Modal>
    );
}