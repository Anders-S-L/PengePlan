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

// Update a variable expense by createdAt (unique id).
export function updateVariableExpense(budget, updatedEntry) {
    if (!updatedEntry?.createdAt) return budget;
    return {
        ...budget,
        variableExpenses: budget.variableExpenses.map((entry) =>
            entry?.createdAt === updatedEntry.createdAt
                ? { ...entry, ...updatedEntry }
                : entry
        ),
    };
}

// Remove a variable expense by createdAt.
export function removeVariableExpense(budget, createdAt) {
    if (!createdAt) return budget;
    return {
        ...budget,
        variableExpenses: budget.variableExpenses.filter(
            (entry) => entry?.createdAt !== createdAt
        ),
    };
}
