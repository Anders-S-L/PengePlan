import { useEffect, useState } from "react";
import { Modal, View, ScrollView, Pressable, StyleSheet } from "react-native";
import { AppText } from "../components/UI/AppText";
import { Button } from "../components/UI/Button";
import { Card } from "../components/UI/Card";
import { Input } from "../components/UI/Input";
import { theme } from "../styles/theme";

export function ResetBudgetModal({
    visible,
    onClose,
    onResetAll,
    //onResetFixed,
    //onResetVariable,
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
        onClose();
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <Card style={styles.card}>
                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <AppText variant="h4">Redigér budget</AppText>
                            <AppText variant="p" style={styles.subtitle}>
                                Opdatér dine faste indtægter og omkostninger
                            </AppText>
                        </View>
                        <Pressable onPress={onClose} style={styles.closeButton} accessibilityLabel="Luk">
                            <AppText style={styles.closeText}>×</AppText>
                        </Pressable>
                    </View>

                    <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <AppText style={styles.sectionTitle}>Faste indtægter</AppText>
                                <Pressable onPress={addFixedIncome} style={styles.addButton}>
                                    <AppText style={styles.addButtonText}>＋ Tilføj</AppText>
                                </Pressable>
                            </View>
                            {fixedIncomeDraft.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <AppText style={styles.emptyText}>
                                        Ingen faste indtægter tilføjet endnu.
                                        {"\n"}Tryk på "Tilføj" for at tilføje en indtægt.
                                    </AppText>
                                </View>
                            ) : (
                                fixedIncomeDraft.map((entry, index) => {
                                    const isEditing = editingIncomeIndex === index;
                                    return (
                                        <View key={`income-${index}`} style={styles.entry}>
                                            <View style={styles.entryCard}>
                                                <View style={styles.entryIcon}>
                                                    <AppText style={styles.entryIconText}>＋</AppText>
                                                </View>
                                                <View style={styles.entryInfo}>
                                                    <AppText style={styles.entryName}>
                                                        {entry.name?.trim() || "Ny indtægt"}
                                                    </AppText>
                                                    <AppText style={styles.entryMeta}>Fast indtægt</AppText>
                                                </View>
                                                <View style={styles.entryActions}>
                                                    <AppText style={styles.entryAmount}>
                                                        {formatAmount(entry.amount)}
                                                    </AppText>
                                                    <Pressable
                                                        onPress={() =>
                                                            setEditingIncomeIndex(isEditing ? null : index)
                                                        }
                                                        style={styles.entryEditButton}
                                                        accessibilityLabel="Rediger indtægt"
                                                    >
                                                        <AppText style={styles.entryEditIcon}>✎</AppText>
                                                    </Pressable>
                                                </View>
                                            </View>
                                            {isEditing && (
                                                <View style={styles.entryEditor}>
                                                    <Input
                                                        label="Navn"
                                                        value={entry.name ?? ""}
                                                        onChangeText={(value) =>
                                                            updateFixedIncome(index, "name", value)
                                                        }
                                                    />
                                                    <Input
                                                        label="Beløb"
                                                        value={entry.amount ?? ""}
                                                        onChangeText={(value) =>
                                                            updateFixedIncome(index, "amount", value)
                                                        }
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    );
                                })
                            )}
                        </View>


                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <AppText style={styles.sectionTitle}>Faste omkostninger</AppText>
                                <Pressable onPress={addFixedExpense} style={styles.addButton}>
                                    <AppText style={styles.addButtonText}>＋ Tilføj</AppText>
                                </Pressable>
                            </View>
                            {fixedExpensesDraft.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <AppText style={styles.emptyText}>
                                        Ingen faste omkostninger tilføjet endnu.
                                        {"\n"}Tryk på "Tilføj" for at tilføje en omkostning.
                                    </AppText>
                                </View>
                            ) : (
                                fixedExpensesDraft.map((entry, index) => {
                                    const isEditing = editingExpenseIndex === index;
                                    return (
                                        <View key={`expense-${index}`} style={styles.entry}>
                                            <View style={styles.entryCard}>
                                                <View style={styles.entryIcon}>
                                                    <AppText style={styles.entryIconText}>－</AppText>
                                                </View>
                                                <View style={styles.entryInfo}>
                                                    <AppText style={styles.entryName}>
                                                        {entry.name?.trim() || "Ny omkostning"}
                                                    </AppText>
                                                    <AppText style={styles.entryMeta}>Fast omkostning</AppText>
                                                </View>
                                                <View style={styles.entryActions}>
                                                    <AppText style={styles.entryAmount}>
                                                        {formatAmount(entry.amount)}
                                                    </AppText>
                                                    <Pressable
                                                        onPress={() =>
                                                            setEditingExpenseIndex(isEditing ? null : index)
                                                        }
                                                        style={styles.entryEditButton}
                                                        accessibilityLabel="Rediger omkostning"
                                                    >
                                                        <AppText style={styles.entryEditIcon}>✎</AppText>
                                                    </Pressable>
                                                </View>
                                            </View>
                                            {isEditing && (
                                                <View style={styles.entryEditor}>
                                                    <Input
                                                        label="Navn"
                                                        value={entry.name ?? ""}
                                                        onChangeText={(value) =>
                                                            updateFixedExpense(index, "name", value)
                                                        }
                                                    />
                                                    <Input
                                                        label="Beløb"
                                                        value={entry.amount ?? ""}
                                                        onChangeText={(value) =>
                                                            updateFixedExpense(index, "amount", value)
                                                        }
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    );
                                })
                            )}
                        </View>
                    </ScrollView>

                    <Pressable style={styles.resetButton} onPress={onResetAll}>
                        <AppText style={styles.resetButtonText}>Nulstil budget</AppText>
                    </Pressable>

                    <View style={styles.actions}>
                        <Pressable style={styles.cancelButton} onPress={onClose}>
                            <AppText style={styles.cancelText}>Annuller</AppText>
                        </Pressable>
                        <Pressable style={styles.saveButton} onPress={handleSaveFixed}>
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
    card: {
        gap: theme.spacing.md,
    },
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: theme.spacing.md,
    },
    headerText: {
        flex: 1,
        gap: theme.spacing.xs,
    },
    subtitle: {
        color: theme.colors.textSecondary,
    },
    closeButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.pill,
    },
    closeText: {
        fontSize: 22,
        color: theme.colors.textSecondary,
        lineHeight: 22,
    },
    content: {
        maxHeight: 360,
    },
    contentContainer: {
        gap: theme.spacing.xl,
        paddingBottom: theme.spacing.sm,
    },
    section: {
        gap: theme.spacing.md,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.typography.h4.fontSize,
        fontWeight: "700",
        color: theme.colors.textPrimary,
    },
    addButton: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    addButtonText: {
        fontWeight: "600",
        color: theme.colors.textPrimary,
    },
    emptyState: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.labelBg,
    },
    emptyText: {
        textAlign: "center",
        color: theme.colors.textSecondary,
    },
    entry: {
        gap: theme.spacing.sm,
    },
    entryCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    entryIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.labelBg,
    },
    entryIconText: {
        fontSize: 20,
        fontWeight: "700",
        color: theme.colors.textPrimary,
    },
    entryInfo: {
        flex: 1,
        gap: theme.spacing.xs,
    },
    entryName: {
        fontSize: theme.typography.h4.fontSize,
        fontWeight: "600",
        color: theme.colors.textPrimary,
    },
    entryMeta: {
        fontSize: theme.typography.p.fontSize,
        color: theme.colors.textSecondary,
    },
    entryActions: {
        alignItems: "flex-end",
        gap: theme.spacing.sm,
    },
    entryAmount: {
        fontSize: theme.typography.h4.fontSize,
        fontWeight: "700",
        color: theme.colors.textPrimary,
    },
    entryEditButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.background,
    },
    entryEditIcon: {
        color: theme.colors.primary,
        fontSize: 16,
    },
    entryEditor: {
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
    },
    resetButton: {
        marginTop: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.danger,
        borderRadius: theme.radius.md,
        paddingVertical: theme.spacing.md,
        alignItems: "center",
    },
    resetButtonText: {
        color: theme.colors.danger,
        fontWeight: "700",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    cancelButton: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    cancelText: {
        fontWeight: "600",
        color: theme.colors.textPrimary,
    },
    saveButton: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.radius.pill,
        backgroundColor: theme.colors.primary,
    },
    saveText: {
        color: theme.colors.textOnPrimary,
        fontWeight: "700",
    },
});