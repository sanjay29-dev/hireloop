import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  Users,
  Clock,
  Briefcase,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  UserCheck,
  XCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import CountUp from '../components/CountUp';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isApproved = user?.companyApprovalStatus === 'APPROVED' || stats?.approvalStatus === 'APPROVED';

  useEffect(() => {
    api.get('/employer/dashboard/stats')
      .then((res) => {
        setStats(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load employer stats:', err);
        setLoading(false);
      });
  }, []);

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Waiting for approval banner */}
      {!isApproved && (
        <div className="mb-8 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    Company Registration: <span className="text-amber-400 font-mono">PENDING APPROVAL</span>
                  </h3>
                </div>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Your employer account for <strong>{user?.companyName || stats?.companyName || 'your company'}</strong> is waiting for admin verification. As soon as an administrator approves your registration, you can freely post jobs and hire talent.
                </p>
              </div>
            </div>

            <Link to="/employer/company">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                Edit Company Info
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-3 border border-violet-500/20">
            <Building2 className="w-3.5 h-3.5" /> Employer Command Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {stats?.companyName || user?.companyName || 'Employer'} Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Recruiter overview for {user?.name} ({user?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/employer/jobs">
            <Button variant="secondary" size="md" icon={Briefcase}>
              Manage Jobs
            </Button>
          </Link>
          <Link to="/employer/post-job">
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              disabled={!isApproved}
              title={!isApproved ? 'Requires Admin Approval' : ''}
            >
              Post a Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Animated Count-Up Overview Cards */}
      {loading ? (
        <SkeletonLoader type="stat" count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card hover={true} className="border-violet-200 dark:border-violet-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Jobs</span>
              <Briefcase className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              <CountUp target={stats?.totalJobs || 0} />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">{stats?.activeJobs || 0} Active</span>
              <span>•</span>
              <span className="text-slate-400">{stats?.closedJobs || 0} Closed</span>
            </p>
          </Card>

          <Card hover={true} className="border-teal-200 dark:border-teal-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Applicants</span>
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              <CountUp target={stats?.totalApplicants || 0} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across all your listings</p>
          </Card>

          <Card hover={true} className="border-cyan-200 dark:border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Interviews Scheduled</span>
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-300">
              <CountUp target={stats?.statusCounts?.INTERVIEW || 0} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Candidates in interview loop</p>
          </Card>

          <Card hover={true} className="border-emerald-200 dark:border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hired / Selected</span>
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              <CountUp target={stats?.statusCounts?.SELECTED || 0} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Successfully hired candidates</p>
          </Card>
        </div>
      )}

      {/* Applicant Status Breakdown Section */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          Applicant Pipeline Status Breakdown
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Applied', key: 'APPLIED', color: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/20', bg: 'bg-violet-50 dark:bg-violet-500/10' },
            { label: 'Shortlisted', key: 'SHORTLISTED', color: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-500/20', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
            { label: 'Interview', key: 'INTERVIEW', color: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { label: 'Selected', key: 'SELECTED', color: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            { label: 'Rejected', key: 'REJECTED', color: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/20', bg: 'bg-rose-50 dark:bg-rose-500/10' },
          ].map((item) => (
            <Card key={item.key} className={`p-4 text-center ${item.border} ${item.bg}`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                {item.label}
              </span>
              <span className={`text-2xl font-black ${item.color}`}>
                <CountUp target={stats?.statusCounts?.[item.key] || 0} />
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover={true} className="p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-3 shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">My Job Listings</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              View your open and closed jobs, monitor applicant counts, edit details, or close listings.
            </p>
          </div>
          <Link to="/employer/jobs">
            <Button variant="secondary" size="sm" className="w-full" icon={ArrowRight}>
              Open Job Management
            </Button>
          </Link>
        </Card>

        <Card hover={true} className="p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-3 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Company Profile</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Update company branding, website, headquarters location, and about section.
            </p>
          </div>
          <Link to="/employer/company">
            <Button variant="secondary" size="sm" className="w-full" icon={ArrowRight}>
              Edit Company Profile
            </Button>
          </Link>
        </Card>
      </div>
    </PageTransition>
  );
}
