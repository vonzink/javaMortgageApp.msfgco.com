import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { LoanApplicationFormData } from '@/types';
import { useFormSteps } from '@/hooks/useFormSteps';
import { useFormValidation } from '@/hooks/useFormValidation';
import {
  createDefaultBorrower,
  createDefaultAddress,
} from '@/utils/fieldArrayHelpers';
import client from '@/api/client';
import { toast } from 'react-toastify';

import ProgressIndicator from '@/components/shared/ProgressIndicator';
import StepNavigation from '@/components/shared/StepNavigation';
import LoanInformationStep from '@/components/forms/LoanInformationStep';
import BorrowerInformationStep from '@/components/forms/BorrowerInformationStep';
import PropertyDetailsStep from '@/components/forms/PropertyDetailsStep';
import EmploymentStep from '@/components/forms/EmploymentStep';
import AssetsLiabilitiesStep from '@/components/forms/AssetsLiabilitiesStep';
import DeclarationsStep from '@/components/forms/DeclarationsStep';
import ReviewSubmitStep from '@/components/forms/ReviewSubmitStep';

const defaultFormValues: LoanApplicationFormData = {
  loanPurpose: '',
  loanType: '',
  loanAmount: 0,
  propertyValue: 0,
  property: {
    address: createDefaultAddress(),
    propertyType: '',
    constructionType: '',
    yearBuilt: '',
    numberOfUnits: 1,
    occupancyType: '',
  },
  borrowers: [createDefaultBorrower(true)],
  assets: [],
  liabilities: [],
  reoProperties: [],
};

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const form = useForm<LoanApplicationFormData>({
    defaultValues: defaultFormValues,
    mode: 'onBlur',
  });

  const steps = useFormSteps(7);
  const { validateStep } = useFormValidation();

  const handleNext = () => {
    const formData = form.getValues();
    const result = validateStep(steps.currentStep, formData);

    if (!result.valid) {
      setValidationErrors(result.errors);
      toast.error('Please fix the errors before proceeding.');
      return;
    }

    setValidationErrors([]);
    steps.nextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setValidationErrors([]);
    steps.prevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (step: number) => {
    if (step < steps.currentStep) {
      setValidationErrors([]);
      steps.goToStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    // Validate all steps
    const formData = form.getValues();
    const allErrors: string[] = [];

    for (let s = 1; s <= 6; s++) {
      const result = validateStep(s, formData);
      if (!result.valid) {
        allErrors.push(...result.errors.map((e) => `Step ${s}: ${e}`));
      }
    }

    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      toast.error('Please review and fix errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await client.post('/applications', formData);
      const appId = response.data?.id || response.data?.data?.id;
      toast.success('Application submitted successfully!');
      navigate(appId ? `/applications/${appId}` : '/applications');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (steps.currentStep) {
      case 1:
        return <LoanInformationStep form={form} />;
      case 2:
        return <BorrowerInformationStep form={form} />;
      case 3:
        return <PropertyDetailsStep form={form} />;
      case 4:
        return <EmploymentStep form={form} />;
      case 5:
        return <AssetsLiabilitiesStep form={form} />;
      case 6:
        return <DeclarationsStep form={form} />;
      case 7:
        return <ReviewSubmitStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mortgage Application</h1>
        <p className="text-gray-500 mt-1">
          Complete all sections below. Your progress is saved as you go.
        </p>
      </div>

      {/* Progress */}
      <div className="card mb-6">
        <ProgressIndicator
          currentStep={steps.currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-800 mb-2">
            Please correct the following errors:
          </p>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step Content */}
      <div className="card">
        {renderStep()}

        <StepNavigation
          currentStep={steps.currentStep}
          totalSteps={steps.totalSteps}
          canGoNext={steps.canGoNext}
          canGoPrev={steps.canGoPrev}
          isLastStep={steps.isLastStep}
          isFirstStep={steps.isFirstStep}
          isSubmitting={isSubmitting}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
