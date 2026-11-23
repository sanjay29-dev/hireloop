import React from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, Bookmark, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

export default function CandidateDashboard() {
  const { user } = useAuth();

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-3 border border-teal-500/20">
              <User className="w-3.5 h-3.5" /> Candidate Portal
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, <span className="glow-gradient-text">{user?.name}</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track your applications, update your profile, and discover new matching roles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/jobs">
              <Button variant="primary" size="md" icon={Briefcase}>
                Explore Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover={true} className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">My Profile</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Manage your experience, skills, education, and upload your default PDF resume.
            </p>
          </div>
          <Link to="/candidate/profile">
            <Button variant="secondary" size="sm" className="w-full" icon={ArrowRight}>
              Edit Profile
            </Button>
          </Link>
        </Card>

        <Card hover={true} className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">My Applications</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              View live progress badges for all your job applications (Applied, Shortlisted, Interview, Selected).
            </p>
          </div>
          <Link to="/candidate/applications">
            <Button variant="secondary" size="sm" className="w-full" icon={ArrowRight}>
              View Applications
            </Button>
          </Link>
        </Card>

        <Card hover={true} className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 shadow-sm">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Saved Jobs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Keep track of roles you want to apply for later with one-click bookmarking.
            </p>
          </div>
          <Link to="/candidate/saved">
            <Button variant="secondary" size="sm" className="w-full" icon={ArrowRight}>
              View Saved Jobs
            </Button>
          </Link>
        </Card>
      </div>
    </PageTransition>
  );
}
