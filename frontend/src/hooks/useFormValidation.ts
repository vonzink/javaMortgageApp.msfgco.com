import { useCallback } from 'react';
import type { LoanApplicationFormData } from '@/types';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function useFormValidation() {
  const validateStep = useCallback(
    (stepNumber: number, formData: LoanApplicationFormData): ValidationResult => {
      const errors: string[] = [];

      switch (stepNumber) {
        case 1: // Loan Information
          if (!formData.loanPurpose) errors.push('Loan purpose is required');
          if (!formData.loanType) errors.push('Loan type is required');
          if (!formData.loanAmount || formData.loanAmount <= 0) errors.push('Loan amount must be greater than zero');
          if (!formData.propertyValue || formData.propertyValue <= 0) errors.push('Property value must be greater than zero');
          if (formData.loanAmount > formData.propertyValue) errors.push('Loan amount cannot exceed property value');
          break;

        case 2: { // Borrower Information
          if (formData.borrowers.length === 0) {
            errors.push('At least one borrower is required');
            break;
          }
          formData.borrowers.forEach((borrower, index) => {
            const label = index === 0 ? 'Primary borrower' : `Co-borrower ${index}`;
            if (!borrower.firstName.trim()) errors.push(`${label}: First name is required`);
            if (!borrower.lastName.trim()) errors.push(`${label}: Last name is required`);
            if (!borrower.email.trim()) errors.push(`${label}: Email is required`);
            if (!borrower.phone.trim()) errors.push(`${label}: Phone is required`);
            if (!borrower.dateOfBirth) errors.push(`${label}: Date of birth is required`);
            if (!borrower.ssn || borrower.ssn.replace(/\D/g, '').length !== 9) {
              errors.push(`${label}: A valid 9-digit SSN is required`);
            }
            if (borrower.residences.length === 0) {
              errors.push(`${label}: At least one residence is required`);
            }
          });
          break;
        }

        case 3: // Property Details
          if (!formData.property.address.street.trim()) errors.push('Property street address is required');
          if (!formData.property.address.city.trim()) errors.push('Property city is required');
          if (!formData.property.address.state) errors.push('Property state is required');
          if (!formData.property.address.zipCode.trim()) errors.push('Property ZIP code is required');
          if (!formData.property.propertyType) errors.push('Property type is required');
          break;

        case 4: { // Employment
          formData.borrowers.forEach((borrower, index) => {
            const label = index === 0 ? 'Primary borrower' : `Co-borrower ${index}`;
            if (borrower.employments.length === 0) {
              errors.push(`${label}: At least one employment entry is required`);
            } else {
              const totalMonths = borrower.employments.reduce((sum, emp) => {
                const start = emp.startDate ? new Date(emp.startDate) : new Date();
                const end = emp.endDate ? new Date(emp.endDate) : new Date();
                return sum + Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
              }, 0);
              if (totalMonths < 24) {
                // Warning, not a blocking error
              }
              borrower.employments.forEach((emp, empIdx) => {
                if (!emp.employerName.trim()) errors.push(`${label}, Employment ${empIdx + 1}: Employer name is required`);
                if (!emp.startDate) errors.push(`${label}, Employment ${empIdx + 1}: Start date is required`);
              });
            }
          });
          break;
        }

        case 5: // Assets & Liabilities
          // Not strictly required, but validate entries that exist
          formData.assets.forEach((asset, idx) => {
            if (asset.type && (!asset.institution.trim() || asset.value <= 0)) {
              errors.push(`Asset ${idx + 1}: Institution and value are required when type is selected`);
            }
          });
          formData.liabilities.forEach((liability, idx) => {
            if (liability.type && (!liability.creditor.trim())) {
              errors.push(`Liability ${idx + 1}: Creditor is required when type is selected`);
            }
          });
          break;

        case 6: // Declarations
          // Declarations are optional yes/no; validate only that we have at least one borrower
          if (formData.borrowers.length === 0) {
            errors.push('At least one borrower is required');
          }
          break;

        case 7: // Review & Submit
          // No additional validation - all prior steps should be valid
          break;
      }

      return { valid: errors.length === 0, errors };
    },
    []
  );

  return { validateStep };
}
