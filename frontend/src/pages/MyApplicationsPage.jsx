import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  Building2,
  MapPin,
  Download,
  XCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [withdrawingApp, setWithdrawingApp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const res = await api.get('/candidate/applications');
      setApplications(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load applications:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawingApp) return;
    setActionLoading(true);
    try {
      await api.patch(`/candidate/applications/${withdrawingApp.id}/withdraw`);
      setWithdrawingApp(null);
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadResume = async (e, appId) => {
    e.stopPropagation();
    try {
      const res = await api.get(`/applications/${appId}/resume`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Submitted_Resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Could not download resume file.');
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      APPLIED: {
        bg: 'bg-violet-50 dark:bg-violet-500/15',
        text: 'text-violet-700 dark:text-violet-400',
        border: 'border-violet-200 dark:border-violet-500/30',
        label: 'Applied',
      },
      SHORTLISTED: {
        bg: 'bg-cyan-50 dark:bg-cyan-500/15',
        text: 'text-cyan-700 dark:text-cyan-400',
        border: 'border-cyan-200 dark:border-cyan-500/30',
        label: 'Shortlisted',
      },
      INTERVIEW: {
        bg: 'bg-amber-50 dark:bg-amber-500/15',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-500/30',
        label: 'Interview Round',
      },
      SELECTED: {
        bg: 'bg-emerald-50 dark:bg-emerald-500/15',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-500/30',
        label: 'Selected / Hired',
      },
      REJECTED: {
        bg: 'bg-rose-50 dark:bg-rose-500/15',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-500/30',
        label: 'Not Selected',
      },
      WITHDRAWN: {
        bg: 'bg-slate-100 dark:bg-slate-700/20',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-600/30',
        label: 'Withdrawn',
      },
    };

    const cfg = configs[status] || configs.APPLIED;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {cfg.label}
      </span>
    );
  };

  const filteredApps = applications.filter((app) => {
    if (filter === 'ACTIVE') return app.status === 'APPLIED' || app.status === 'SHORTLISTED';
    if (filter === 'INTERVIEW') return app.status === 'INTERVIEW';
    if (filter === 'SELECTED') return app.status === 'SELECTED';
    if (filter === 'WITHDRAWN') return app.status === 'WITHDRAWN';
    return true;
  });

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          to="/candidate/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          My Applications
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Live tracking and real-time status updates across all your job submissions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
        {['ALL', 'ACTIVE', 'INTERVIEW', 'SELECTED', 'WITHDRAWN'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filter === tab
                ? 'bg-violet-100 text-violet-800 border border-violet-300 dark:bg-violet-600/25 dark:text-violet-300 dark:border-violet-500/40 shadow-sm dark:shadow-glow-violet'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab} (
            {tab === 'ALL'
              ? applications.length
              : tab === 'ACTIVE'
              ? applications.filter((a) => a.status === 'APPLIED' || a.status === 'SHORTLISTED').length
              : applications.filter((a) => a.status === tab).length}
            )
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : filteredApps.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-slate-200 dark:border-white/10 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <FileText className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            No {filter !== 'ALL' ? filter.toLowerCase() : ''} applications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Explore verified open roles and apply with 1-click using your default resume.
          </p>
          <Link to="/jobs">
            <Button variant="primary" size="md" icon={Briefcase}>
              Browse Open Jobs
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <Card key={app.id} hover={true} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: Job Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="text-lg font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
                    >
                      {app.jobTitle}
                    </Link>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                      {app.companyName}
                    </span>
                    {app.jobLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        {app.jobLocation}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-white/10">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Download}
                    onClick={(e) => handleDownloadResume(e, app.id)}
                    title="Download Submitted Resume"
                  >
                    Resume
                  </Button>

                  <Link to={`/jobs/${app.jobId}`}>
                    <Button variant="outline" size="sm" icon={ArrowRight}>
                      Job Details
                    </Button>
                  </Link>

                  {app.status !== 'WITHDRAWN' && app.status !== 'SELECTED' && app.status !== 'REJECTED' && (
                    <button
                      onClick={() => setWithdrawingApp(app)}
                      title="Withdraw Application"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Confirm Withdraw Modal */}
      <Modal
        isOpen={Boolean(withdrawingApp)}
        onClose={() => setWithdrawingApp(null)}
        title="Confirm Application Withdrawal"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to withdraw your application for{' '}
            <strong>{withdrawingApp?.jobTitle}</strong> at{' '}
            <strong>{withdrawingApp?.companyName}</strong>?
          </p>
          <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Withdrawing marks your application as inactive. The employer will be notified of your decision.
            </span>
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" size="sm" onClick={() => setWithdrawingApp(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={actionLoading}
              onClick={handleWithdraw}
            >
              Confirm Withdraw
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
