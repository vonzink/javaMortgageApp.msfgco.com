import { useState, useCallback, useMemo } from 'react';

const TOTAL_STEPS = 7;

export function useFormSteps(total: number = TOTAL_STEPS) {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, total));
  }, [total]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= total) {
        setCurrentStep(step);
      }
    },
    [total]
  );

  const helpers = useMemo(
    () => ({
      currentStep,
      totalSteps: total,
      nextStep,
      prevStep,
      goToStep,
      canGoNext: currentStep < total,
      canGoPrev: currentStep > 1,
      isLastStep: currentStep === total,
      isFirstStep: currentStep === 1,
    }),
    [currentStep, total, nextStep, prevStep, goToStep]
  );

  return helpers;
}
