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


    // UI-liste til månedsoverblikket
    const items = [
        { name: "Månedlig indkomst", value: vm.totals.income },
        { name: "Faste omkostninger", value: -vm.fixedExpensesTotal },
        { name: "Variable udgifter", value: -vm.variableExpensesTotal },
        { name: "Luksus udgifter", value: -vm.luxuryExpensesTotal },
        { name: "Total brugt", value: -vm.totals.expenses },
       
    ];
    // Formaterer beløb med . og kr. og mellemrum for negative tal
    const formatSignedAmount = (value) => {
        const amount = Math.abs(Number(value) || 0).toLocaleString("da-DK");
        const sign = value < 0 ? "- " : "";
        return `${sign}${amount} kr.`;
    };
    const råd = formatSignedAmount(vm.disposable);

    const budgetUsage = vm.budgetUsage ?? { spentPercent: 0, overBudgetPercent: 0, isOverBudget: false };
    const { spentPercent, overBudgetPercent, isOverBudget } = budgetUsage;

    const alertTitle = isOverBudget ? "Budget overskredet" : "Budgetstatus";
    const alertText = isOverBudget
        ? `Du har overskredet dit budget med ${overBudgetPercent}%`
        : `Du har brugt ${spentPercent}% af dit månedlige budget`;
    const formatAmount = (value) => {
        const amount = Number(value) || 0;
        return `${amount.toLocaleString("da-DK")} kr.`;
    };
    const raad = vm.disposable + " kr.";
    // Emoji til hver kategori (bruger en fallback hvis vi ikke kender kategorien)
    const categoryEmojiMap = {
        Mad: "🍽️",
        Transport: "🚌",
        Hjem: "🏠",
        Shopping: "🛍️",
        Underholdning: "🎮",
        Faste_udgifter: "🧾",
        Andet: "💸",
    };
    // Hjælper til at vælge emoji ud fra kategori
    const getCategoryEmoji = (category) => categoryEmojiMap[category] || "💼";
    // Finder totals pr. kategori (kun beløb, ikke enkelt-udgifter)
    const categoryTotals = vm.sortedExpenseCategories.map((category) => {
        const entries = vm.expensesByCategory?.[category] ?? [];
        const total = entries.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
        return { category, total };
    });
    // Finder de nyeste transaktioner ud fra allerede eksisterende data
    const recentTransactions = Object.entries(vm.expensesByCategory ?? {})
        .flatMap(([category, expenses]) =>
            (expenses ?? []).map((expense) => ({
                ...expense,
                category: expense.category || category || "Andet",
            }))
        )
        .sort((a, b) => {
            const dateDiff = (b.createdAt || 0) - (a.createdAt || 0);
            if (dateDiff !== 0) return dateDiff;
            return (a.name || "").localeCompare(b.name || "", "da-DK");
        });
    // Vi viser alle, fordi ScrollView tager sig af at man kan rulle
    // Dato-format til visning i listen
    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        return new Date(timestamp).toLocaleDateString("da-DK", {
            day: "numeric",
            month: "short",
        });
    };

    return (
        <View style={styles.screen}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                {/* Topbar med måned */}
                <View style={styles.topBar}>
                    <Text style={styles.navIcon}>{"<"}</Text>
                    <Text style={styles.monthTitle}>Januar 2026</Text>
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
                            {/* Ændrer farven i rådighedsbeløbet til rød eller grøn */}
                            <Text
                                style={[
                                    styles.balanceAmount,
                                ]}
                            >
                                {råd}
                            </Text>
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
                        {/* Cirkeldiagram med budgetbrug */}
                        <View style={styles.circleSection}>
                            <HjulUdseende budget={vm.budget} />
                        </View>

                        {/* Budget overskredet boks */}
                        {isOverBudget && (
                            <View style={styles.overBudgetBox}>
                                <Text style={styles.overBudgetTitle}>⚠️ Budget overskredet</Text>
                                <Text style={styles.overBudgetText}>{alertText}</Text>
                            </View>
                        )}
                        {/* Månedsoversigt */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Månedsoversigt</Text>
                            <View style={styles.listCard}>
                                <TotalsView totals={items} />
                            </View>
                            <Text style={styles.budgetStatusText}>{alertText}</Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Kategorier</Text>
                        <Card style={styles.categoryListCard}>
                            {categoryTotals.length === 0 ? (
                                <Text style={styles.emptyState}>Ingen udgifter endnu.</Text>
                            ) : (
                                categoryTotals.map((item) => (
                                    <View key={item.category} style={styles.categoryRow}>
                                        <View style={styles.categoryIcon}>
                                            <Text style={styles.categoryIconText}>
                                                {getCategoryEmoji(item.category)}
                                            </Text>
                                        </View>
                                        <Text style={styles.categoryName}>{item.category}</Text>
                                        <Text style={styles.categoryAmount}>
                                            {formatAmount(item.total)}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </Card>

                        {/* Seneste transaktioner (rigtige data) */}
                        <Text style={styles.sectionTitle}>Seneste transaktioner</Text>
                        <View style={styles.transactionCard}>
                            {/* ScrollView så man kan rulle på listen og se flere transaktioner uden at ødelægge resten af skærmen */}
                            <ScrollView
                                style={styles.transactionScroll}
                                nestedScrollEnabled
                                scrollEnabled
                                showsVerticalScrollIndicator
                            >
                                {recentTransactions.length === 0 ? (
                                    <Text style={styles.emptyState}>Ingen transaktioner endnu.</Text>
                                ) : (
                                    recentTransactions.map((expense, index) => {
                                        const dateLabel = formatDate(expense.createdAt);
                                        const icon = getCategoryEmoji(expense.category);
                                        return (
                                            <View
                                                key={`${expense.name}-${expense.createdAt ?? index}`}
                                                style={styles.transactionRow}
                                            >
                                                <View style={styles.transactionIcon}>
                                                    <Text style={styles.transactionIconText}>{icon}</Text>
                                                </View>
                                                <View style={styles.transactionInfo}>
                                                    <Text style={styles.transactionTitle}>{expense.name}</Text>
                                                    <Text style={styles.transactionMeta}>
                                                        {expense.category}{dateLabel ? ` - ${dateLabel}` : ""}
                                                    </Text>
                                                </View>
                                                <Text style={styles.transactionAmount}>
                                                    -{formatAmount(expense.amount)}
                                                </Text>
                                                {/* Det her er vores knapper til redigering og sletning af transaktioner. OBS: Skal ændres til rigtige knapper når det er lavet.*/}
                                                <View style={styles.transactionActions}>
                                                    <TouchableOpacity
                                                        style={styles.transactionActionBtn}
                                                        onPress={() => { }}
                                                        accessibilityRole="button"
                                                        accessibilityLabel="Rediger transaktion"
                                                    >
                                                        <Text style={styles.transactionActionText}>✏️</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.transactionActionBtn}
                                                        onPress={() => { }}
                                                        accessibilityRole="button"
                                                        accessibilityLabel="Slet transaktion"
                                                    >
                                                        <Text style={styles.transactionActionText}>🗑️</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    })
                                )}
                            </ScrollView>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Primær knap (tilføj udgift) */}
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
        fontSize: 14,
        fontWeight: "600",
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
    // Farver for positiv og negativ balance
    amountPositive: {
        color: "#39D52E",
    },
    amountNegative: {
        color: "#FE0303",
    },
    // Farver for positiv og negativ balance
    amountPositive: {
        color: "#39D52E",
    },
    amountNegative: {
        color: "#FE0303",
    },
    calendarIcon: {
        fontSize: 25,
    },
    tabRow: {
        flexDirection: "row",
        gap: 20,
        paddingHorizontal: 16,
        justifyContent: "center",
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
    section: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 0,
    },
    listCard: {
        borderRadius: 12,
        borderWidth: 0,
        padding: 12,
    },
    categoryListCard: {
        marginTop: 2,
        paddingVertical: 6,
        marginBottom: 8,
    },
    categoryRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 8,
    },
    categoryIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#E5EDFF",
        alignItems: "center",
        justifyContent: "center",
    },
    categoryIconText: {
        fontSize: 16,
    },
    categoryName: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: "#1F2937",
    },
    categoryAmount: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },
    budgetStatusText: {
        fontSize: 12,
        marginTop: 8,
        color: "#374151",
        textAlign: "center",
    },
    overBudgetBox: {
        marginTop: 8,
        alignSelf: "center",
        alignItems: "center",
        width: "60%",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FCA5A5",
        backgroundColor: "#FEE2E2",
    },
    overBudgetTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: "#B91C1C",
        marginBottom: 4,
    },
    overBudgetText: {
        fontSize: 12,
        color: "#B91C1C",
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
    // UI til "Seneste transaktioner"
    transactionCard: {
        marginTop: 2,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        maxHeight: 220, // låser højden så ScrollView kan rulle
    },
    transactionScroll: {
        flexGrow: 0, // sørger for at ScrollView ikke vokser til alt indhold
    },
    transactionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
    },
    transactionIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    transactionIconText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#374151",
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    transactionMeta: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    transactionAmount: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
        marginRight: 8,
    },
    transactionActions: {
        flexDirection: "row",
        gap: 8,
    },
    transactionActionBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    transactionActionText: {
        fontSize: 14,
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
