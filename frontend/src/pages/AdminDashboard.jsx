import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building2,
  Briefcase,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  ExternalLink,
  Power,
  RefreshCw,
  Mail,
  MapPin,
  Clock,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';
import { formatSalary } from '../utils/formatSalary';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'companies' | 'jobs' | 'users'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Toast state
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmVariant: 'danger',
    confirmText: 'Confirm',
    onConfirm: () => {},
  });

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isOpen: false }));
    }, 4000);
  };

  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const [statsData, pendingData, companiesData, jobsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingCompanies(),
        adminService.getAllCompanies(),
        adminService.getAllJobs(),
        adminService.getAllUsers(),
      ]);

      setStats(statsData);
      setPendingCompanies(pendingData);
      setCompanies(companiesData);
      setJobs(jobsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Failed to fetch admin data. Please ensure backend is running.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Handlers for Company Approvals ---
  const handleApproveCompany = async (company) => {
    try {
      await adminService.approveCompany(company.id);
      showToast(`Company "${company.name}" approved successfully!`);
      fetchDashboardData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve company', 'error');
    }
  };

  const handleRejectCompany = (company) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reject Company Registration?',
      message: `Are you sure you want to reject the registration for "${company.name}" (${company.employerEmail})? They will not be permitted to post job openings.`,
      confirmVariant: 'danger',
      confirmText: 'Reject Registration',
      onConfirm: async () => {
        try {
          await adminService.rejectCompany(company.id);
          showToast(`Company "${company.name}" registration rejected`, 'info');
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          fetchDashboardData();
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to reject company', 'error');
        }
      },
    });
  };

  // --- Handlers for Company Suspension ---
  const handleToggleCompanyStatus = (company) => {
    const isSuspended = company.status === 'SUSPENDED';
    const actionText = isSuspended ? 'Reactivate' : 'Suspend';

    setConfirmModal({
      isOpen: true,
      title: `${actionText} Company?`,
      message: isSuspended
        ? `Reactivating "${company.name}" will restore its active status and restore its visible job listings to candidates.`
        : `Suspending "${company.name}" will immediately hide all its job postings from candidates and prevent the employer from logging in or creating postings.`,
      confirmVariant: isSuspended ? 'primary' : 'danger',
      confirmText: `${actionText} Company`,
      onConfirm: async () => {
        try {
          if (isSuspended) {
            await adminService.reactivateCompany(company.id);
            showToast(`Company "${company.name}" reactivated successfully!`);
          } else {
            await adminService.suspendCompany(company.id);
            showToast(`Company "${company.name}" suspended. Postings hidden.`, 'info');
          }
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          fetchDashboardData();
        } catch (err) {
          showToast(err.response?.data?.message || `Failed to ${actionText.toLowerCase()} company`, 'error');
        }
      },
    });
  };

  // --- Handlers for Job Suspension ---
  const handleToggleJobStatus = (job) => {
    const isSuspended = job.status === 'SUSPENDED';
    const actionText = isSuspended ? 'Reactivate' : 'Suspend';

    setConfirmModal({
      isOpen: true,
      title: `${actionText} Job Posting?`,
      message: isSuspended
        ? `Reactivating "${job.title}" at ${job.companyName} will make it visible again in candidate job searches.`
        : `Suspending "${job.title}" at ${job.companyName} will hide it from public job searches and candidate applications.`,
      confirmVariant: isSuspended ? 'primary' : 'danger',
      confirmText: `${actionText} Job`,
      onConfirm: async () => {
        try {
          if (isSuspended) {
            await adminService.reactivateJob(job.id);
            showToast(`Job "${job.title}" reactivated!`);
          } else {
            await adminService.suspendJob(job.id);
            showToast(`Job "${job.title}" suspended. Hidden from candidates.`, 'info');
          }
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          fetchDashboardData();
        } catch (err) {
          showToast(err.response?.data?.message || `Failed to ${actionText.toLowerCase()} job`, 'error');
        }
      },
    });
  };

  // --- Handlers for User Suspension ---
  const handleToggleUserStatus = (targetUser) => {
    if (targetUser.id === user?.id) {
      showToast('You cannot suspend your own administrator account!', 'error');
      return;
    }

    const isSuspended = targetUser.status === 'SUSPENDED';
    const actionText = isSuspended ? 'Reactivate' : 'Suspend';

    setConfirmModal({
      isOpen: true,
      title: `${actionText} User Account?`,
      message: isSuspended
        ? `Reactivating ${targetUser.name} (${targetUser.email}) will restore their ability to log in and use Hireloop.`
        : `Suspending ${targetUser.name} (${targetUser.email}) will immediately block them from logging in.`,
      confirmVariant: isSuspended ? 'primary' : 'danger',
      confirmText: `${actionText} Account`,
      onConfirm: async () => {
        try {
          if (isSuspended) {
            await adminService.reactivateUser(targetUser.id);
            showToast(`User account "${targetUser.name}" reactivated!`);
          } else {
            await adminService.suspendUser(targetUser.id);
            showToast(`User account "${targetUser.name}" suspended. Access revoked.`, 'info');
          }
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          fetchDashboardData();
        } catch (err) {
          showToast(err.response?.data?.message || `Failed to ${actionText.toLowerCase()} user`, 'error');
        }
      },
    });
  };

  // Filtered queries
  const filteredCompanies = companies.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q) ||
      c.employerEmail?.toLowerCase().includes(q) ||
      c.employerName?.toLowerCase().includes(q)
    );
  });

  const filteredJobs = jobs.filter((j) => {
    const q = searchQuery.toLowerCase();
    return (
      j.title?.toLowerCase().includes(q) ||
      j.companyName?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            {confirmModal.message}
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              variant={confirmModal.confirmVariant}
              size="sm"
              onClick={confirmModal.onConfirm}
            >
              {confirmModal.confirmText}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold mb-3 border border-rose-500/20">
            <Shield className="w-3.5 h-3.5" /> Administrative Control Centre
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Oversee employer verification, company status, job listings, and user accounts.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchDashboardData(true)}
            loading={refreshing}
            icon={RefreshCw}
            className="border border-white/10"
          >
            Refresh
          </Button>
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            {user?.email}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? <SkeletonLoader className="h-8 w-16" /> : stats?.totalUsers || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>{stats?.totalCandidates || 0} Candidates</span>
            <span>â€¢</span>
            <span>{stats?.totalEmployers || 0} Employers</span>
          </p>
        </Card>

        <Card className="hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {loading ? <SkeletonLoader className="h-8 w-16" /> : stats?.pendingCompanies || 0}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-1">
            Companies awaiting your review
          </p>
        </Card>

        <Card className="hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Companies</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? <SkeletonLoader className="h-8 w-16" /> : stats?.totalCompanies || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {stats?.approvedCompanies || 0} approved businesses
          </p>
        </Card>

        <Card className="hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Job Postings</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? <SkeletonLoader className="h-8 w-16" /> : stats?.totalJobs || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>{stats?.activeJobs || 0} Active</span>
            <span>â€¢</span>
            <span>{stats?.totalApplications || 0} Total Apps</span>
          </p>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            setActiveTab('pending');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Pending Approvals
          {pendingCompanies.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white dark:text-navy-950 ml-1">
              {pendingCompanies.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('companies');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'companies'
              ? 'bg-violet-100 text-violet-800 border border-violet-300 dark:bg-violet-600/20 dark:text-violet-300 dark:border-violet-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Companies ({companies.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('jobs');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'jobs'
              ? 'bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Job Postings ({jobs.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('users');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management ({users.length})
        </button>
      </div>

      {/* TAB 1: PENDING EMPLOYER APPROVALS */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Employer Verification Queue
              <span className="text-xs font-normal text-slate-400">
                (Approval required before employers can post jobs)
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              <SkeletonLoader className="h-24 w-full rounded-2xl" />
              <SkeletonLoader className="h-24 w-full rounded-2xl" />
            </div>
          ) : pendingCompanies.length === 0 ? (
            <Card className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Queue is Clear!</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                No employer accounts are currently waiting for admin approval. New registrations will appear here instantly.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingCompanies.map((comp) => (
                <Card
                  key={comp.id}
                  className="p-6 border-amber-500/20 hover:border-amber-500/40 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xl font-bold text-white">
                          {comp.name}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Approval Pending
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Users className="w-3.5 h-3.5 text-violet-400" />
                          Employer: <strong className="text-white">{comp.employerName}</strong> ({comp.employerEmail})
                        </span>
                        {comp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-teal-400" />
                            {comp.location}
                          </span>
                        )}
                        {comp.website && (
                          <a
                            href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-teal-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {comp.website}
                          </a>
                        )}
                      </div>

                      {comp.description && (
                        <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                          {comp.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRejectCompany(comp)}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20"
                        icon={XCircle}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveCompany(comp)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                        icon={CheckCircle2}
                      >
                        Approve Company
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPANIES MANAGEMENT */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Registered Companies
              <span className="text-xs font-normal text-slate-400">
                (Manage approval & active/suspended statuses)
              </span>
            </h2>

            <div className="w-full sm:w-72">
              <Input
                placeholder="Search company or employer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                className="text-xs"
              />
            </div>
          </div>

          {loading ? (
            <SkeletonLoader className="h-64 w-full rounded-2xl" />
          ) : filteredCompanies.length === 0 ? (
            <Card className="py-12 text-center">
              <p className="text-sm text-slate-400">No companies found matching "{searchQuery}".</p>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 glass-panel">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Company</th>
                    <th className="py-3.5 px-4 font-semibold">Employer Contact</th>
                    <th className="py-3.5 px-4 font-semibold">Location</th>
                    <th className="py-3.5 px-4 font-semibold">Jobs Posted</th>
                    <th className="py-3.5 px-4 font-semibold">Approval</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCompanies.map((comp) => {
                    const isSuspended = comp.status === 'SUSPENDED';
                    return (
                      <tr key={comp.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{comp.name}</div>
                          {comp.website && (
                            <span className="text-xs text-slate-400 block truncate max-w-[180px]">
                              {comp.website}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <div className="text-slate-200 font-medium">{comp.employerName}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{comp.employerEmail}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {comp.location || 'â€”'}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-white">
                          {comp.totalJobs}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              comp.approvalStatus === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : comp.approvalStatus === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {comp.approvalStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              !isSuspended
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {comp.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleCompanyStatus(comp)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ml-auto border ${
                              isSuspended
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: JOB POSTINGS MANAGEMENT */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              System-Wide Job Listings
              <span className="text-xs font-normal text-slate-400">
                (Suspend or restore any job listing)
              </span>
            </h2>

            <div className="w-full sm:w-72">
              <Input
                placeholder="Search jobs by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                className="text-xs"
              />
            </div>
          </div>

          {loading ? (
            <SkeletonLoader className="h-64 w-full rounded-2xl" />
          ) : filteredJobs.length === 0 ? (
            <Card className="py-12 text-center">
              <p className="text-sm text-slate-400">No jobs found matching "{searchQuery}".</p>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 glass-panel">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Job Title</th>
                    <th className="py-3.5 px-4 font-semibold">Company</th>
                    <th className="py-3.5 px-4 font-semibold">Location & Type</th>
                    <th className="py-3.5 px-4 font-semibold">Salary</th>
                    <th className="py-3.5 px-4 font-semibold">Applicants</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredJobs.map((job) => {
                    const isSuspended = job.status === 'SUSPENDED';
                    const isClosed = job.status === 'CLOSED';
                    return (
                      <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{job.title}</div>
                          <span className="text-[11px] font-mono text-slate-400">ID #{job.id}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <div className="text-slate-200 font-medium">{job.companyName}</div>
                          {job.companyStatus === 'SUSPENDED' && (
                            <span className="text-[10px] text-rose-400 font-semibold">
                              (Company Suspended)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <div className="text-slate-300">{job.location}</div>
                          <span className="text-[11px] text-slate-500 uppercase">{job.jobType?.replace('_', ' ')}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-teal-400">
                          {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-white">
                          {job.applicantCount || 0}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              job.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : job.status === 'CLOSED'
                                ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleJobStatus(job)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ml-auto border ${
                              isSuspended
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Role:
              </span>
              {['ALL', 'CANDIDATE', 'EMPLOYER', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    roleFilter === r
                      ? 'bg-violet-600 text-white shadow-glow-violet'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72">
              <Input
                placeholder="Search users by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                className="text-xs"
              />
            </div>
          </div>

          {loading ? (
            <SkeletonLoader className="h-64 w-full rounded-2xl" />
          ) : filteredUsers.length === 0 ? (
            <Card className="py-12 text-center">
              <p className="text-sm text-slate-400">No users found matching current filters.</p>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 glass-panel">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">User</th>
                    <th className="py-3.5 px-4 font-semibold">Email</th>
                    <th className="py-3.5 px-4 font-semibold">Role</th>
                    <th className="py-3.5 px-4 font-semibold">Associated Company</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === user?.id;
                    const isSuspended = u.status === 'SUSPENDED';
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white flex items-center gap-2">
                            {u.name}
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">ID #{u.id}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              u.role === 'ADMIN'
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                : u.role === 'EMPLOYER'
                                ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                                : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {u.companyName ? (
                            <span className="text-slate-200 font-medium">{u.companyName}</span>
                          ) : (
                            'â€”'
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              !isSuspended
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            disabled={isSelf}
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ml-auto border disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                              isSuspended
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </PageTransition>
  );
}
