import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import ApplyModal from '../components/ApplyModal';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';
import { formatSalary } from '../utils/formatSalary';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch Job Details
    api.get(`/jobs/${id}`)
      .then((res) => {
        setJob(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Job not found');
        setLoading(false);
      });

    // 2. If Candidate is logged in, check if already applied
    if (isAuthenticated && role === 'CANDIDATE') {
      api.get(`/candidate/applications/check/${id}`)
        .then((res) => {
          setHasApplied(res.data.data?.hasApplied || false);
        })
        .catch(() => {});
    }
  }, [id, isAuthenticated, role]);

  const toggleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'CANDIDATE') {
      alert('Only candidates can save jobs.');
      return;
    }

    setSaving(true);
    try {
      if (job.saved) {
        await api.delete(`/candidate/saved-jobs/${job.id}`);
        setJob((prev) => ({ ...prev, saved: false }));
      } else {
        await api.post(`/candidate/saved-jobs/${job.id}`);
        setJob((prev) => ({ ...prev, saved: true }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update saved job');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'CANDIDATE') {
      alert('Only candidates can submit applications.');
      return;
    }
    setIsApplyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  if (error || !job) {
    return (
      <PageTransition className="max-w-xl mx-auto px-4 py-16 text-center">
        <Card className="p-10 border-rose-500/20">
          <h2 className="text-xl font-bold text-white mb-2">Job Listing Unavailable</h2>
          <p className="text-sm text-slate-400 mb-6">{error || 'This job does not exist or has been closed.'}</p>
          <Link to="/jobs">
            <Button variant="primary" size="md" icon={ArrowLeft}>
              Back to Open Jobs
            </Button>
          </Link>
        </Card>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onApplicationSuccess={() => {
          setHasApplied(true);
        }}
      />

      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Jobs
      </Link>

      {/* Main Job Header Card */}
      <Card className="p-8 mb-8 border-violet-500/20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/30 to-teal-500/20 border border-white/10 flex items-center justify-center font-black text-white text-2xl flex-shrink-0">
              {job.companyName ? job.companyName.charAt(0) : 'C'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/25">
                  {job.jobType.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-violet-400" />
                  {job.companyName}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save & Apply */}
          <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
            <button
              onClick={toggleSave}
              disabled={saving}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                job.saved
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${job.saved ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{job.saved ? 'Saved' : 'Save'}</span>
            </button>

            {hasApplied ? (
              <Button
                variant="secondary"
                size="md"
                disabled
                className="w-full sm:w-auto bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
                icon={CheckCircle2}
              >
                Applied
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                icon={Send}
                onClick={handleApplyClick}
              >
                Apply for this Role
              </Button>
            )}
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Salary Compensation
            </span>
            <span className="text-sm sm:text-base font-extrabold text-teal-400">
              {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Work Location
            </span>
            <span className="text-sm font-semibold text-white">
              {job.location || 'Flexible'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Position Type
            </span>
            <span className="text-sm font-semibold text-white">
              {job.jobType.replace('_', ' ')}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Application Deadline
            </span>
            <span className="text-sm font-semibold text-white">
              {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling Basis'}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Description & Skills */}
        <div className="lg:col-span-2 space-y-8">
          {/* Required Skills */}
          {job.skills && (
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.split(',').map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Detailed Job Description */}
          <Card className="p-8">
            <h3 className="text-lg font-bold text-white mb-4">About the Position</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
              {job.description}
            </div>
          </Card>
        </div>

        {/* Right Column: Company Info Card */}
        <div className="space-y-6">
          <Card className="p-6 border-teal-500/20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              About the Hiring Company
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-lg">
                {job.companyName ? job.companyName.charAt(0) : 'C'}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{job.companyName}</h4>
                <p className="text-xs text-slate-400">{job.companyLocation || job.location}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Verified employer active on Hireloop platform.
            </p>

            <Link to="/jobs">
              <Button variant="secondary" size="sm" className="w-full">
                View More Jobs from this Company
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
