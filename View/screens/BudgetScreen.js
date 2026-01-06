export function BudgetScreen() {
    const vm = useBudgetViewModel();

    if (vm.isLoading) return <Text>Indlæser...</Text>;

    const items = [
        { name: "Indtægter", value: vm.totals.income },
        { name: "Udgifter", value: -vm.totals.expenses },
        { name: "Rådighedsbeløb", value: vm.disposable },
    ];

    return <TotalsView totals={items} />;
}
