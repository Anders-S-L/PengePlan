import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { theme } from "../../styles/theme";
import { calculateWheelMetrics } from "../../ViewModel/wheelCalculations";


// Her definerer vi størrelsen på hjulet og cirklen. Eventuelt prøv at ændre lidt for at se hvordan det virker :)
const WHEEL_SIZE = 140;
const STROKE_WIDTH = 12;
const RADIUS = (WHEEL_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Her formaterer vi bare tallene så det bliver danske kroner
function formatKr(value) {
  const rounded = Math.round(value);
  return `${rounded.toLocaleString("da-DK")} kr.`;
}

export function WheelView({ budget, isOverBudget = false }) {
  // Her hentes udregninger osv fra vores local storage i ViewModel så hjulet 
  // tegnes korrekt i forhold til budgettet, alt efter hvad brugeren har indtastet i deres budget
  // const { isLoading, metrics } = useWheelCalculations();

  // her vises en loading tekst mens data hentes fra storage så brugeren ved at noget sker og at hjulet er på vej :D
  // Det er bare formelt, men vigtigt for brugeroplevelsen, hvisd en er lang tid om at loade data

  const metrics = calculateWheelMetrics(budget);
  // Tager  de felter vi skal bruge i UIet fra metrics objektet som er lavet i ViewModel. Det er de udregnede tal baseret på brugerens budget
  // hentet fra local storage og de procenter vi har defineret i ViewModel i filen wheelCalculations.js.
  const {
    incomeTotal,
    expenseTotal,
    luxuryTotal,
    remaining,
    normalPercent,
    luxuryPercent,
  } = metrics;

  // HER udregnes længderne på de forskellige segmenter i hjulet. Det er data fra ViewModel
  // ganget med omkredsen af cirklen for at få den korrekte længde til SVG cirklen.
  // SVG cirkel er tegnet sådan at den bruger strokeDasharray til at vise procenterne. StrokeDasharray er en måde
  // at lave streger på cirklen ved at definere længderne af de synlige og usynlige dele af stregen. 
  // Forklaret lidt mere simpelt så hvis vi har en cirkel med omkreds på 100 og vi vil vise 25% af den,
  // så sætter vi strokeDasharray til "25 75", hvilket betyder at 25 enheder af cirklen er synlige og 75 enheder er usynlige. 
  // Circumference er omkredsen af cirklen og normalPercent og luxuryPercent er de procenter vi har udregnet i ViewModel i filen wheelCalculations.js baseret på brugerens budget.
  const normalLen = CIRCUMFERENCE * normalPercent;
  const luxuryLen = CIRCUMFERENCE * luxuryPercent;

  // Det farven på "tilbage" teksten i bunden af hjulet som hentes fra vores tema 
  // som er lavet i styles mappen
  const remainingColor = isOverBudget
    ? theme.colors.danger
    : theme.colors.textPrimary;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Budgethjul</Text>

      <View style={styles.wheelWrap}>
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          {/* Baggrundsringen (det grå hjul), som viser det der er tilbage i rådighedsbeløbet */}
          <Circle
            cx={WHEEL_SIZE / 2}
            cy={WHEEL_SIZE / 2}
            r={RADIUS}
            stroke={theme.colors.divider}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Almindelige udgifter (den røde del) */}
          {normalLen > 0 ? (
            <Circle
              cx={WHEEL_SIZE / 2}
              cy={WHEEL_SIZE / 2}
              r={RADIUS}
              stroke={theme.colors.primary}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={`${normalLen} ${CIRCUMFERENCE - normalLen}`}
              strokeDashoffset={0}
              fill="none"
              transform={`rotate(-90 ${WHEEL_SIZE / 2} ${WHEEL_SIZE / 2})`}
            />
          ) : null}
          {/* Luksus udgifterne (den lilla del) */}
          {luxuryLen > 0 ? (
            <Circle
              cx={WHEEL_SIZE / 2}
              cy={WHEEL_SIZE / 2}
              r={RADIUS}
              stroke={theme.colors.luxury}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={`${luxuryLen} ${CIRCUMFERENCE - luxuryLen}`}
              strokeDashoffset={-normalLen}
              fill="none"
              transform={`rotate(-90 ${WHEEL_SIZE / 2} ${WHEEL_SIZE / 2})`}
            />
          ) : null}
        </Svg>

        {/* Teksten som står i midten af hjulet */}
        <View style={styles.centerLabel}>
          <Text style={styles.centerLabelTitle}>Rådighed</Text>
          <Text style={[styles.centerLabelValue, { color: remainingColor }]}>
            {formatKr(remaining)}
          </Text>
          <Text style={styles.centerLabelSub}>af {formatKr(incomeTotal)}</Text>
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.colors.primary }]}
          />
          {/* Teksten som står under hjulet ("Almindelige" og "Lusksus" teksten)*/}
          <Text style={styles.legendText}>Almindelige</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.colors.luxury }]}
          />
          <Text style={styles.legendText}>Luksus</Text>
        </View>
      </View>
    </View>
  );
}

// Her styles til hjulet og dets elementer. Eventuelt prøv at lav nogle
// ændringer i farverne osv for at se hvordan det ser ud og hvordan det virker, hvis det ik giver mening
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  wheelWrap: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabelTitle: {
    fontSize: 12,
        fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  centerLabelValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  centerLabelSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  legendRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  summaryRow: {
    width: "100%",
    marginTop: theme.spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
  },
});
