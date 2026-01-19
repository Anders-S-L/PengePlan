import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "PengePlanData";

// laver et tomt budget
const EMPTY_BUDGET = {
    fixedIncome: [],
    variableIncome: [],
    fixedExpenses: [],
    variableExpenses: [],
};

export function createEmptyBudget() {
    return {
        fixedIncome: [],
        variableIncome: [],
        fixedExpenses: [],
        variableExpenses: [],
    };
}
// bruges til at hente budget
export async function loadBudget() {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return EMPTY_BUDGET;

    try {
        return JSON.parse(json);
    } catch {
        return EMPTY_BUDGET;
    }
}
//gemmer budget
export async function saveBudget(budget) {
    const json = JSON.stringify(budget);
    await AsyncStorage.setItem(STORAGE_KEY, json);
}

export async function resetBudget() {
    const empty = createEmptyBudget();
    await saveBudget(empty);
    return empty;
}

// henter faste indtægter
export async function getFixedIncome() {
    const budget = await loadBudget();
    return budget.fixedIncome;
}

// henter faste udgifter
export async function getFixedExpenses() {
    const budget = await loadBudget();
    return budget.fixedExpenses;
}
// henter variable indtægter
export async function getVariableIncome() {
    const budget = await loadBudget();
    return budget.variableIncome;
}
// henter variable udgifter
export async function getVariableExpenses() {
    const budget = await loadBudget();
    return budget.variableExpenses;
}

