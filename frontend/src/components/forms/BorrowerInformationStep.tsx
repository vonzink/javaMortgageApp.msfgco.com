import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { LoanApplicationFormData, Borrower, Residence } from '@/types';
import { createDefaultBorrower, createDefaultResidence } from '@/utils/fieldArrayHelpers';
import { formatSSNInput, formatPhoneInput } from '@/utils/formatters';
import AddressField from '@/components/form-fields/AddressField';
import FormSection from '@/components/shared/FormSection';
import { Users, Plus, Trash2, MapPin } from 'lucide-react';

interface BorrowerInformationStepProps {
  form: UseFormReturn<LoanApplicationFormData>;
}

export default function BorrowerInformationStep({ form }: BorrowerInformationStepProps) {
  const { watch, setValue } = form;
  const borrowers = watch('borrowers');
  const [activeBorrowerIndex, setActiveBorrowerIndex] = useState(0);

  const updateBorrower = (index: number, field: keyof Borrower, value: any) => {
    const updated = [...borrowers];
    (updated[index] as any)[field] = value;
    setValue('borrowers', updated);
  };

  const addCoBorrower = () => {
    setValue('borrowers', [...borrowers, createDefaultBorrower(false)]);
    setActiveBorrowerIndex(borrowers.length);
  };

  const removeCoBorrower = (index: number) => {
    if (index === 0) return; // Cannot remove primary borrower
    const updated = borrowers.filter((_, i) => i !== index);
    setValue('borrowers', updated);
    if (activeBorrowerIndex >= updated.length) {
      setActiveBorrowerIndex(updated.length - 1);
    }
  };

  const addResidence = (borrowerIndex: number) => {
    const updated = [...borrowers];
    updated[borrowerIndex].residences = [
      ...updated[borrowerIndex].residences,
      createDefaultResidence(),
    ];
    setValue('borrowers', updated);
  };

  const removeResidence = (borrowerIndex: number, resIndex: number) => {
    const updated = [...borrowers];
    updated[borrowerIndex].residences = updated[borrowerIndex].residences.filter(
      (_, i) => i !== resIndex
    );
    setValue('borrowers', updated);
  };

  const updateResidence = (
    borrowerIndex: number,
    resIndex: number,
    field: keyof Residence,
    value: any
  ) => {
    const updated = [...borrowers];
    (updated[borrowerIndex].residences[resIndex] as any)[field] = value;
    setValue('borrowers', updated);
  };

  const borrower = borrowers[activeBorrowerIndex];
  if (!borrower) return null;

  return (
    <div>
      <FormSection
        title="Borrower Information"
        description="Provide information about the borrower(s) on this loan."
        icon={Users}
      >
        {/* Borrower tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {borrowers.map((b, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveBorrowerIndex(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                index === activeBorrowerIndex
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {b.isPrimary ? 'Primary Borrower' : `Co-Borrower ${index}`}
              {index > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCoBorrower(index);
                  }}
                  className="ml-1 hover:text-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={addCoBorrower}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Co-Borrower
          </button>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={borrower.firstName}
                onChange={(e) => updateBorrower(activeBorrowerIndex, 'firstName', e.target.value)}
                className="input-field"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="label">Middle Name</label>
              <input
                type="text"
                value={borrower.middleName || ''}
                onChange={(e) => updateBorrower(activeBorrowerIndex, 'middleName', e.target.value)}
                className="input-field"
                placeholder="Middle name"
              />
            </div>
            <div>
              <label className="label">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={borrower.lastName}
                onChange={(e) => updateBorrower(activeBorrowerIndex, 'lastName', e.target.value)}
                className="input-field"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">
                SSN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formatSSNInput(borrower.ssn)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
                  updateBorrower(activeBorrowerIndex, 'ssn', raw);
                }}
                className="input-field"
                placeholder="XXX-XX-XXXX"
                maxLength={11}
              />
            </div>
            <div>
              <label className="label">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={borrower.dateOfBirth}
                onChange={(e) => updateBorrower(activeBorrowerIndex, 'dateOfBirth', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                Marital Status <span className="text-red-500">*</span>
              </label>
              <select
                value={borrower.maritalStatus}
                onChange={(e) => updateBorrower(activeBorrowerIndex, 'maritalStatus', e.target.value)}
                className="select-field"
              >
                <option value="">Select...</option>
                <option value="Married">Married</option>
                <option value="Unmarried">Unmarried</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={borrower.email}
                onChange={(e) => updateBorrower(activeBorrowerIndex, 'email', e.target.value)}
                className="input-field"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="label">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formatPhoneInput(borrower.phone)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
                  updateBorrower(activeBorrowerIndex, 'phone', raw);
                }}
                className="input-field"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Citizenship</label>
              <select
                value={borrower.citizenship}
                onChange={(e) => updateBorrower(activeBorrowerIndex, 'citizenship', e.target.value)}
                className="select-field"
              >
                <option value="">Select...</option>
                <option value="US Citizen">US Citizen</option>
                <option value="Permanent Resident">Permanent Resident</option>
                <option value="Non-Permanent Resident">Non-Permanent Resident</option>
              </select>
            </div>
            <div>
              <label className="label">Number of Dependents</label>
              <input
                type="number"
                min={0}
                max={20}
                value={borrower.numberOfDependents}
                onChange={(e) =>
                  updateBorrower(activeBorrowerIndex, 'numberOfDependents', parseInt(e.target.value) || 0)
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Dependent Ages</label>
              <input
                type="text"
                value={borrower.dependentAges || ''}
                onChange={(e) => updateBorrower(activeBorrowerIndex, 'dependentAges', e.target.value)}
                className="input-field"
                placeholder="e.g., 5, 8, 12"
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Residence History */}
      <FormSection
        title="Residence History"
        description="List your current and previous addresses for the past 2 years."
        icon={MapPin}
      >
        {borrower.residences.map((residence, resIndex) => (
          <div
            key={resIndex}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">
                {resIndex === 0 ? 'Current Address' : `Previous Address ${resIndex}`}
              </h4>
              {resIndex > 0 && (
                <button
                  type="button"
                  onClick={() => removeResidence(activeBorrowerIndex, resIndex)}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            <AddressField
              value={residence.address}
              onChange={(addr) => {
                const updated = [...borrowers];
                updated[activeBorrowerIndex].residences[resIndex].address = addr;
                setValue('borrowers', updated);
              }}
              required={resIndex === 0}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label">Housing Type</label>
                <select
                  value={residence.residencyType}
                  onChange={(e) =>
                    updateResidence(activeBorrowerIndex, resIndex, 'residencyType', e.target.value)
                  }
                  className="select-field"
                >
                  <option value="">Select...</option>
                  <option value="Own">Own</option>
                  <option value="Rent">Rent</option>
                  <option value="Living Rent Free">Living Rent Free</option>
                </select>
              </div>
              <div>
                <label className="label">Monthly Payment</label>
                <input
                  type="number"
                  min={0}
                  value={residence.monthlyPayment || ''}
                  onChange={(e) =>
                    updateResidence(
                      activeBorrowerIndex,
                      resIndex,
                      'monthlyPayment',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="label">Move-in Date</label>
                <input
                  type="date"
                  value={residence.startDate}
                  onChange={(e) =>
                    updateResidence(activeBorrowerIndex, resIndex, 'startDate', e.target.value)
                  }
                  className="input-field"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addResidence(activeBorrowerIndex)}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Previous Address
        </button>
      </FormSection>
    </div>
  );
}
