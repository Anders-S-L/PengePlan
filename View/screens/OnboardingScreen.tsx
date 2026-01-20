import React from "react";
import { useOnboardingViewModel } from "../../ViewModel/useOnboardingViewModel";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

import { Card } from "../../components/UI/Card";
import { AppText } from "../../components/UI/AppText";
import { Button } from "../../components/UI/Button";
import { theme } from "../../styles/theme";
import { Input } from "../../components/UI/Input";
import { useBudgetViewModel } from "../../ViewModel/Budget/useBudgetViewModel";

type Probs = {
  onDone: () => void;
};

export default function OnboardingScreen({ onDone }: Probs) {
  const ob = useOnboardingViewModel();
  const vm = useBudgetViewModel();
  const onlyNumbers = (text: string) => {
    return text.replace(/[^0-9]/g, "");
  };

  const [incomeName, setIncomeName] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");

  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const Step = ({ number, color, title, text }) => {
    return (
      <View style={[styles.stepsContainer, { borderColor: color }]}>
        <View style={[styles.stepCircle, { backgroundColor: color }]}>
          <Text style={styles.stepNumber}>{number}</Text>
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>{title}</Text>
          <Text style={styles.stepText}>{text}</Text>
        </View>
      </View>
    );
  };

  const parseAmount = (s: string) => {
    const n = Number(s.replace(",", ".").trim());
    return Number.isFinite(n) ? n : null;
  };

  const ctaLabel = ob.isLastStep() ? "Kom i gang" : "Næste";

  async function addFixedIncome() {
    if (!incomeName || !incomeAmount) return;
    await vm.addFixedIncome({
      name: incomeName,
      amount: parseFloat(incomeAmount),
    });
    setIncomeName("");
    setIncomeAmount("");
  }

  async function addFixedExpense() {
    if (!expenseName || !expenseAmount) return;
    await vm.addFixedExpense({
      name: expenseName,
      amount: parseFloat(expenseAmount),
    });
    setExpenseName("");
    setExpenseAmount("");
  }

  function handleNext() {
    if (ob.isLastStep()) {
      onDone();
    } else {
      ob.nextStep();
    }
  }

  function stepContent() {
    // step 0 velkomst

    if (ob.currentStep === 0) {
      return (
        <>
          <View style={styles.iconCircle}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.iconImage}
            />
          </View>

          <AppText variant="h4" style={styles.title}>
            Velkommen til PengePlan!
          </AppText>

          <AppText style={styles.subtitle}>
            Lad os opsætte dit månedlige budget sammen. Det tager kun et
            øjeblik.
          </AppText>

          <View style={styles.steps}>
            <Step
              number="1"
              color="#4F7CFF"
              title="Faste indtægter"
              text="Indtast din løn og andre faste indtægter"
            />
            <Step
              number="2"
              color="#9B5CFF"
              title="Faste omkostninger"
              text="Tilføj husleje, abonnementer og andre faste udgifter"
            />
            <Step
              number="3"
              color="#4CD964"
              title="Klar til at bruge!"
              text="Dit budget er sat op og klar hver måned"
            />
          </View>
        </>
      );
    }

    if (ob.currentStep === 1) {
      return (
        <>
          <AppText variant="h4" style={styles.title}>
            Faste indtægter
          </AppText>

          <AppText style={styles.subtitle}>
            Tilføj din løn og andre faste indtægter.
          </AppText>

          {/* Grøn boks med tilføjede indtægter */}
          {vm.budget?.fixedIncome?.length > 0 && (
            <View style={styles.addedIncomeBox}>
              {vm.budget.fixedIncome.map((x, i) => (
                <View key={i} style={styles.addedIncomeRow}>
                  <AppText style={styles.addedIncomeName}>{x.name}</AppText>
                  <AppText style={styles.addedIncomeAmount}>
                    +{Number(x.amount).toLocaleString("da-DK")} kr./måned
                  </AppText>
                </View>
              ))}
            </View>
          )}

          <Card style={styles.innerCard}>
            <AppText>Navn</AppText>
            <Input
              value={incomeName}
              onChangeText={setIncomeName}
              placeholder="fx Løn"
            />

            <AppText style={{ marginTop: theme.spacing.md }}>Beløb</AppText>
            <Input
              value={incomeAmount}
              onChangeText={(text) => setIncomeAmount(onlyNumbers(text))}
              keyboardType="numeric"
              placeholder="fx 20000"
            />

            <View style={{ marginTop: theme.spacing.lg }}>
              <Button title="Tilføj indtægt" onPress={addFixedIncome} />
            </View>
          </Card>

          {/* Total indtægter */}
          {vm.budget?.fixedIncome?.length > 0 && (
            <View style={styles.totalIncomeBox}>
              <AppText style={styles.totalIncomeLabel}>Total indtægter</AppText>
              <AppText style={styles.totalIncomeValue}>
                {vm.totals.income.toLocaleString("da-DK")} kr./måned
              </AppText>
            </View>
          )}
        </>
      );
    }
    // Step 2: faste omkostninger
    if (ob.currentStep === 2) {
      const hasExpenses = (vm.budget?.fixedExpenses?.length ?? 0) > 0;

      return (
        <>
          <AppText variant="h4" style={styles.title}>
            Faste omkostninger
          </AppText>

          <AppText style={styles.subtitle}>
            Tilføj husleje, abonnementer og andre faste udgifter.
          </AppText>

          {/* 🔴 RØD BOKS – tilføjede udgifter */}
          {hasExpenses && (
            <View style={styles.addedExpenseBox}>
              {vm.budget.fixedExpenses.map((x, i) => (
                <View key={i} style={styles.addedExpenseRow}>
                  <AppText style={styles.addedExpenseName}>{x.name}</AppText>
                  <AppText style={styles.addedExpenseAmount}>
                    −{Number(x.amount).toLocaleString("da-DK")} kr./måned
                  </AppText>
                </View>
              ))}
            </View>
          )}

          <Card style={styles.innerCard}>
            <AppText>Navn</AppText>
            <Input
              value={expenseName}
              onChangeText={setExpenseName}
              placeholder="Husleje"
            />

            <AppText style={{ marginTop: theme.spacing.md }}>Beløb</AppText>
            <Input
              value={expenseAmount}
              onChangeText={(text) => setExpenseAmount(onlyNumbers(text))}
              keyboardType="numeric"
              placeholder="fx 8000"
            />

            <View style={{ marginTop: theme.spacing.lg }}>
              <Button title="Tilføj udgift" onPress={addFixedExpense} />
            </View>
          </Card>

          {/* 🔵 BLÅ BOKS – total udgifter (samme stil som indtægter) */}
          {hasExpenses && (
            <View style={styles.totalIncomeBox}>
              <AppText style={styles.totalIncomeLabel}>
                Total omkostninger
              </AppText>
              <AppText style={styles.totalIncomeValue}>
                {vm.totals.expenses.toLocaleString("da-DK")} kr./måned
              </AppText>
            </View>
          )}
        </>
      );
    }

    // Step 3: klar
    return (
      <>
        <AppText variant="h4" style={styles.title}>
          Klar til at bruge!
        </AppText>

        <AppText style={styles.subtitle}>
          Dit budget er sat op. Tryk “Kom i gang” for at se dit overblik.
        </AppText>

        <Card style={styles.innerCard}>
          <AppText>
            Faste indtægter: {vm.totals.income.toLocaleString("da-DK")} kr.
          </AppText>
          <AppText>
            Faste udgifter: {vm.totals.expenses.toLocaleString("da-DK")} kr.
          </AppText>
          <AppText style={{ marginTop: theme.spacing.md, fontWeight: "700" }}>
            Rådighedsbeløb: {vm.disposable.toLocaleString("da-DK")} kr.
          </AppText>
        </Card>
      </>
    );
  }
  if (vm.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppText>Indlæser…</AppText>
      </SafeAreaView>
    );
  }
  return (
  <SafeAreaView style={styles.container}>
    <Card style={styles.outerCard} padded>
      {/* 🔙 BACK BUTTON */}
      {ob.currentStep > 0 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={ob.prevStep}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Tilbage</Text>
        </TouchableOpacity>
      )}

      {/* 🧭 SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {stepContent()}
      </ScrollView>

      {/* ⬇️ FOOTER */}
      <View style={styles.footer}>
        <Button title={ctaLabel} onPress={handleNext} />

        <View style={styles.dotContainer}>
          {Array.from({ length: ob.totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                ob.currentStep === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>
    </Card>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A855F7",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  outerCard: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: theme.colors.background,
  },
  innerCard: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
  },
  iconCircle: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  iconText: { fontSize: 24 },
  iconImage: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },
  title: { textAlign: "center", marginBottom: theme.spacing.sm },
  subtitle: {
    textAlign: "center",
    color: theme.colors.textSecondary,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.divider,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 12,
    backgroundColor: "#4F7CFF",
  },
  stepsContainer: {
    backgroundColor: "rgba(79, 124, 255, 0.08)", // 👈 utydelig blå
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  stepContent: {
    flexDirection: "column",
  },
  steps: {
    gap: 16,
  },
  step: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  stepNumber: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },
  stepTitle: {
    fontWeight: "600",
    fontSize: 15,
    color: "#111827",
  },
  stepText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  addedIncomeBox: {
    backgroundColor: "#ECFDF3",
    borderRadius: 14,
    padding: 14,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  addedIncomeRow: {
    flexDirection: "column",
  },

  addedIncomeName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#065F46",
  },

  addedIncomeAmount: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
  },

  totalIncomeBox: {
    marginTop: theme.spacing.lg,
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalIncomeLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E40AF",
  },

  totalIncomeValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2563EB",
  },

  addedExpenseBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    padding: 14,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  addedExpenseRow: {
    flexDirection: "column",
  },

  addedExpenseName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#7F1D1D",
  },

  addedExpenseAmount: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },

  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginTop: "auto",
  },
  backButton: {
    position: "absolute",
    top: theme.spacing.md,
    left: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },

  backIcon: {
    fontSize: 28,
    lineHeight: 28,
    marginRight: 4,
    color: "#4F7CFF",
  },

  backText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4F7CFF",
  },
});
