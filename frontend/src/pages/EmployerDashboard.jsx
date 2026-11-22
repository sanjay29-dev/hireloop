import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, Users, Clock, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const isApproved = user?.companyApprovalStatus === 'APPROVED';

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Pending Approval Notice Screen */}
      {!isApproved && (
        <div className="mb-8 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Registration Status: <span className="text-amber-400 font-mono text-base">PENDING APPROVAL</span>
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Your company <strong>{user?.companyName || 'profile'}</strong> is currently under administrative review. Once approved by an admin, job posting privileges will be activated automatically.
                </p>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 whitespace-nowrap">
              Review in Progress
            </span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-3 border border-violet-500/20">
            <Building2 className="w-3.5 h-3.5" /> Employer Portal
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {user?.companyName || 'Company'} Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Logged in as {user?.name} ({user?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/employer/post-job">
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              disabled={!isApproved}
              title={!isApproved ? 'Requires Admin Approval' : ''}
            >
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Jobs</span>
            <Building2 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">0</div>
          <p className="text-xs text-slate-400 mt-1">Active and closed postings</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Applicants</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">0</div>
          <p className="text-xs text-slate-400 mt-1">Candidates applied across all jobs</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Approval</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            {isApproved ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> Approved
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1.5">
                <Clock className="w-5 h-5" /> Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isApproved ? 'Can post and manage jobs' : 'Admin approval required'}
          </p>
        </Card>
      </div>

      <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
        <p className="text-sm text-slate-400">
          Phase 4 will activate full Job Management & Applicant Tracking pipelines.
        </p>
      </div>
    </PageTransition>
  );
}
