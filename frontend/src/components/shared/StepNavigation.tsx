import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
  isSubmitting?: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit?: () => void;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  canGoPrev,
  isLastStep,
  isSubmitting = false,
  onNext,
  onPrev,
  onSubmit,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
      <div>
        {canGoPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="btn-secondary flex items-center gap-2"
            disabled={isSubmitting}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
        )}
      </div>

      <span className="text-sm text-gray-500 font-medium">
        Step {currentStep} of {totalSteps}
      </span>

      <div>
        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Application
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="btn-primary flex items-center gap-2"
            disabled={isSubmitting}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
