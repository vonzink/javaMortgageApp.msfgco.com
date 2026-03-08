import { useState, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { LoanApplicationFormData, Employment } from '@/types';
import { createDefaultEmployment } from '@/utils/fieldArrayHelpers';
import { formatPhoneInput } from '@/utils/formatters';
import AddressField from '@/components/form-fields/AddressField';
import CurrencyInput from '@/components/form-fields/CurrencyInput';
import FormSection from '@/components/shared/FormSection';
import { Briefcase, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface EmploymentStepProps {
  form: UseFormReturn<LoanApplicationFormData>;
}

export default function EmploymentStep({ form }: EmploymentStepProps) {
  const { watch, setValue } = form;
  const borrowers = watch('borrowers');
  const [activeBorrowerIndex, setActiveBorrowerIndex] = useState(0);

  const borrower = borrowers[activeBorrowerIndex];

  const totalEmploymentMonths = useMemo(() => {
    if (!borrower) return 0;
    return borrower.employments.reduce((sum, emp) => {
      if (!emp.startDate) return sum;
      const start = new Date(emp.startDate);
      const end = emp.isCurrent ? new Date() : emp.endDate ? new Date(emp.endDate) : new Date();
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      return sum + Math.max(0, months);
    }, 0);
  }, [borrower]);

  if (!borrower) return null;

  const updateEmployment = (empIndex: number, field: keyof Employment, value: any) => {
    const updated = [...borrowers];
    (updated[activeBorrowerIndex].employments[empIndex] as any)[field] = value;
    setValue('borrowers', updated);
  };

  const addEmployment = () => {
    const updated = [...borrowers];
    updated[activeBorrowerIndex].employments = [
      ...updated[activeBorrowerIndex].employments,
      createDefaultEmployment(),
    ];
    setValue('borrowers', updated);
  };

  const removeEmployment = (empIndex: number) => {
    const updated = [...borrowers];
    updated[activeBorrowerIndex].employments = updated[activeBorrowerIndex].employments.filter(
      (_, i) => i !== empIndex
    );
    setValue('borrowers', updated);
  };

  return (
    <div>
      <FormSection
        title="Employment & Income"
        description="Provide a 2-year employment history for each borrower."
        icon={Briefcase}
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

        {/* Employment history warning */}
        {totalEmploymentMonths < 24 && borrower.employments.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Employment history is less than 2 years
              </p>
              <p className="text-sm text-yellow-700 mt-0.5">
                Current total: {totalEmploymentMonths} months. Lenders typically require a minimum of 24
                months of employment history. Please add additional employment entries.
              </p>
            </div>
          </div>
        )}

        {/* Employment entries */}
        {borrower.employments.map((emp, empIndex) => (
          <div
            key={empIndex}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">
                {emp.isCurrent ? 'Current Employer' : `Previous Employer ${empIndex}`}
              </h4>
              {borrower.employments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmployment(empIndex)}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">
                  Employer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emp.employerName}
                  onChange={(e) => updateEmployment(empIndex, 'employerName', e.target.value)}
                  className="input-field"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="label">Position / Title</label>
                <input
                  type="text"
                  value={emp.position}
                  onChange={(e) => updateEmployment(empIndex, 'position', e.target.value)}
                  className="input-field"
                  placeholder="Job title"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={formatPhoneInput(emp.phone)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
                    updateEmployment(empIndex, 'phone', raw);
                  }}
                  className="input-field"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="label">Employment Status</label>
                <select
                  value={emp.employmentStatus}
                  onChange={(e) => updateEmployment(empIndex, 'employmentStatus', e.target.value)}
                  className="select-field"
                >
                  <option value="">Select...</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Seasonal">Seasonal</option>
                  <option value="Self-Employed">Self-Employed</option>
                </select>
              </div>
            </div>

            <AddressField
              value={emp.address}
              onChange={(addr) => {
                const updated = [...borrowers];
                updated[activeBorrowerIndex].employments[empIndex].address = addr;
                setValue('borrowers', updated);
              }}
              prefix="Employer"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={emp.startDate}
                  onChange={(e) => updateEmployment(empIndex, 'startDate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  type="date"
                  value={emp.endDate || ''}
                  onChange={(e) => updateEmployment(empIndex, 'endDate', e.target.value)}
                  className="input-field"
                  disabled={emp.isCurrent}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    checked={emp.isCurrent}
                    onChange={(e) => {
                      updateEmployment(empIndex, 'isCurrent', e.target.checked);
                      if (e.target.checked) {
                        updateEmployment(empIndex, 'endDate', '');
                      }
                    }}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Currently employed here</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                label="Monthly Income"
                value={emp.monthlyIncome}
                onChange={(val) => updateEmployment(empIndex, 'monthlyIncome', val)}
                placeholder="0.00"
              />
              <div className="flex items-end">
                <label className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    checked={emp.isSelfEmployed}
                    onChange={(e) => updateEmployment(empIndex, 'isSelfEmployed', e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Self-employed</span>
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addEmployment}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Previous Employer
        </button>
      </FormSection>
    </div>
  );
}
