import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import client from '@/api/client';
import type { LoanApplication, ApplicationStats } from '@/types';
import { formatCurrencyWhole, formatDateShort } from '@/utils/formatters';
import {
  FilePlus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  FileStack,
  ArrowRight,
  Loader2,
} from 'lucide-react';

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentApps, setRecentApps] = useState<LoanApplication[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    draft: 0,
    submitted: 0,
    processing: 0,
    approved: 0,
    denied: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appsRes, statsRes] = await Promise.all([
          client.get<{ data: LoanApplication[] }>('/applications', { params: { limit: 5 } }),
          client.get<ApplicationStats>('/applications/stats'),
        ]);
        setRecentApps(appsRes.data.data || appsRes.data as any);
        setStats(statsRes.data);
      } catch {
        // Silently handle - user may have no applications yet
        setRecentApps([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Applications', value: stats.total, icon: FileStack, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Pending Review', value: stats.submitted + stats.processing, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Drafts', value: stats.draft, icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your mortgage applications and track their progress.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/apply"
          className="card flex items-center gap-4 hover:border-brand-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center group-hover:bg-brand-200 transition-colors">
            <FilePlus className="w-6 h-6 text-brand-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Start New Application</h3>
            <p className="text-sm text-gray-500">Begin a new mortgage application</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-600 transition-colors" />
        </Link>

        <Link
          to="/applications"
          className="card flex items-center gap-4 hover:border-brand-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">View Applications</h3>
            <p className="text-sm text-gray-500">Review and manage existing applications</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-600 transition-colors" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          {recentApps.length > 0 && (
            <Link to="/applications" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          </div>
        ) : recentApps.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Get started by creating your first application.
            </p>
            <Link to="/apply" className="btn-primary inline-flex items-center gap-2 mt-4">
              <FilePlus className="w-4 h-4" />
              Start Application
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Application
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Loan Amount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentApps.map((app) => {
                  const cfg = statusConfig[app.status] || statusConfig.DRAFT;
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <p className="text-sm font-medium text-gray-900">
                          {app.applicationNumber || `#${app.id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {app.borrowers?.[0]
                            ? `${app.borrowers[0].firstName} ${app.borrowers[0].lastName}`
                            : 'No borrower'}
                        </p>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {formatCurrencyWhole(app.loanAmount)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {formatDateShort(app.createdAt)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          to={`/applications/${app.id}`}
                          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                        >
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
