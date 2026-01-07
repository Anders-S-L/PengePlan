import { useState } from "react";

export function useOnboardingViewModel() {
    const totalSteps = 4;
    const [currentStep, setCurrentStep] = useState(0);

    const isLastStep = () => currentStep === totalSteps - 1;

    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
        }

    };

    return {
        currentStep,
        nextStep,
        isLastStep,
        totalSteps,
    };
}
