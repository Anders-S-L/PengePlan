import React, { useState } from "react";
import { BudgetOverview } from "./View/screens/BudgetOverview";
import { AddExpenseScreen } from "./View/screens/AddExpenseScreen";

export default function App() {
    const [screen, setScreen] = useState("overview");

    if (screen === "addExpense") {
        return (
            <AddExpenseScreen
                onSave={() => setScreen("overview")}
                onCancel={() => setScreen("overview")}
            />
        );
    }

    return <BudgetOverview onAddExpense={() => setScreen("addExpense")} />;
}