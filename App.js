import React from "react";

import { BudgetScreen } from "./View/screens/BudgetScreen";
import { BudgetOverview } from "./View/screens/BudgetOverview";
import OnboardingScreen from "./View/screens/OnboardingScreen";
import { loadBudget } from "./Services/storage";

export default function App() {
  const [screen, setScreen] = React.useState(null);

  React.useEffect(() => {
    async function init() {
      // Læs budget fra local storage (AsyncStorage)
      const budget = await loadBudget();
      // Budget findes hvis der er data i en af listerne
      const hasBudget =
        budget &&
        (budget.fixedIncome?.length ||
          budget.fixedExpenses?.length ||
          budget.variableIncome?.length ||
          budget.variableExpenses?.length);

      setScreen(hasBudget ? "overview" : "onboarding");
    }

    init();
  }, []);

  // Undgå at vise UI før vi ved hvilken skærm der skal vises
  if (!screen) return null;

  if (screen === "onboarding") {
    // Når onboarding er færdig, hop til overview
    return <OnboardingScreen onDone={() => setScreen("overview")} />;
  } return <BudgetOverview />;
}
