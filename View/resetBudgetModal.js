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
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
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

                        <Pressable
                            onPress={onClose}
                            hitSlop={12}
                            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
                            accessibilityLabel="Luk"
                        >
                            <AppText style={styles.closeIcon}>✕</AppText>
                        </Pressable>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
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
                                                        style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
                                                        accessibilityLabel="Rediger indtægt"
                                                    >
                                                        <AppText style={styles.iconBtnText}>✎</AppText>
                                                    </Pressable>

                                                    <Pressable
                                                        onPress={() => deleteFixedIncome(index)}
                                                        style={({ pressed }) => [
                                                            styles.iconBtn,
                                                            styles.iconBtnDanger,
                                                            pressed && styles.iconBtnPressed,
                                                        ]}
                                                        accessibilityLabel="Slet indtægt"
                                                    >
                                                        <AppText style={[styles.iconBtnText, styles.iconBtnDangerText]}>🗑</AppText>
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

                            <Pressable
                                onPress={addFixedIncome}
                                style={({ pressed }) => [styles.addPill, pressed && styles.addPillPressed]}
                                accessibilityLabel="Tilføj indtægt"
                            >
                                <AppText style={styles.addPillText}>＋ Tilføj indtægt</AppText>
                            </Pressable>
                            <View style={styles.divider} />
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
                                                        style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
                                                        accessibilityLabel="Rediger omkostning"
                                                    >
                                                        <AppText style={styles.iconBtnText}>✎</AppText>
                                                    </Pressable>

                                                    <Pressable
                                                        onPress={() => deleteFixedExpense(index)}
                                                        style={({ pressed }) => [
                                                            styles.iconBtn,
                                                            styles.iconBtnDanger,
                                                            pressed && styles.iconBtnPressed,
                                                        ]}
                                                        accessibilityLabel="Slet omkostning"
                                                    >
                                                        <AppText style={[styles.iconBtnText, styles.iconBtnDangerText]}>🗑</AppText>
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

                            <Pressable
                                onPress={addFixedExpense}
                                style={({ pressed }) => [styles.addPill, pressed && styles.addPillPressed]}
                                accessibilityLabel="Tilføj udgift"
                            >
                                <AppText style={styles.addPillText}>＋ Tilføj udgift</AppText>
                            </Pressable>
                            <View style={styles.divider} />
                        </View>

                        {/* Reset */}
                        <Pressable
                            onPress={onResetAll}
                            style={({ pressed }) => [styles.resetPill, pressed && styles.resetPillPressed]}
                            accessibilityLabel="Nulstil budget"
                        >
                            <AppText style={styles.resetText}>Nulstil budget</AppText>
                        </Pressable>

                        <View style={styles.divider} />
                    </ScrollView>

                    {/* Bottom actions */}
                    <View style={styles.bottomActions}>
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.btn,
                                styles.btnSecondary,
                                pressed && styles.btnSecondaryPressed,
                            ]}
                            accessibilityLabel="Annuller"
                        >
                            <AppText style={styles.btnSecondaryText}>Annuller</AppText>
                        </Pressable>

                        <Pressable
                            onPress={handleSaveFixed}
                            style={({ pressed }) => [
                                styles.btn,
                                styles.btnPrimary,
                                pressed && styles.btnPrimaryPressed,
                            ]}
                            accessibilityLabel="Gem ændringer"
                        >
                            <AppText style={styles.btnPrimaryText}>Gem ændringer</AppText>
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
        backgroundColor: "rgba(2, 6, 23, 0.55)",
    },

    sheet: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.xl,
        gap: theme.spacing.md,
        shadowColor: "#0F172A",
        shadowOpacity: 0.14,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 10,
    },

    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: theme.spacing.md,
    },

    title: {
        color: theme.colors.textPrimary,
    },

    subtitle: {
        marginTop: theme.spacing.xs,
        color: theme.colors.textSecondary,
    },

    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.labelBg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    closeBtnPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.98 }],
    },
    closeIcon: {
        fontSize: 16,
        lineHeight: 18,
        fontWeight: "800",
        color: theme.colors.textSecondary,
    },

    content: {
        maxHeight: 520,
    },
    contentContainer: {
        paddingBottom: theme.spacing.sm,
        gap: theme.spacing.xl,
    },

    section: {
        gap: theme.spacing.sm,
    },
    sectionTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },

    rowWrap: {
        gap: theme.spacing.sm,
    },

    rowCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
    },

    rowText: {
        flex: 1,
        gap: theme.spacing.xxs,
    },

    rowTitle: {
        fontSize: 13,
        lineHeight: 20,
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },

    rowMeta: {
        color: theme.colors.textSecondary,
    },

    rightArea: {
        alignItems: "flex-end",
        gap: theme.spacing.sm,
    },

    amount: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: "800",
        color: theme.colors.textPrimary,
    },

    iconRow: {
        flexDirection: "row",
        gap: theme.spacing.xs,
    },

    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primaryDisabled,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    iconBtnPressed: {
        backgroundColor: theme.colors.labelBg,
        transform: [{ scale: 0.98 }],
    },
    iconBtnText: {
        color: theme.colors.primary,
        fontWeight: "900",
        fontSize: 14,
        lineHeight: 16,
    },
    iconBtnDanger: {
        borderColor: theme.colors.primary,
    },
    iconBtnDangerText: {
        color: theme.colors.danger,
    },

    editor: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
    },

    addPill: {
        alignSelf: "center",
        paddingVertical: 12,
        paddingHorizontal: 100,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.primary,
        marginTop: theme.spacing.xs,
    },
    addPillPressed: {
        backgroundColor: theme.colors.primaryPressed,
        transform: [{ scale: 0.99 }],
    },
    addPillText: {
        fontWeight: "800",
        color: theme.colors.textOnPrimary,
    },

    resetPill: {
        marginTop: theme.spacing.xs,
        borderRadius: theme.radius.pill,
        paddingVertical: 14,
        alignItems: "center",
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.danger,
    },
    resetPillPressed: {
        backgroundColor: "#FDEDED",
        opacity: 0.92,
        transform: [{ scale: 0.99 }],

    },
    resetText: {
        color: theme.colors.danger,
        fontWeight: "900",
        fontSize: 15,
        lineHeight: 20,
    },

    divider: {
        height: 1,
        backgroundColor: theme.colors.divider,
        marginTop: theme.spacing.xs,
    },

    bottomActions: {
        flexDirection: "row",
        gap: theme.spacing.sm,
        marginTop: theme.spacing.md,
    },

    btn: {
        flex: 1,
        minHeight: 46,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: theme.radius.pill,
        alignItems: "center",
        justifyContent: "center",
    },

    btnPrimary: {
        backgroundColor: theme.colors.primary,
        shadowColor: "#0F172A",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    btnPrimaryPressed: {
        backgroundColor: theme.colors.primaryPressed,
        transform: [{ scale: 0.99 }],
        opacity: 0.98,
    },
    btnPrimaryText: {
        color: theme.colors.textOnPrimary,
        fontWeight: "900",
    },

    btnSecondary: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    btnSecondaryPressed: {
        backgroundColor: theme.colors.labelBg,
        transform: [{ scale: 0.99 }],
        opacity: 0.98,
    },
    btnSecondaryText: {
        color: theme.colors.textPrimary,
        fontWeight: "900",
    },
});
