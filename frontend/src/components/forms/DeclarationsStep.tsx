import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { LoanApplicationFormData, Declaration } from '@/types';
import FormSection from '@/components/shared/FormSection';
import { ClipboardList } from 'lucide-react';

interface DeclarationsStepProps {
  form: UseFormReturn<LoanApplicationFormData>;
}

interface DeclarationQuestion {
  field: keyof Declaration;
  question: string;
  section: string;
}

const DECLARATION_QUESTIONS: DeclarationQuestion[] = [
  // Section A: About This Property and Your Money
  {
    field: 'primaryResidence',
    question: 'Will you occupy the property as your primary residence?',
    section: 'About This Property and Your Money',
  },
  {
    field: 'ownershipInterest',
    question: 'Have you had an ownership interest in another property in the last three years?',
    section: 'About This Property and Your Money',
  },
  {
    field: 'downPaymentBorrowed',
    question: 'Is any part of the down payment borrowed?',
    section: 'About This Property and Your Money',
  },
  {
    field: 'newCredit',
    question: 'Have you applied for any new credit (loan or credit card) that you have not disclosed?',
    section: 'About This Property and Your Money',
  },
  {
    field: 'newMortgage',
    question: 'Will this property be subject to new mortgage liens not disclosed on this application?',
    section: 'About This Property and Your Money',
  },
  {
    field: 'priorityLien',
    question: 'Is this property subject to a priority lien (e.g., clean energy lien, PACE)?',
    section: 'About This Property and Your Money',
  },
  {
    field: 'sellerRelationship',
    question: 'Do you have a family relationship or business affiliation with the seller of this property?',
    section: 'About This Property and Your Money',
  },
  {
    field: 'undisclosedBorrowing',
    question: 'Are you borrowing any money for this real estate transaction that you have not disclosed?',
    section: 'About This Property and Your Money',
  },

  // Section B: About Your Finances
  {
    field: 'outstandingJudgments',
    question: 'Are there any outstanding judgments against you?',
    section: 'About Your Finances',
  },
  {
    field: 'delinquentOnDebt',
    question: 'Are you currently delinquent or in default on a Federal debt?',
    section: 'About Your Finances',
  },
  {
    field: 'lawsuitParty',
    question: 'Are you a party to a lawsuit?',
    section: 'About Your Finances',
  },
  {
    field: 'loanForeclosureOrDefault',
    question: 'Have you conveyed title to any property in lieu of foreclosure in the past 7 years?',
    section: 'About Your Finances',
  },
  {
    field: 'propertyForeclosed',
    question: 'Have you had property foreclosed upon in the last 7 years?',
    section: 'About Your Finances',
  },
  {
    field: 'bankruptcyDeclared',
    question: 'Have you declared bankruptcy within the past 7 years?',
    section: 'About Your Finances',
  },
  {
    field: 'alimonyObligation',
    question: 'Are you obligated to pay alimony, child support, or separate maintenance?',
    section: 'About Your Finances',
  },
  {
    field: 'coSignerOnNote',
    question: 'Are you a co-signer or guarantor on any debt not disclosed on this application?',
    section: 'About Your Finances',
  },

  // Section C: About Your Citizenship
  {
    field: 'usCitizen',
    question: 'Are you a U.S. citizen?',
    section: 'About Your Citizenship',
  },
  {
    field: 'permanentResident',
    question: 'If not a U.S. citizen, are you a permanent resident alien?',
    section: 'About Your Citizenship',
  },
];

function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          value === true
            ? 'bg-brand-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          value === false
            ? 'bg-brand-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        No
      </button>
    </div>
  );
}

export default function DeclarationsStep({ form }: DeclarationsStepProps) {
  const { watch, setValue } = form;
  const borrowers = watch('borrowers');
  const [activeBorrowerIndex, setActiveBorrowerIndex] = useState(0);

  const borrower = borrowers[activeBorrowerIndex];
  if (!borrower) return null;

  const updateDeclaration = (field: keyof Declaration, value: any) => {
    const updated = [...borrowers];
    (updated[activeBorrowerIndex].declarations as any)[field] = value;
    setValue('borrowers', updated);
  };

  // Group questions by section
  const sections = DECLARATION_QUESTIONS.reduce<Record<string, DeclarationQuestion[]>>(
    (acc, q) => {
      if (!acc[q.section]) acc[q.section] = [];
      acc[q.section].push(q);
      return acc;
    },
    {}
  );

  return (
    <div>
      <FormSection
        title="Declarations"
        description="Answer the following questions for each borrower. These are required by federal law."
        icon={ClipboardList}
      >
        {/* Borrower tabs */}
        {borrowers.length > 1 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {borrowers.map((b, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveBorrowerIndex(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  index === activeBorrowerIndex
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {b.isPrimary ? 'Primary Borrower' : `Co-Borrower ${index}`}
              </button>
            ))}
          </div>
        )}

        {/* Declaration sections */}
        {Object.entries(sections).map(([sectionTitle, questions]) => (
          <div key={sectionTitle} className="mb-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              {sectionTitle}
            </h4>
            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.field}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2"
                >
                  <p className="text-sm text-gray-700 flex-1">{q.question}</p>
                  <YesNoToggle
                    value={borrower.declarations[q.field] as boolean | null}
                    onChange={(val) => updateDeclaration(q.field, val)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Explanations */}
        <div className="mt-4">
          <label className="label">
            If you answered "Yes" to any questions above, please provide explanations:
          </label>
          <textarea
            value={borrower.declarations.explanations || ''}
            onChange={(e) => updateDeclaration('explanations', e.target.value)}
            rows={4}
            className="input-field resize-y"
            placeholder="Provide details for any 'Yes' answers above..."
          />
        </div>
      </FormSection>
    </div>
  );
}
