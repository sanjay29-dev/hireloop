import React from 'react';
import { Shield, Users, Building2, Briefcase, FileCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import PageTransition from '../components/PageTransition';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="glass-panel p-8 rounded-3xl border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold mb-3 border border-rose-500/20">
            <Shield className="w-3.5 h-3.5" /> Administrative Control
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Superuser view: manage employer approvals, user accounts, and system-wide job listings.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
          Admin: {user?.email}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">--</div>
          <p className="text-xs text-slate-400 mt-1">Candidates & employers</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Approvals</span>
            <FileCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">--</div>
          <p className="text-xs text-slate-400 mt-1">Employers awaiting review</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Companies</span>
            <Building2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">--</div>
          <p className="text-xs text-slate-400 mt-1">Registered businesses</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Postings</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">--</div>
          <p className="text-xs text-slate-400 mt-1">Active job listings</p>
        </Card>
      </div>

      <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center text-sm text-slate-400">
        Phase 7 will activate the full Admin Employer Approval and Suspension control centre.
      </div>
    </PageTransition>
  );
}
