// Dette er vores forside skaerm der viser budgetoversigten.

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useBudgetViewModel } from "../../ViewModel/Budget/useBudgetViewModel";
import { TotalsView } from "../TotalsView";

export function BudgetOverview() {
    // Henter budgetdata fra view modellen
    const vm = useBudgetViewModel();

    if (vm.isLoading) return <Text>Indlæser...</Text>;
    if (!vm.budget) return <Text>Ingen budget endnu</Text>;

    // UI-liste til maanedsoverblikket
    const items = [
        { name: "Månedlig indkomst", value: vm.totals.income },
        { name: "Faste omkostninger", value: -vm.fixedExpensesTotal },
        { name: "Variable udgifter", value: -vm.variableExpensesTotal },
        { name: "Luksus udgifter", value: 0 },
        { name: "Total brugt", value: -vm.totals.expenses },
        { name: "Raadighedsbeloeb", value: vm.disposable },
    ];


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Topbar med måned */}
            <View style={styles.topBar}>
                <Text style={styles.navIcon}>{"<"}</Text>
                <Text style={styles.monthTitle}>Oktober 2025</Text>
                <Text style={styles.navIcon}>{">"}</Text>
            </View>

            {/* Rådighedsbeløbet */}
            <View style={styles.balanceSection}>
                <Text style={styles.label}>Rådighedsbeloeb</Text>
                <View style={styles.balanceRow}>
                    <View style={styles.balanceLeft}>
                        <View style={styles.editCircle}>
                            <Text style={styles.editIcon}>✎</Text>
                        </View>
                        <Text style={styles.balanceAmount}>2500. kr.</Text>
                    </View>
                    <Text style={styles.calendarIcon}>📅</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                <View style={styles.tabItem}>
                    <Text style={styles.tabActive}>OVERBLIK</Text>
                    <View style={[styles.tabUnderline, styles.tabUnderlineActive]} />
                </View>
                <View style={styles.tabItem}>
                    <Text style={styles.tabInactive}>UDGIFTER</Text>
                    <View style={styles.tabUnderline} />
                </View>
            </View>

            {/* Cirkeldiagram OBS: Skal ændres til den rigtige model, det her er bare Billede*/}
            <View style={styles.circleSection}>
                <View style={styles.circle} />
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={styles.legendDot} />
                        <Text style={styles.legendText}>Almindelige</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={styles.legendDot} />
                        <Text style={styles.legendText}>Luksus</Text>
                    </View>
                </View>
            </View>

            {/* Advarsel OBS: Skal ændres til rigtig data når det er lavet*/}
            <View style={styles.alertBox}>
                <Text style={styles.alertTitle}>Budget overskredet</Text>
                <Text style={styles.alertText}>Du har brugt 200% af dit budget</Text>
            </View>

            {/* Månedsoversigt */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Maanedsoversigt</Text>
                <View style={styles.listCard}>
                    <TotalsView totals={items} />
                </View>
            </View>

            {/* Primar knap */}
            <View style={styles.footer}>
                <View style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>+  Ny udgift</Text>
                </View>
            </View>
        </ScrollView>
    );
}

// Vores layout og styling (kun layout, farver tilpasses senere)
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        paddingTop: 24,
        paddingBottom: 24,
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
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#2F70FF",
    },
    editIcon: {
        fontSize: 14,
        color: "#2F70FF",
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
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 6,
    },
    legendRow: {
        flexDirection: "row",
        gap: 16,
        marginTop: 8,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1,
    },
    legendText: {
        fontSize: 12,
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
    footer: {
        marginTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
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
