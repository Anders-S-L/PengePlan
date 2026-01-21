// viewmodel/budget/useBudgetViewModel.js

import { useEffect, useState } from "react";

import {
  calculateDisposableAmount,
  calculateTotals,
} from "../../Model/disposableAmount";

// Service-laget: henter og gemmer budgettet i AsyncStorage
import { loadBudget, resetBudget, saveBudget } from "../../Services/storage";

// ViewModel helper-funktioner: rene funktioner der returnerer et nyt budget-objekt
import {
  addFixedIncome,
  addFixedExpense,
  addVariableIncome,
  addVariableExpense,
  updateVariableExpense,
  removeVariableExpense,
} from "./addEntries";

export function useBudgetViewModel() {
  // budget indeholder HELE budget-objektet:
  // { fixedIncome, fixedExpenses, variableIncome, variableExpenses }
  //
  // Vi starter som null, fordi vi først skal hente det fra storage.
  const [budget, setBudget] = useState(null);

  // isLoading bruges af View til at vise "Indlæser..." og for at undgå actions for tidligt
  const [isLoading, setIsLoading] = useState(true);

  // Kører én gang ved mount (når appen/screenen starter)
  // Formålet er at hente gemt data fra mobilen og putte det i state.
  useEffect(() => {
    async function init() {
      const loaded = await loadBudget(); // hent fra AsyncStorage via service
      setBudget(loaded); // opdater ViewModel-state
      setIsLoading(false); // signalér til UI at vi er klar
    }

    init();
  }, []);

  // commit er en fælles hjælpefunktion der gør to ting:
  // 1) Opdaterer state (så UI opdaterer med det samme)
  // 2) Gemmer den nye state i AsyncStorage (så data overlever genstart)
  async function commit(next) {
    setBudget(next);
    await saveBudget(next);
  }

  // Action: tilføj fast indtægt
  // entry er et simpelt objekt, fx { name: "Løn", amount: 20000 }
  async function handleAddFixedIncome(entry) {
    // Hvis vi ikke har hentet budget endnu, så gør ingenting (eller throw)
    if (!budget) return;

    // addFixedIncome er en ren funktion:
    // den muterer ikke budget, men returnerer et nyt budget-objekt
    const next = addFixedIncome(budget, entry);

    // commit gemmer med det samme
    await commit(next);
  }

  // Action: tilføj fast udgift
  async function handleAddFixedExpense(entry) {
    if (!budget) return;

    const next = addFixedExpense(budget, entry);
    await commit(next);
  }
  function toNumber(v) {
    if (v === null || v === undefined) return 0;
    if (typeof v === "string") {
      const normalized = v.replace(/\./g, "").replace(",", ".").trim();
      const n = Number(normalized);
      return Number.isFinite(n) ? n : 0;
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function sumAmounts(entries = []) {
    return entries.reduce((sum, e) => sum + toNumber(e?.amount), 0);
  }

  async function handleAddVariableIncome(entry) {
    if (!budget) return;

    const next = addVariableIncome(budget, entry);
    await commit(next);
  }

  async function handleAddVariableExpense(entry) {
    if (!budget) return;

    const next = addVariableExpense(budget, entry);
    await commit(next);
  }
  // 🟢 Fjern fast indtægt
  async function handleRemoveFixedIncome(index) {
    if (!budget) return;

    const next = {
      ...budget,
      fixedIncome: budget.fixedIncome.filter((_, i) => i !== index),
    };

    await commit(next);
  }

  // 🔴 Fjern fast udgift
  async function handleRemoveFixedExpense(index) {
    if (!budget) return;

    const next = {
      ...budget,
      fixedExpenses: budget.fixedExpenses.filter((_, i) => i !== index),
    };

    await commit(next);
  }

  // Update an existing variable expense.
  async function handleUpdateVariableExpense(entry) {
    if (!budget) return;
    const next = updateVariableExpense(budget, entry);
    await commit(next);
  }
  // Remove a variable expense.
  async function handleRemoveVariableExpense(createdAt) {
    if (!budget) return;
    const next = removeVariableExpense(budget, createdAt);
    await commit(next);
  }

  async function handleResetBudget(options = {}) {
    if (!budget) return;
    const { fixed = true, variable = true } = options;
    const next = {
      ...budget,
      ...(fixed ? { fixedIncome: [], fixedExpenses: [] } : {}),
      ...(variable ? { variableIncome: [], variableExpenses: [] } : {}),
    };

    await commit(next);
  }

  async function handleUpdateFixedEntries({ fixedIncome, fixedExpenses }) {
    if (!budget) return;

    const next = {
      ...budget,
      fixedIncome: fixedIncome ?? budget.fixedIncome,
      fixedExpenses: fixedExpenses ?? budget.fixedExpenses,
    };

    await commit(next);
  }

  async function handleResetAllBudget() {
    await handleResetBudget();
  }

  async function handleResetFixedBudget() {
    await handleResetBudget({ fixed: true, variable: false });
  }

  async function handleResetVariableBudget() {
    await handleResetBudget({ fixed: false, variable: true });
  }

  // View får kun det, den skal bruge:
  // state + actions
  const variableExpenses = budget?.variableExpenses ?? [];
  const normalVariableExpenses = variableExpenses.filter((e) => !e.isLuxury);
  const luxuryExpenses = variableExpenses.filter((e) => e.isLuxury);

  const expenses = [
    ...(budget?.fixedExpenses ?? []).map((expense) => ({
      ...expense,
      category: "Faste udgifter",
    })),
    ...(budget?.variableExpenses ?? []).map((expense) => ({
      ...expense,
      category: expense.category || "Andet",
    })),
  ];

  const expensesByCategory = expenses.reduce((grouped, expense) => {
    const category = expense.category || "Andet";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(expense);
    return grouped;
  }, {});

  const sortedExpenseCategories = Object.keys(expensesByCategory).sort((a, b) =>
    a.localeCompare(b, "da-DK"),
  );

  const totals = budget ? calculateTotals(budget) : { income: 0, expenses: 0 };
  const disposable = budget ? calculateDisposableAmount(budget) : 0;

  const fixedIncomeTotal = budget ? sumAmounts(budget.fixedIncome) : 0;
  const fixedExpensesTotal = budget ? sumAmounts(budget.fixedExpenses) : 0;
  const variableIncomeTotal = budget ? sumAmounts(budget.variableIncome) : 0;
  const variableExpensesTotal = budget ? sumAmounts(normalVariableExpenses) : 0;
  const luxuryExpensesTotal = budget ? sumAmounts(luxuryExpenses) : 0;
  const incomeTotal = Number(totals?.income ?? 0);
  const expensesTotal = Number(totals?.expenses ?? 0);

  const spentPercentRaw =
    incomeTotal > 0 ? (expensesTotal / incomeTotal) * 100 : 0;

  // 1 decimal i stedet for Math.round
  const spentPercent = Number(spentPercentRaw.toFixed(1));

  const overBudgetPercent = Number(
    Math.max(spentPercentRaw - 100, 0).toFixed(1),
  );
  const isOverBudget = spentPercentRaw > 100;

  return {
    budget,
    isLoading,
    totals,
    disposable,
    fixedIncomeTotal,
    fixedExpensesTotal,
    variableIncomeTotal,
    variableExpensesTotal,
    luxuryExpensesTotal,
    expensesByCategory,
    sortedExpenseCategories,
    handleRemoveFixedExpense,
    handleRemoveFixedIncome,
    budgetUsage: {
      spentPercent,
      overBudgetPercent,
      isOverBudget,
    },
    addFixedIncome: handleAddFixedIncome,
    addFixedExpense: handleAddFixedExpense,
    addVariableIncome: handleAddVariableIncome,
    addVariableExpense: handleAddVariableExpense,
    updateVariableExpense: handleUpdateVariableExpense,
    removeVariableExpense: handleRemoveVariableExpense,
    resetBudget: handleResetBudget,
    resetAllBudget: handleResetAllBudget,
    resetFixedBudget: handleResetFixedBudget,
    resetVariableBudget: handleResetVariableBudget,
    updateFixedEntries: handleUpdateFixedEntries,
  };
}
