import { UseFormReturn } from 'react-hook-form';
import type { LoanApplicationFormData } from '@/types';
import CurrencyInput from '@/components/form-fields/CurrencyInput';
import FormSection from '@/components/shared/FormSection';
import { DollarSign } from 'lucide-react';

interface LoanInformationStepProps {
  form: UseFormReturn<LoanApplicationFormData>;
}

export default function LoanInformationStep({ form }: LoanInformationStepProps) {
  const { watch, setValue } = form;
  const loanPurpose = watch('loanPurpose');
  const loanType = watch('loanType');
  const loanAmount = watch('loanAmount');
  const propertyValue = watch('propertyValue');

  const ltv = propertyValue > 0 ? ((loanAmount / propertyValue) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <FormSection
        title="Loan Information"
        description="Tell us about the loan you are seeking."
        icon={DollarSign}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Loan Purpose */}
          <div>
            <label htmlFor="loanPurpose" className="label">
              Loan Purpose <span className="text-red-500">*</span>
            </label>
            <select
              id="loanPurpose"
              value={loanPurpose}
              onChange={(e) => setValue('loanPurpose', e.target.value as any)}
              className="select-field"
            >
              <option value="">Select purpose...</option>
              <option value="Purchase">Purchase</option>
              <option value="Refinance">Refinance</option>
              <option value="Cash-Out Refinance">Cash-Out Refinance</option>
            </select>
          </div>

          {/* Loan Type */}
          <div>
            <label htmlFor="loanType" className="label">
              Loan Type <span className="text-red-500">*</span>
            </label>
            <select
              id="loanType"
              value={loanType}
              onChange={(e) => setValue('loanType', e.target.value as any)}
              className="select-field"
            >
              <option value="">Select type...</option>
              <option value="Conventional">Conventional</option>
              <option value="FHA">FHA</option>
              <option value="VA">VA</option>
              <option value="USDA">USDA</option>
            </select>
          </div>

          {/* Loan Amount */}
          <CurrencyInput
            id="loanAmount"
            label="Loan Amount"
            value={loanAmount}
            onChange={(val) => setValue('loanAmount', val)}
            required
            placeholder="0.00"
          />

          {/* Property Value */}
          <CurrencyInput
            id="propertyValue"
            label="Estimated Property Value"
            value={propertyValue}
            onChange={(val) => setValue('propertyValue', val)}
            required
            placeholder="0.00"
          />
        </div>

        {/* LTV ratio info */}
        {propertyValue > 0 && loanAmount > 0 && (
          <div className="mt-4 p-3 bg-brand-50 border border-brand-200 rounded-lg">
            <p className="text-sm text-brand-800">
              <span className="font-medium">Loan-to-Value (LTV) Ratio:</span> {ltv}%
              {parseFloat(ltv) > 80 && (
                <span className="ml-2 text-yellow-700">
                  (Note: LTV above 80% may require mortgage insurance)
                </span>
              )}
            </p>
          </div>
        )}
      </FormSection>
    </div>
  );
}
