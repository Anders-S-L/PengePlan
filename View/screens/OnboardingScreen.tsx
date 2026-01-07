import React from 'react';
import { useState } from "react";
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

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
                <TouchableOpacity 
                style={styles.button} onPress={() => {
                  if (currentStep < totalSteps - 1) {
                    setCurrentStep((prev) => prev + 1);
                }
              }}
              >
                    <Text style={styles.buttonText}>
                        {currentStep === totalSteps - 1 ? "Næste" : "Kom i gang"}
                    </Text>
                </TouchableOpacity>

                {/* Step Indicators */}
                <View style={styles.dotContainer}>
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        currentStep === index ? styles.activeDot : null,
                      ]}
                      />
                  ))}
                </View>
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
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 28,
    padding: 20,
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 0,
  },
  iconCircle: {
    alignSelf: "center",
    backgroundColor: "#E0D7FF",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 24,
  },
  stepsContainer: {
  backgroundColor: "rgba(79, 124, 255, 0.08)", // 👈 utydelig blå
  borderRadius: 16,
  padding: 16,
  marginTop: 4,
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
  button: {
    backgroundColor: "#4F7CFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 12,
    backgroundColor: "#4F7CFF",
  },
});