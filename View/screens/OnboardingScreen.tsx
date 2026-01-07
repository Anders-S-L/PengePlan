import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';

export default function OnboardingScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                {/* Placeholder for onboarding content */}
                <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>🌟</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>Velkommen til PengePlan!</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Lad os opsætte dit månedlige budget samme. Det tager kun et øjeblik
                </Text>

                {/* Steps */}
                <View style={styles.stepsContainer}>
                <View style={styles.steps}>
                    <Step number="1" color="#4F7CFF" title="Faste indtægter" text="Indtast din løn og andre faste indtægter" />
                    <Step number="2" color="#9B5CFF" title="Faste omkostninger" text="Tilføj husleje, abonnementer og andre faste udgifter" />
                    <Step number="3" color="#4CD964" title="Klar til at bruge!" text="Dit budget er sat op og klar hver måned" />
                </View>
                </View>

                {/* CTA */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Kom i gang   →</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function Step({number, color, title, text}: {number: string; color: string; title: string; text: string}) {
    return (
        <View style={styles.step}>
            <View style={[styles.stepCircle, {backgroundColor: color}]}>
                <Text style={styles.stepNumber}>{number}</Text>
            </View>
            <View>
                <Text style={styles.stepTitle}>{title}</Text>
                <Text style={styles.stepText}>{text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#A855F7", // purple background
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 48
  },
  stepsContainer: {
  backgroundColor: "rgba(79, 124, 255, 0.08)", // 👈 utydelig blå
  borderRadius: 16,
  padding: 16,
  marginTop: 16,
},

  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 28,
    padding: 20,
  },
  iconCircle: {
    alignSelf: "center",
    backgroundColor: "#E0D7FF",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 24,
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
  },
  stepNumber: {
    color: "white",
    fontWeight: "700",
  },
  stepTitle: {
    fontWeight: "600",
    fontSize: 15
  },
  stepText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#4F7CFF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});