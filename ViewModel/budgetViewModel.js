import {StoragePlaceholder} from '../Model/StoragePlaceholder.js'

export function getBudgetTotals() {
    const expenses = StoragePlaceholder.getExpenses();
    const incomes = StoragePlaceholder.getIncome();

    const totalExpenses = expenses.reduce(
        (sum, e) => sum + e.amount, 0);
    const totalIncomes = incomes.reduce(
        (sum, i) => sum + i.amount, 0);

    return {
        totalExpenses,
        totalIncomes
    };
}