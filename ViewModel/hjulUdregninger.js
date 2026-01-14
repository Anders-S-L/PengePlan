import { useCallback, useEffect, useState } from "react";
import { loadBudget } from "../Services/storage";

// default tal, så UI'et kan vise noget før data er loaded. Kaldet tomme tal fordi det er nul. Bruger vi til at undgå fejl i UI'et mens data hentes.
const EMPTY_METRICS = {
  incomeTotal: 0,
  expenseTotal: 0,
  luxuryTotal: 0,
  remaining: 0,
  spentPercent: 0,
  luxuryPercent: 0,
  normalPercent: 0,
};

// Gør forskellige input-typer til et sikkert tal (0 hvis det ikke giver mening)
function toNumber(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "string") {
    const normalized = value.replace(/\./g, "").replace(",", ".").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

// Det der sker her er at vi summerer alle beløb indtastet, i en liste så vi kan få totalerne til indkomst og udgifter i budgettet.
// Det gør at man kan udregne hvor meget brugeren har til rådighed i deres budget.
// Dataen kommer fra local storaget som er gemt når brugeren opretter deres budget i appen. Dataen er i filen storage.js
function sumAmounts(entries = []) {
  return entries.reduce((sum, entry) => {
    if (!entry || typeof entry !== "object") return sum;
    return sum + toNumber(entry.amount);
  }, 0);
}

// Finder ud af om et entry er "luksus".
// Vi understøtter flere feltnavne, så det er nemt at bruge.
// Dette skal måske ændres når vi har lavet udvidet budgettering med kategorier osv.
function isLuxuryEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  if (entry.isLuxury === true || entry.luxury === true) return true;
  const category = String(entry.category || entry.type || "").toLowerCase();
  return category === "luksus" || category === "luxury";
}

// Summerer kun luksus udgifter.
function sumLuxury(entries = []) {
  return entries.reduce((sum, entry) => {
    if (!isLuxuryEntry(entry)) return sum;
    return sum + toNumber(entry.amount);
  }, 0);
}

// Her udregnes alle de tal som hjulet skal bruge baseret på budget dataen lokaliseret i storage.js.
// Dataen kommer fra local storaget som er gemt når brugeren opretter deres budget i appen.
// Man tager altså budget objekterne og udregner totaler og procenter som hjulet skal bruge.
// Det gøres ved at summere indtægter og udgifter og finde procenterne af luksus og normale udgifter.
export function calculateWheelMetrics(budget) {
  if (!budget) return EMPTY_METRICS;

  const fixedIncomeTotal = sumAmounts(budget.fixedIncome);
  const variableIncomeTotal = sumAmounts(budget.variableIncome);
  const fixedExpenseTotal = sumAmounts(budget.fixedExpenses);
  const variableExpenseTotal = sumAmounts(budget.variableExpenses);

  const incomeTotal = fixedIncomeTotal + variableIncomeTotal;
  const expenseTotal = fixedExpenseTotal + variableExpenseTotal;

  const luxuryTotal =
    sumLuxury(budget.fixedExpenses) + sumLuxury(budget.variableExpenses);

  const remaining = incomeTotal - expenseTotal;
  // Vi deler kun med indkomst, hvis den er over 0. Det gør at vi undgår division med 0
  const safeIncome = incomeTotal > 0 ? incomeTotal : 0;
  const normalSpent = Math.max(expenseTotal - luxuryTotal, 0);

  // Procenter bruges af hjulet til at tegne segmenter. Det er det der viser hvor stor en del af hjulet 
  // der er brugt på normale udgifter og luksus udgifter, og hvor meget der skal tegnes som brugt i alt og tilbage.
  const luxuryPercent = safeIncome
    ? Math.min(luxuryTotal / safeIncome, 1)
    : 0;
  const normalPercent = safeIncome
    ? Math.min(normalSpent / safeIncome, 1 - luxuryPercent)
    : 0;
  const spentPercent = safeIncome ? Math.min(expenseTotal / safeIncome, 1) : 0;

  return {
    incomeTotal,
    expenseTotal,
    luxuryTotal,
    remaining,
    spentPercent,
    luxuryPercent,
    normalPercent,
  };
}

// Hooket som loader budgettet fra storage og giver tal til UI.
export function useHjulUdregninger() {
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Genindlæser budgettet fra AsyncStorage. Hvad er dette? Det er den lokale lagring på telefonen hvor vi gemmer brugerens budget data.
  const refresh = useCallback(async () => {
    const loaded = await loadBudget();
    setBudget(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Hvis budget ikke er loadet endnu, brug tomme tal. Det er bare for at undgå fejl i UI'et mens data hentes. altså "nul" 0.
  const metrics = budget ? calculateWheelMetrics(budget) : EMPTY_METRICS;

  return {
    budget,
    isLoading,
    metrics,
    refresh,
  };
}
