import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import client from '@/api/client';
import type { LoanApplication, DocumentRecord } from '@/types';
import {
  formatCurrencyWhole,
  formatCurrency,
  formatDate,
  formatSSN,
  formatPhone,
  formatFileSize,
} from '@/utils/formatters';
import {
  ArrowLeft,
  Loader2,
  Upload,
  Download,
  Trash2,
  FileText,
  Home,
  Users,
  Briefcase,
  DollarSign,
  ClipboardList,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import FormSection from '@/components/shared/FormSection';

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  DRAFT: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-700' },
  SUBMITTED: { label: 'Submitted', bg: 'bg-blue-100', text: 'text-blue-700' },
  PROCESSING: { label: 'Processing', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  UNDERWRITING: { label: 'Underwriting', bg: 'bg-purple-100', text: 'text-purple-700' },
  APPROVED: { label: 'Approved', bg: 'bg-green-100', text: 'text-green-700' },
  CONDITIONAL: { label: 'Conditional', bg: 'bg-orange-100', text: 'text-orange-700' },
  DENIED: { label: 'Denied', bg: 'bg-red-100', text: 'text-red-700' },
  WITHDRAWN: { label: 'Withdrawn', bg: 'bg-gray-100', text: 'text-gray-500' },
  CLOSED: { label: 'Closed', bg: 'bg-gray-100', text: 'text-gray-700' },
};

const documentTypes = [
  'Pay Stubs',
  'W-2 Forms',
  'Tax Returns',
  'Bank Statements',
  'Government ID',
  'Proof of Insurance',
  'Purchase Agreement',
  'Gift Letter',
  'Divorce Decree',
  'Other',
];

export default function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchApplication = useCallback(async () => {
    try {
      const res = await client.get<LoanApplication>(`/applications/${id}`);
      setApplication(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load application');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!documentType) {
        toast.error('Please select a document type before uploading');
        return;
      }
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);
      try {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('documentType', documentType);
          await client.post(`/applications/${id}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        toast.success('Document(s) uploaded successfully');
        setDocumentType('');
        fetchApplication();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [documentType, id, fetchApplication]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleDeleteDocument = async (docId: number) => {
    try {
      await client.delete(`/applications/${id}/documents/${docId}`);
      toast.success('Document deleted');
      fetchApplication();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete document');
    }
  };

  const handleDownloadDocument = async (doc: DocumentRecord) => {
    try {
      const res = await client.get(`/applications/${id}/documents/${doc.id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download document');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="text-center py-24">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-lg font-medium text-gray-700">{error || 'Application not found'}</p>
        <Link to="/applications" className="btn-primary inline-flex items-center gap-2 mt-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Link>
      </div>
    );
  }

  const cfg = statusConfig[application.status] || statusConfig.DRAFT;
  const primaryBorrower = application.borrowers?.find((b) => b.isPrimary) || application.borrowers?.[0];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Application {application.applicationNumber || `#${application.id}`}
          </h1>
          <p className="text-gray-500 mt-1">Created {formatDate(application.createdAt)}</p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cfg.bg} ${cfg.text} w-fit`}
        >
          {cfg.label}
        </span>
      </div>

      {/* Loan Information */}
      <div className="card">
        <FormSection title="Loan Information" icon={DollarSign}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Loan Purpose</p>
              <p className="font-medium">{application.loanPurpose || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loan Type</p>
              <p className="font-medium">{application.loanType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loan Amount</p>
              <p className="font-medium">{formatCurrencyWhole(application.loanAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Property Value</p>
              <p className="font-medium">{formatCurrencyWhole(application.propertyValue)}</p>
            </div>
          </div>
        </FormSection>
      </div>

      {/* Property */}
      {application.property && (
        <div className="card">
          <FormSection title="Property Details" icon={Home}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-2 lg:col-span-3">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {application.property.address.street}
                  {application.property.address.unit ? `, ${application.property.address.unit}` : ''}
                  , {application.property.address.city}, {application.property.address.state}{' '}
                  {application.property.address.zipCode}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-medium">{application.property.propertyType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year Built</p>
                <p className="font-medium">{application.property.yearBuilt || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Units</p>
                <p className="font-medium">{application.property.numberOfUnits || 1}</p>
              </div>
            </div>
          </FormSection>
        </div>
      )}

      {/* Borrowers */}
      {application.borrowers?.map((borrower, index) => (
        <div key={index} className="card">
          <FormSection
            title={borrower.isPrimary ? 'Primary Borrower' : `Co-Borrower ${index}`}
            icon={Users}
          >
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {borrower.firstName} {borrower.middleName} {borrower.lastName} {borrower.suffix}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">SSN</p>
                <p className="font-medium">{formatSSN(borrower.ssn)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{formatDate(borrower.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{borrower.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{formatPhone(borrower.phone)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Marital Status</p>
                <p className="font-medium">{borrower.maritalStatus || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Citizenship</p>
                <p className="font-medium">{borrower.citizenship || 'N/A'}</p>
              </div>
            </div>

            {/* Employment */}
            {borrower.employments?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4" /> Employment History
                </h4>
                <div className="space-y-3">
                  {borrower.employments.map((emp, empIdx) => (
                    <div key={empIdx} className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Employer</p>
                          <p className="font-medium">{emp.employerName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Position</p>
                          <p className="font-medium">{emp.position}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Monthly Income</p>
                          <p className="font-medium">{formatCurrency(emp.monthlyIncome)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-medium">
                            {emp.startDate ? formatDate(emp.startDate) : 'N/A'} -{' '}
                            {emp.isCurrent ? 'Present' : emp.endDate ? formatDate(emp.endDate) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FormSection>
        </div>
      ))}

      {/* Assets & Liabilities Summary */}
      {(application.assets?.length > 0 || application.liabilities?.length > 0) && (
        <div className="card">
          <FormSection title="Assets & Liabilities" icon={ClipboardList}>
            {application.assets?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Assets</h4>
                <div className="space-y-2">
                  {application.assets.map((asset, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm">
                      <span>
                        {asset.type} - {asset.institution}
                      </span>
                      <span className="font-medium">{formatCurrency(asset.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {application.liabilities?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Liabilities</h4>
                <div className="space-y-2">
                  {application.liabilities.map((liability, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm">
                      <span>
                        {liability.type} - {liability.creditor}
                      </span>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(liability.unpaidBalance)}</span>
                        <span className="text-gray-500 ml-2">
                          ({formatCurrency(liability.monthlyPayment)}/mo)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FormSection>
        </div>
      )}

      {/* Documents */}
      <div className="card">
        <FormSection title="Documents" icon={FileText}>
          {/* Upload area */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="select-field sm:w-64"
              >
                <option value="">Select document type...</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-brand-400 bg-brand-50'
                  : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                  <span className="text-gray-600">Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? 'Drop files here...'
                      : 'Drag & drop files here, or click to browse'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, DOCX, PNG, JPG (max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Document list */}
          {application.documents?.length > 0 ? (
            <div className="space-y-2">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.originalName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.documentType} - {formatFileSize(doc.fileSize)} -{' '}
                        {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-1.5 text-gray-400 hover:text-brand-600 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No documents uploaded yet.</p>
          )}
        </FormSection>
      </div>
    </div>
  );
}
