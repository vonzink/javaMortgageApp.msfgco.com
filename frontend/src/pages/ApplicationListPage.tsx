import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '@/api/client';
import type { LoanApplication } from '@/types';
import { formatCurrencyWhole, formatDateShort } from '@/utils/formatters';
import { FilePlus, FileText, Loader2, Search, Eye } from 'lucide-react';

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

export default function ApplicationListPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await client.get<{ data: LoanApplication[] }>('/applications');
        setApplications(res.data.data || (res.data as any) || []);
      } catch {
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const filtered = applications.filter((app) => {
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      app.applicationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.borrowers?.some(
        (b) =>
          `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      app.property?.address?.street?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1">View and manage all your mortgage applications.</p>
        </div>
        <Link to="/apply" className="btn-primary flex items-center gap-2 w-fit">
          <FilePlus className="w-4 h-4" />
          New Application
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, app number, or address..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field sm:w-48"
          >
            <option value="">All Statuses</option>
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications table */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {applications.length === 0
                ? 'No applications yet'
                : 'No matching applications found'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {applications.length === 0
                ? 'Get started by creating your first mortgage application.'
                : 'Try adjusting your search or filters.'}
            </p>
            {applications.length === 0 && (
              <Link to="/apply" className="btn-primary inline-flex items-center gap-2 mt-4">
                <FilePlus className="w-4 h-4" />
                Start Application
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    App #
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Borrower
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    Property Address
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Loan Amount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => {
                  const cfg = statusConfig[app.status] || statusConfig.DRAFT;
                  const primaryBorrower = app.borrowers?.find((b) => b.isPrimary) || app.borrowers?.[0];
                  const borrowerName = primaryBorrower
                    ? `${primaryBorrower.firstName} ${primaryBorrower.lastName}`
                    : 'N/A';
                  const propertyAddr = app.property?.address
                    ? `${app.property.address.street}, ${app.property.address.city}, ${app.property.address.state}`
                    : 'Not specified';

                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {app.applicationNumber || `#${app.id}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{borrowerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell max-w-[200px] truncate">
                        {propertyAddr}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrencyWhole(app.loanAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        {formatDateShort(app.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/applications/${app.id}`}
                          className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
