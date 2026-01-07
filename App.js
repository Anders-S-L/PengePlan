import React from "react";

import { BudgetScreen } from "./View/screens/BudgetScreen";
import { BudgetOverview } from "./View/screens/BudgetOverview";
import OnboardingScreen from "./View/screens/OnboardingScreen";

export default function App() {
  const [screen, setScreen] = React.useState("onboarding");

  if (screen === "onboarding") {
    return <OnboardingScreen onDone={() => setScreen("overview")} />;
  } return <BudgetOverview />;
}


