import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'Loan Info' },
  { number: 2, label: 'Borrower' },
  { number: 3, label: 'Property' },
  { number: 4, label: 'Employment' },
  { number: 5, label: 'Assets' },
  { number: 6, label: 'Declarations' },
  { number: 7, label: 'Review' },
];

interface ProgressIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable = onStepClick && step.number <= currentStep;

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.number)}
                  disabled={!isClickable}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all
                    ${
                      isCompleted
                        ? 'bg-brand-600 text-white cursor-pointer hover:bg-brand-700'
                        : isCurrent
                        ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                        : 'bg-gray-200 text-gray-500'
                    }
                    ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.number}
                </button>
                <span
                  className={`mt-1.5 text-[10px] sm:text-xs font-medium text-center leading-tight ${
                    isCurrent
                      ? 'text-brand-700'
                      : isCompleted
                      ? 'text-brand-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 sm:mx-2 mt-[-1rem] ${
                    step.number < currentStep ? 'bg-brand-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
