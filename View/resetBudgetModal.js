import { useEffect, useState } from "react";
import { Modal, View, ScrollView, Pressable, StyleSheet } from "react-native";
import { AppText } from "../components/UI/AppText";
import { Card } from "../components/UI/Card";
import { Input } from "../components/UI/Input";
import { theme } from "../styles/theme";

export function ResetBudgetModal({
    visible,
    onClose,
    onResetAll,
    budget,
    onSaveFixed,
}) {
    const [fixedIncomeDraft, setFixedIncomeDraft] = useState([]);
    const [fixedExpensesDraft, setFixedExpensesDraft] = useState([]);
    const [editingIncomeIndex, setEditingIncomeIndex] = useState(null);
    const [editingExpenseIndex, setEditingExpenseIndex] = useState(null);

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

        setEditingIncomeIndex(null);
        setEditingExpenseIndex(null);
    }, [visible, budget]);

    function toNumber(value) {
        if (value === null || value === undefined) return 0;
        const normalized = String(value).replace(/\./g, "").replace(",", ".").trim();
        const numberValue = Number(normalized);
        return Number.isFinite(numberValue) ? numberValue : 0;
    }

    function formatAmount(value) {
        const amount = toNumber(value);
        return `${amount.toLocaleString("da-DK")} kr.`;
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

    function addFixedIncome() {
        setFixedIncomeDraft((current) => {
            const next = [...current, { name: "", amount: "" }];
            setEditingIncomeIndex(next.length - 1);
            return next;
        });
    }

    function addFixedExpense() {
        setFixedExpensesDraft((current) => {
            const next = [...current, { name: "", amount: "" }];
            setEditingExpenseIndex(next.length - 1);
            return next;
        });
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

        onClose?.();
    }
    function deleteFixedIncome(index) {
        setFixedIncomeDraft((current) =>
            current.filter((_, i) => i !== index)
        );
        setEditingIncomeIndex(null);
    }

    function deleteFixedExpense(index) {
        setFixedExpensesDraft((current) =>
            current.filter((_, i) => i !== index)
        );
        setEditingExpenseIndex(null);
    }


    function toggleIncomeEdit(index) {
        setEditingIncomeIndex((prev) => (prev === index ? null : index));
    }

    function toggleExpenseEdit(index) {
        setEditingExpenseIndex((prev) => (prev === index ? null : index));
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <Card style={styles.sheet}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <AppText variant="h4" style={styles.title}>
                                Redigér budget
                            </AppText>
                            <AppText variant="p" style={styles.subtitle}>
                                Administrér dine faste indtægter og omkostninger
                            </AppText>
                        </View>

                        <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Luk">
                            <AppText style={styles.closeIcon}>×</AppText>
                        </Pressable>
                    </View>

                    {/* Content */}
                    <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                        {/* Faste indtægter */}
                        <View style={styles.section}>
                            <AppText style={styles.sectionTitle}>Faste indtægter</AppText>

                            {(fixedIncomeDraft ?? []).map((entry, index) => {
                                const isEditing = editingIncomeIndex === index;

                                return (
                                    <View key={`income-${index}`} style={styles.rowWrap}>
                                        <View style={styles.rowCard}>


                                            <View style={styles.rowText}>
                                                <AppText style={styles.rowTitle}>
                                                    {entry.name?.trim() || "Ny indtægt"}
                                                </AppText>
                                                <AppText style={styles.rowMeta}>Fast indtægt</AppText>
                                            </View>

                                            <View style={styles.rightArea}>
                                                <AppText style={styles.amount}>{formatAmount(entry.amount)}</AppText>

                                                <View style={styles.iconRow}>
                                                    <Pressable
                                                        onPress={() => toggleIncomeEdit(index)}
                                                        style={styles.editBtn}
                                                        accessibilityLabel="Rediger indtægt"
                                                    >
                                                        <AppText style={styles.editIcon}>✏️</AppText>
                                                    </Pressable>

                                                    <Pressable
                                                        onPress={() => deleteFixedIncome(index)}
                                                        style={styles.deleteBtn}
                                                        accessibilityLabel="Slet indtægt"
                                                    >
                                                        <AppText style={styles.deleteIcon}>🗑</AppText>
                                                    </Pressable>
                                                </View>
                                            </View>

                                        </View>

                                        {isEditing && (
                                            <View style={styles.editor}>
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
                                        )}
                                    </View>
                                );
                            })}

                            <Pressable onPress={addFixedIncome} style={styles.addPill} accessibilityLabel="Tilføj indtægt">
                                <AppText style={styles.addPillText}>＋ Tilføj indtægt</AppText>
                            </Pressable>
                        </View>

                        {/* Faste omkostninger */}
                        <View style={styles.section}>
                            <AppText style={styles.sectionTitle}>Faste omkostninger</AppText>

                            {(fixedExpensesDraft ?? []).map((entry, index) => {
                                const isEditing = editingExpenseIndex === index;

                                return (
                                    <View key={`expense-${index}`} style={styles.rowWrap}>
                                        <View style={styles.rowCard}>

                                            <View style={styles.rowText}>
                                                <AppText style={styles.rowTitle}>
                                                    {entry.name?.trim() || "Ny omkostning"}
                                                </AppText>
                                                <AppText style={styles.rowMeta}>Fast omkostning</AppText>
                                            </View>

                                            <View style={styles.rightArea}>
                                                <AppText style={styles.amount}>{formatAmount(entry.amount)}</AppText>

                                                <View style={styles.iconRow}>
                                                    <Pressable
                                                        onPress={() => toggleExpenseEdit(index)}
                                                        style={styles.editBtn}
                                                        accessibilityLabel="Rediger omkostning"
                                                    >
                                                        <AppText style={styles.editIcon}>✏️</AppText>
                                                    </Pressable>

                                                    <Pressable
                                                        onPress={() => deleteFixedExpense(index)}
                                                        style={styles.deleteBtn}
                                                        accessibilityLabel="Slet omkostning"
                                                    >
                                                        <AppText style={styles.deleteIcon}>🗑</AppText>
                                                    </Pressable>
                                                </View>
                                            </View>

                                        </View>

                                        {isEditing && (
                                            <View style={styles.editor}>
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
                                        )}
                                    </View>
                                );
                            })}

                            <Pressable onPress={addFixedExpense} style={styles.addPill} accessibilityLabel="Tilføj udgift">
                                <AppText style={styles.addPillText}>＋ Tilføj udgift</AppText>
                            </Pressable>
                        </View>

                        {/* Reset */}
                        <Pressable onPress={onResetAll} style={styles.resetPill} accessibilityLabel="Nulstil budget">
                            <AppText style={styles.resetText}>Nulstil budget</AppText>
                        </Pressable>

                        {/* Divider */}
                        <View style={styles.divider} />
                    </ScrollView>

                    {/* Bottom actions */}
                    <View style={styles.bottomActions}>
                        <Pressable onPress={onClose} style={styles.cancelPill} accessibilityLabel="Annuller">
                            <AppText style={styles.cancelText}>Annuller</AppText>
                        </Pressable>

                        <Pressable onPress={handleSaveFixed} style={styles.savePill} accessibilityLabel="Gem ændringer">
                            <AppText style={styles.saveText}>Gem ændringer</AppText>
                        </Pressable>
                    </View>
                </Card>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        padding: theme.spacing.lg,
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    // Big rounded modal like the mock
    sheet: {
        backgroundColor: "#EAF2FF",
        borderRadius: 24,
        padding: 18,
        gap: 14,
    },

    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    title: {
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },
    subtitle: {
        marginTop: 6,
        color: theme.colors.textSecondary,
    },
    closeBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
    },
    closeIcon: {
        fontSize: 26,
        lineHeight: 26,
        color: theme.colors.textSecondary,
    },

    content: {
        maxHeight: 520,
    },
    contentContainer: {
        paddingBottom: 10,
        gap: 18,
    },

    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },

    rowWrap: {
        gap: 10,
    },
    rowCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E4EAF5",
        paddingVertical: 14,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    leftIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F2F4F8",
        alignItems: "center",
        justifyContent: "center",
    },
    leftIconText: {
        fontSize: 24,
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },
    rowText: {
        flex: 1,
        gap: 4,
    },
    rowTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },
    rowMeta: {
        color: theme.colors.textSecondary,
    },
    rightArea: {
        alignItems: "flex-end",
        gap: 10,
    },
    amount: {
        fontSize: 18,
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },
    editBtn: {
        width: 45,
        height: 45,
        borderColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    editIcon: {
        color: theme.colors.primary,
        fontSize: 18,
    },

    editor: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E4EAF5",
        padding: 12,
        gap: 10,
    },

    addPill: {
        alignSelf: "center",
        paddingVertical: 14,
        paddingHorizontal: 22,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#D6DEEE",
        backgroundColor: "#FFFFFF",
        marginTop: 6,
    },
    addPillText: {
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },

    resetPill: {
        marginTop: 6,
        borderRadius: 999,
        paddingVertical: 18,
        alignItems: "center",
        backgroundColor: "#E23B3B",
    },
    resetText: {
        color: "#FFFFFF",
        fontWeight: "900",
        fontSize: 18,
    },

    divider: {
        height: 1,
        backgroundColor: "#D7DFEF",
        marginTop: 6,
    },

    bottomActions: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
    },
    cancelPill: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#D6DEEE",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
    },
    cancelText: {
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },
    savePill: {
        flex: 1.2,
        paddingVertical: 14,
        borderRadius: 999,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
    },
    saveText: {
        fontWeight: "900",
        color: theme.colors.textOnPrimary,
    },
    iconRow: {
        flexDirection: "row",
        gap: 8,
    },

    deleteBtn: {
        width: 38,
        height: 38,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },

    deleteIcon: {
        fontSize: 16,
        color: "#DC2626",
    },

});
