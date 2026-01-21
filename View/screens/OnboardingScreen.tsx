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
              color={theme.colors.primary}
              title="Faste indtægter"
              text="Indtast din løn og andre faste indtægter"
            />
            <Step
              number="2"
              color={theme.colors.luxury}
              title="Faste udgifter"
              text="Tilføj husleje, abonnementer og andre faste udgifter"
            />
            <Step
              number="3"
              color={theme.colors.success}
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

          <AppText style={styles.caption}>
            Trin 1 af 3
          </AppText>

          <AppText style={styles.subtitle}>
            Først starter vi med dine faste indtægter. Hvad får du ind hver
            måned?
          </AppText>

          {/* Grøn boks med tilføjede indtægter */}
          {vm.budget?.fixedIncome?.length > 0 && (
            <View style={styles.addedIncomeBox}>
              {vm.budget.fixedIncome.map((x, i) => (
                <View key={i} style={styles.addedItemRow}>
                  <View>
                    <AppText style={styles.addedIncomeName}>{x.name}</AppText>
                    <AppText style={styles.addedIncomeAmount}>
                      +{Number(x.amount).toLocaleString("da-DK")} kr./måned
                    </AppText>
                  </View>

                  <TouchableOpacity
                    onPress={() => vm.handleRemoveFixedIncome(i)}
                    hitSlop={10}
                  >
                    <Text style={styles.deleteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <Card style={[styles.innerCard, styles.mtXl]}>
            <AppText>Beskrivelse:</AppText>
            <Input
              value={incomeName}
                style={{ borderColor: theme.colors.primary }}
              onChangeText={setIncomeName}
              placeholder="f.eks. Løn"
            />

            <AppText style={styles.mtMd}>Beløb:</AppText>
            <Input
              value={incomeAmount}
              style={{ borderColor: theme.colors.primary }}
              onChangeText={(text) => setIncomeAmount(onlyNumbers(text))}
              keyboardType="number-pad"
              placeholder="f.eks. 20.000"
            />

            <View style={styles.mtLg}>
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
            Faste udgifter
          </AppText>

          <AppText style={styles.caption}>
            Trin 2 af 3
          </AppText>

          <AppText style={styles.subtitle}>
            Næste skridt: Hvad betaler du fast hver måned?
          </AppText>

          {/* 🔴 RØD BOKS – tilføjede udgifter */}
          {hasExpenses && (
            <View style={styles.addedExpenseBox}>
              {vm.budget.fixedExpenses.map((x, i) => (
                <View key={i} style={styles.addedItemRow}>
                  <View>
                    <AppText style={styles.addedExpenseName}>{x.name}</AppText>
                    <AppText style={styles.addedExpenseAmount}>
                      −{Number(x.amount).toLocaleString("da-DK")} kr./måned
                    </AppText>
                  </View>

                  <TouchableOpacity
                    onPress={() => vm.handleRemoveFixedExpense(i)}
                    hitSlop={10}
                  >
                    <Text style={styles.deleteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <Card style={[styles.innerCard, styles.mtXl]}>
            <AppText>Beskrivelse:</AppText>
            <Input
              value={expenseName}
                style={{ borderColor: theme.colors.primary }}
              onChangeText={setExpenseName}
              placeholder="f.eks. Husleje"
            />

            <AppText style={styles.mtMd}>Beløb:</AppText>
            <Input
              value={expenseAmount}
                style={{ borderColor: theme.colors.primary }}
              onChangeText={(text) => setExpenseAmount(onlyNumbers(text))}
              keyboardType="number-pad"
              placeholder="f.eks. 8.000"
            />

            <View style={styles.mtLg}>
              <Button title="Tilføj udgift" onPress={addFixedExpense} />
            </View>
          </Card>

          {/* 🔵 BLÅ BOKS – total udgifter (samme stil som indtægter) */}
          {hasExpenses && (
            <View style={styles.totalIncomeBox}>
              <AppText style={styles.totalIncomeLabel}>
                Samlede udgifter
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

          <AppText style={styles.caption}>
            Trin 3 af 3
          </AppText>

        <AppText style={styles.subtitle}>
          Dit budget er sat op. Tryk “Kom i gang” for at se dit overblik.
        </AppText>

        <Card style={[styles.innerCard, styles.mtXl]}>
          <AppText>
            Faste indtægter: {vm.totals.income.toLocaleString("da-DK")} kr.
          </AppText>
          <AppText>
            Faste udgifter: {vm.totals.expenses.toLocaleString("da-DK")} kr.
          </AppText>
          <AppText style={[styles.mtMd, styles.textStrong]}>
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
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  outerCard: {
    flex: 1,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.background,
  },
  innerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  iconCircle: {
    alignSelf: "center",
    backgroundColor: theme.colors.background,
    width: theme.sizes.iconLg,
    height: theme.sizes.iconLg,
    borderRadius: theme.sizes.iconLg / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  iconImage: {
    width: theme.sizes.logo,
    height: theme.sizes.logo,
    resizeMode: "contain",
  },
  title: { textAlign: "center", marginBottom: theme.spacing.sm },
  subtitle: {
    textAlign: "center",
    color: theme.colors.textSecondary,
  },
  caption: {
    ...theme.typography.caption,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    color: theme.colors.textDisabled,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
  },
  dot: {
    width: theme.sizes.dot,
    height: theme.sizes.dot,
    borderRadius: theme.sizes.dot / 2,
    backgroundColor: theme.colors.divider,
    marginHorizontal: theme.spacing.xs,
  },
  activeDot: {
    width: theme.sizes.dotActiveWidth,
    backgroundColor: theme.colors.primary,
  },
  stepsContainer: {
    backgroundColor: theme.colors.stepBg,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    flexDirection: "row",
    alignItems: "center",
  },
  stepContent: {
    flexDirection: "column",
  },
  steps: {
    gap: theme.spacing.lg,
  },
  step: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  stepCircle: {
    width: theme.sizes.stepCircle,
    height: theme.sizes.stepCircle,
    borderRadius: theme.sizes.stepCircle / 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  stepNumber: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: "700",
  },
  stepTitle: {
    ...theme.typography.label,
    color: theme.colors.textPrimary,
  },
  stepText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxs,
  },
  addedIncomeBox: {
    backgroundColor: theme.colors.successBg,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.successBorder,
  },

  addedIncomeName: {
    ...theme.typography.label,
    color: theme.colors.success,
  },

  addedIncomeAmount: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.p.fontSize,
    fontWeight: "600",
    color: theme.colors.success,
  },

  totalIncomeBox: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.infoBg,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.infoBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalIncomeLabel: {
    ...theme.typography.label,
    color: theme.colors.primary,
  },

  totalIncomeValue: {
    ...theme.typography.h4,
    color: theme.colors.primary,
  },

  addedExpenseBox: {
    backgroundColor: theme.colors.dangerBg,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.dangerBorder,
  },

  addedExpenseName: {
    ...theme.typography.label,
    color: theme.colors.danger,
  },

  addedExpenseAmount: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.p.fontSize,
    fontWeight: "600",
    color: theme.colors.danger,
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
    fontSize: theme.sizes.backIcon,
    lineHeight: theme.sizes.backIcon,
    marginRight: theme.spacing.xs,
    color: theme.colors.primary,
  },

  backText: {
    fontSize: theme.typography.label.fontSize,
    fontWeight: "500",
    color: theme.colors.primary,
  },

  addedItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deleteIcon: {
    fontSize: theme.sizes.iconMd,
    fontWeight: "600",
    color: theme.colors.textDisabled,
  },
  textStrong: {
    fontWeight: "700",
  },
  mtMd: {
    marginTop: theme.spacing.md,
  },
  mtLg: {
    marginTop: theme.spacing.lg,
  },
  mtXl: {
    marginTop: theme.spacing.xl,
  },
});
