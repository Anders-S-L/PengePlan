// tilføjer en fast indtægt eller en fast udgift til budgetobjektet
export function addFixedIncome(budget, entry) {
    return { ...budget, fixedIncome: [...budget.fixedIncome, entry] };
}

export function addFixedExpense(budget, entry) {
    return { ...budget, fixedExpenses: [...budget.fixedExpenses, entry] };
}

// tilføjer en variabel indtægt eller en variabel udgift til budgetobjektet
export function addVariableIncome(budget, entry) {
    return { ...budget, variableIncome: [...budget.variableIncome, entry] };
}
export function addVariableExpense(budget, entry) {
    return { ...budget, variableExpenses: [...budget.variableExpenses, entry] };
}   