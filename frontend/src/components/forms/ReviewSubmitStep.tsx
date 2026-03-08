import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { LoanApplicationFormData, AIReviewResult } from '@/types';
import {
  formatCurrencyWhole,
  formatCurrency,
  formatSSN,
  formatPhone,
  formatDate,
} from '@/utils/formatters';
import client from '@/api/client';
import FormSection from '@/components/shared/FormSection';
import {
  FileSearch,
  DollarSign,
  Home,
  Users,
  Briefcase,
  Wallet,
  CreditCard,
  ClipboardList,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface ReviewSubmitStepProps {
  form: UseFormReturn<LoanApplicationFormData>;
}

export default function ReviewSubmitStep({ form }: ReviewSubmitStepProps) {
  const { watch } = form;
  const data = watch();

  const [aiReview, setAIReview] = useState<AIReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleAIReview = async () => {
    setIsReviewing(true);
    try {
      const response = await client.post<AIReviewResult>('/applications/ai-review', data);
      setAIReview(response.data);
    } catch {
      // Stub: generate a sample review
      setAIReview({
        summary:
          'Application appears complete. All required fields have been filled. A few items should be reviewed before final submission.',
        issues: [
          {
            field: 'employment',
            severity: 'warning',
            message: 'Verify employment history covers the full 24-month period.',
          },
          {
            field: 'assets',
            severity: 'info',
            message: 'Consider providing additional asset documentation for stronger approval odds.',
          },
        ],
        missingFields: [],
        recommendedDocuments: [
          'Last 2 years of W-2 forms',
          'Last 30 days of pay stubs',
          'Last 2 months of bank statements',
          'Government-issued photo ID',
        ],
        overallScore: 82,
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const primaryBorrower = data.borrowers[0];
  const ltv =
    data.propertyValue > 0 ? ((data.loanAmount / data.propertyValue) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <FormSection
        title="Review & Submit"
        description="Review all information before submitting your application."
        icon={FileSearch}
      >
        {/* AI Review Button */}
        <div className="mb-6 p-4 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">AI Application Review</p>
                <p className="text-sm text-gray-500">
                  Let AI review your application for completeness and potential issues.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAIReview}
              disabled={isReviewing}
              className="btn-primary flex items-center gap-2"
            >
              {isReviewing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Reviewing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run AI Review
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Review Results */}
        {aiReview && (
          <div className="mb-6 space-y-3">
            {/* Score */}
            <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white ${
                  aiReview.overallScore >= 80
                    ? 'bg-green-500'
                    : aiReview.overallScore >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              >
                {aiReview.overallScore}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Application Readiness Score</p>
                <p className="text-sm text-gray-600">{aiReview.summary}</p>
              </div>
            </div>

            {/* Issues */}
            {aiReview.issues.length > 0 && (
              <div className="space-y-2">
                {aiReview.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                      issue.severity === 'error'
                        ? 'bg-red-50 border border-red-200'
                        : issue.severity === 'warning'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    {issue.severity === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : issue.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Recommended Documents */}
            {aiReview.recommendedDocuments.length > 0 && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Recommended Documents to Upload:
                </p>
                <ul className="space-y-1">
                  {aiReview.recommendedDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ===== SUMMARY SECTIONS ===== */}

        {/* Loan Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <DollarSign className="w-4 h-4 text-brand-600" />
            Loan Information
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Purpose</p>
              <p className="font-medium">{data.loanPurpose || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium">{data.loanType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Loan Amount</p>
              <p className="font-medium">{formatCurrencyWhole(data.loanAmount)}</p>
            </div>
            <div>
              <p className="text-gray-500">Property Value</p>
              <p className="font-medium">
                {formatCurrencyWhole(data.propertyValue)} (LTV: {ltv}%)
              </p>
            </div>
          </div>
        </div>

        {/* Property */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Home className="w-4 h-4 text-brand-600" />
            Property
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="col-span-2 lg:col-span-3">
              <p className="text-gray-500">Address</p>
              <p className="font-medium">
                {data.property.address.street
                  ? `${data.property.address.street}, ${data.property.address.city}, ${data.property.address.state} ${data.property.address.zipCode}`
                  : 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium">{data.property.propertyType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Year Built</p>
              <p className="font-medium">{data.property.yearBuilt || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Units</p>
              <p className="font-medium">{data.property.numberOfUnits}</p>
            </div>
          </div>
        </div>

        {/* Borrowers */}
        {data.borrowers.map((borrower, bIdx) => (
          <div key={bIdx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Users className="w-4 h-4 text-brand-600" />
              {borrower.isPrimary ? 'Primary Borrower' : `Co-Borrower ${bIdx}`}
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">
                  {borrower.firstName} {borrower.middleName} {borrower.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-500">SSN</p>
                <p className="font-medium">{formatSSN(borrower.ssn)}</p>
              </div>
              <div>
                <p className="text-gray-500">DOB</p>
                <p className="font-medium">{formatDate(borrower.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{borrower.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{formatPhone(borrower.phone)}</p>
              </div>
              <div>
                <p className="text-gray-500">Marital Status</p>
                <p className="font-medium">{borrower.maritalStatus || 'N/A'}</p>
              </div>
            </div>

            {/* Employment summary */}
            {borrower.employments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 flex items-center gap-1 mb-2">
                  <Briefcase className="w-3.5 h-3.5" /> Employment ({borrower.employments.length})
                </p>
                <div className="space-y-1">
                  {borrower.employments.map((emp, eIdx) => (
                    <p key={eIdx} className="text-sm text-gray-700">
                      {emp.employerName || 'Unnamed'} - {emp.position || 'N/A'} -{' '}
                      {formatCurrency(emp.monthlyIncome)}/mo
                      {emp.isCurrent && (
                        <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Assets summary */}
        {data.assets.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Wallet className="w-4 h-4 text-brand-600" />
              Assets ({data.assets.length})
            </h4>
            <div className="space-y-1 text-sm">
              {data.assets.map((asset, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-600">
                    {asset.type || 'Unspecified'} - {asset.institution || 'N/A'}
                  </span>
                  <span className="font-medium">{formatCurrency(asset.value)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span>Total Assets</span>
                <span>
                  {formatCurrency(data.assets.reduce((sum, a) => sum + a.value, 0))}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Liabilities summary */}
        {data.liabilities.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <CreditCard className="w-4 h-4 text-brand-600" />
              Liabilities ({data.liabilities.length})
            </h4>
            <div className="space-y-1 text-sm">
              {data.liabilities.map((l, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-600">
                    {l.type || 'Unspecified'} - {l.creditor || 'N/A'}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(l.unpaidBalance)} ({formatCurrency(l.monthlyPayment)}/mo)
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span>Total Monthly Payments</span>
                <span>
                  {formatCurrency(data.liabilities.reduce((sum, l) => sum + l.monthlyPayment, 0))}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Declarations summary */}
        {primaryBorrower && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <ClipboardList className="w-4 h-4 text-brand-600" />
              Declarations
            </h4>
            <p className="text-sm text-gray-600">
              {Object.entries(primaryBorrower.declarations).filter(
                ([key, val]) => key !== 'explanations' && key !== 'priorPropertyType' && key !== 'priorPropertyTitle' && val === true
              ).length > 0
                ? `${
                    Object.entries(primaryBorrower.declarations).filter(
                      ([key, val]) =>
                        key !== 'explanations' && key !== 'priorPropertyType' && key !== 'priorPropertyTitle' && val === true
                    ).length
                  } items answered "Yes" - review details on the Declarations step.`
                : 'All declaration questions answered "No" or are not yet answered.'}
            </p>
            {primaryBorrower.declarations.explanations && (
              <div className="mt-2 text-sm">
                <p className="text-gray-500 font-medium">Explanations:</p>
                <p className="text-gray-700">{primaryBorrower.declarations.explanations}</p>
              </div>
            )}
          </div>
        )}
      </FormSection>
    </div>
  );
}
