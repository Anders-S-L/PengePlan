// Dette er vores forside skaerm der viser budgetoversigten.

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { useBudgetViewModel } from "../../ViewModel/Budget/useBudgetViewModel";
import { TotalsView } from "../TotalsView";
import { AddVariableExpenseModal } from "../addVariableExpenseModal";
import { Button } from "../../components/UI/Button";

import { HjulUdseende } from "./hjulUdseende";
import { ResetBudgetModal } from "../resetBudgetModal";
import { Card } from "../../components/UI/Card";


export function BudgetOverview({ onResetAll }) {
    // Henter budgetdata fra view modellen
    const vm = useBudgetViewModel();
    const [showModal, setShowModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [activeTab, setActiveTab] = useState("overblik");

    if (vm.isLoading) return <Text>Indlæser...</Text>;
    if (!vm.budget) return <Text>Ingen budget endnu</Text>;


    // UI-liste til maanedsoverblikket
    const items = [
        { name: "Månedlig indkomst", value: vm.totals.income },
        { name: "Faste omkostninger", value: -vm.fixedExpensesTotal },
        { name: "Variable udgifter", value: -vm.variableExpensesTotal },
        { name: "Luksus udgifter", value: -vm.luxuryExpensesTotal },
        { name: "Total brugt", value: -vm.totals.expenses },
        { name: "Rådighedsbeløb", value: vm.disposable },
    ];
    const råd = vm.disposable + " kr.";

    const budgetUsage = vm.budgetUsage ?? { spentPercent: 0, overBudgetPercent: 0, isOverBudget: false };
    const { spentPercent, overBudgetPercent, isOverBudget } = budgetUsage;

    const alertTitle = isOverBudget ? "Budget overskredet" : "Budgetstatus";
    const alertText = isOverBudget
        ? `Du har overskredet dit budget med ${overBudgetPercent}%`
        : `Du har brugt ${spentPercent}% af dit budget`;
    const formatAmount = (value) => {
        const amount = Number(value) || 0;
        return `${amount.toLocaleString("da-DK")} kr.`;
    };
    console.log("budgetUsage", vm.budgetUsage, "totals", vm.totals);

    return (
        <View style={styles.screen}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                {/* Topbar med måned */}
                <View style={styles.topBar}>
                    <Text style={styles.navIcon}>{"<"}</Text>
                    <Text style={styles.monthTitle}>Oktober 2025</Text>
                    <Text style={styles.navIcon}>{">"}</Text>
                </View>

                {/* Rådighedsbeløbet */}
                <View style={styles.balanceSection}>
                    <Text style={styles.label}>Rådighedsbeløb</Text>
                    <View style={styles.balanceRow}>
                        <View style={styles.balanceLeft}>
                            <TouchableOpacity
                                style={styles.editCircle}
                                onPress={() => setShowResetModal(true)}
                                accessibilityRole="button"
                                accessibilityLabel="Rediger budget"
                            >
                                <Text style={styles.editIcon}>✎</Text>
                            </TouchableOpacity>
                            <Text style={styles.balanceAmount}>{råd}</Text>
                        </View>
                        <Text style={styles.calendarIcon}>📅</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabRow}>
                    <TouchableOpacity
                        style={styles.tabItem}
                        onPress={() => setActiveTab("overblik")}
                        accessibilityRole="button"
                        accessibilityLabel="Vis overblik"
                    >
                        <Text style={activeTab === "overblik" ? styles.tabActive : styles.tabInactive}>
                            OVERBLIK
                        </Text>
                        <View
                            style={[
                                styles.tabUnderline,
                                activeTab === "overblik" && styles.tabUnderlineActive,
                            ]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tabItem}
                        onPress={() => setActiveTab("udgifter")}
                        accessibilityRole="button"
                        accessibilityLabel="Vis udgifter"
                    >
                        <Text style={activeTab === "udgifter" ? styles.tabActive : styles.tabInactive}>
                            UDGIFTER
                        </Text>
                        <View
                            style={[
                                styles.tabUnderline,
                                activeTab === "udgifter" && styles.tabUnderlineActive,
                            ]}
                        />
                    </TouchableOpacity>
                </View>

                {activeTab === "overblik" ? (
                    <>
                        {/* Cirkeldiagram OBS: Skal ændres til den rigtige model, det her er bare Billede*/}
                        <View style={styles.circleSection}>
                            <HjulUdseende budget={vm.budget} />
                        </View>

                        {/* Advarsel OBS: Skal ændres til rigtig data når det er lavet. Det her er bare hardcodet Ui*/}
                        <View style={styles.alertBox}>
                            <Text style={styles.alertTitle}>{alertTitle}</Text>
                            <Text style={styles.alertText}>{alertText}</Text>
                        </View>

                        {/* Månedsoversigt */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Månedsoversigt</Text>
                            <View style={styles.listCard}>
                                <TotalsView totals={items} />
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Kategorier</Text>

                        <Card style={styles.expenseListCard}>
                            <ScrollView
                                style={styles.expenseInnerScroll}
                                nestedScrollEnabled
                                showsVerticalScrollIndicator
                            >
                                {vm.sortedExpenseCategories.length === 0 ? (
                                    <Text style={styles.emptyState}>Ingen udgifter endnu.</Text>
                                ) : (
                                    vm.sortedExpenseCategories.map((category) => {
                                        const categoryExpenses = (vm.expensesByCategory?.[category] ?? [])
                                            .slice()
                                            .sort((a, b) => {
                                                const dateDiff = (b.createdAt || 0) - (a.createdAt || 0);
                                                if (dateDiff !== 0) return dateDiff;
                                                return (a.name || "").localeCompare(b.name || "", "da-DK");
                                            });

                                        const categoryTotal = categoryExpenses.reduce(
                                            (sum, expense) => sum + (Number(expense.amount) || 0),
                                            0
                                        );

                                        return (
                                            <View key={category} style={styles.categoryGroup}>
                                                <View style={styles.categoryHeader}>
                                                    <Text style={styles.categoryTitle}>{category}</Text>
                                                    <Text style={styles.categoryTotal}>{formatAmount(categoryTotal)}</Text>
                                                </View>

                                                {categoryExpenses.map((expense, index) => (
                                                    <View
                                                        key={`${category}-${expense.name}-${expense.createdAt ?? index}`}
                                                        style={styles.expenseCard}
                                                    >
                                                        <Text style={styles.expenseName}>{expense.name}</Text>
                                                        <Text style={styles.expenseAmount}>
                                                            {formatAmount(expense.amount)}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        );
                                    })
                                )}
                            </ScrollView>
                        </Card>
                    </View>
                )}
            </ScrollView>

            {/* Primar knap */}
            <View style={styles.footer}>
                <Button title="+  Ny udgift" onPress={() => setShowModal(true)} />
                <AddVariableExpenseModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={vm.addVariableExpense}
                />
                <ResetBudgetModal
                    visible={showResetModal}
                    onClose={() => setShowResetModal(false)}
                    onResetAll={async () => {
                        await vm.resetAllBudget();
                        setShowResetModal(false);
                        onResetAll?.(); // hop til onboarding
                    }}
                    onResetFixed={async () => {
                        await vm.resetFixedBudget();
                        setShowResetModal(false);
                    }}
                    onResetVariable={async () => {
                        await vm.resetVariableBudget();
                        setShowResetModal(false);
                    }}
                    onSaveFixed={async (payload) => {
                        await vm.updateFixedEntries(payload);
                        setShowResetModal(false);
                    }}
                    budget={vm.budget}
                />
            </View>
        </View>
    );
}

// Vores layout og styling (kun layout, farver tilpasses senere)
const styles = StyleSheet.create({
    screen: {
        backgroundColor: "#FFFFFF",
        flex: 1,
    },
    scroll: {
        backgroundColor: "#FFFFFF",
    },
    container: {
        backgroundColor: "#FFFFFF",
        paddingTop: 24,
        paddingBottom: 140,
        flexGrow: 1,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 8,
        marginTop: 26,
    },

    navIcon: {
        fontSize: 22,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    monthTitle: {
        fontSize: 14,
        fontWeight: "600",
    },
    balanceSection: {
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
    },
    balanceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
    },
    balanceLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    editCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2F70FF",
    },
    editIcon: {
        fontSize: 20,
        color: "#FFFFFF",
    },
    balanceAmount: {
        fontSize: 20,
        fontWeight: "700",
    },
    calendarIcon: {
        fontSize: 25,
    },
    tabRow: {
        flexDirection: "row",
        gap: 20,
        paddingHorizontal: 16,
        marginTop: 16,
    },
    tabItem: {
        alignItems: "center",
    },
    tabActive: {
        fontSize: 14,
        fontWeight: "700",
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tabInactive: {
        fontSize: 14,
        fontWeight: "600",
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tabUnderline: {
        height: 2,
        width: "100%",
        marginTop: -2,
    },
    tabUnderlineActive: {
        backgroundColor: "#2F70FF",
    },
    circleSection: {
        alignItems: "center",
        marginTop: 16,
        marginBottom: 8,
    },
    alertBox: {
        marginTop: 8,
        marginHorizontal: 16,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
    },
    alertTitle: {
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 4,
    },
    alertText: {
        fontSize: 12,
    },
    section: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    listCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 12,
    },

    emptyState: {
        fontSize: 12,
        color: "#6B7280",
        paddingVertical: 12,
    },
    categoryGroup: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: "600",
    },
    categoryTotal: {
        fontSize: 14,
        fontWeight: "700",
    },
    expenseCard: {
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    expenseName: {
        fontSize: 14,
        fontWeight: "600",
    },
    expenseAmount: {
        fontSize: 14,
        fontWeight: "700",
    },

    // VIGTIGT for scroll i card
    expenseListCard: {
        padding: 16,
        maxHeight: 420, // justér efter behov
    },
    expenseInnerScroll: {
        // valgfri
    },

    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 20,
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },
    primaryButton: {
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    primaryButtonText: {
        fontSize: 14,
        fontWeight: "700",
    },
});

