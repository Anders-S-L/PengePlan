// viewmodel/budget/useBudgetViewModel.js

import { useEffect, useState } from "react";

// Service-laget: henter og gemmer budgettet i AsyncStorage
import { loadBudget, saveBudget } from "../../Services/storage";

// ViewModel helper-funktioner: rene funktioner der returnerer et nyt budget-objekt
import { addFixedIncome, addFixedExpense } from "./addEntries";

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
      setBudget(loaded);                 // opdater ViewModel-state
      setIsLoading(false);               // signalér til UI at vi er klar
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

  // View får kun det, den skal bruge:
  // state + actions
  return {
    budget,
    isLoading,

    addFixedIncome: handleAddFixedIncome,
    addFixedExpense: handleAddFixedExpense,
  };
}

