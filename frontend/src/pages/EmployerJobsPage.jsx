import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Edit2,
  Trash2,
  XCircle,
  Users,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, CLOSED
  const navigate = useNavigate();

  // Modals for actions
  const [closingJob, setClosingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/employer/jobs');
      setJobs(res.data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCloseJob = async () => {
    if (!closingJob) return;
    setActionLoading(true);
    try {
      await api.patch(`/employer/jobs/${closingJob.id}/close`);
      showToast(`Job "${closingJob.title}" closed successfully.`, 'info');
      setClosingJob(null);
      fetchJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to close job', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!deletingJob) return;
    setActionLoading(true);
    try {
      await api.delete(`/employer/jobs/${deletingJob.id}`);
      showToast(`Job "${deletingJob.title}" permanently deleted.`, 'success');
      setDeletingJob(null);
      fetchJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete job', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'ACTIVE') return job.status === 'ACTIVE';
    if (filter === 'CLOSED') return job.status === 'CLOSED';
    return true;
  });

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast Notification */}
      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manage Job Postings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review, edit, or close your published opportunities and track candidate submissions.
          </p>
        </div>

        <Link to="/employer/post-job">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
        {['ALL', 'ACTIVE', 'CLOSED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filter === tab
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-glow-violet'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab} ({tab === 'ALL' ? jobs.length : jobs.filter((j) => j.status === tab).length})
          </button>
        ))}
      </div>

      {/* Jobs Content */}
      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm text-center">
          {error}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            No {filter !== 'ALL' ? filter.toLowerCase() : ''} jobs found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Get started by posting your open role to attract top applicants.
          </p>
          <Link to="/employer/post-job">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Post a Job Listing
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const isActive = job.status === 'ACTIVE';

            return (
              <Card key={job.id} hover={true} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Job Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-bold text-white hover:text-violet-300 transition-colors">
                        {job.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-700/30 text-slate-400 border-slate-600/30'
                        }`}
                      >
                        {job.status}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        {job.jobType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {job.location}
                        </span>
                      )}
                      {(job.salaryMin || job.salaryMax) && (
                        <span className="font-semibold text-slate-300">
                          {job.currency === 'USD' ? '$' : '₹'}
                          {job.salaryMin?.toLocaleString()} - {job.currency === 'USD' ? '$' : '₹'}
                          {job.salaryMax?.toLocaleString()}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          Deadline: {job.deadline}
                        </span>
                      )}
                    </div>

                    {job.skills && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.split(',').map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300 font-medium"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Applicant Count */}
                  <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
                    <Link
                      to={`/employer/jobs/${job.id}/applicants`}
                      title="View Job Applicants"
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-teal-500/10 border border-white/10 hover:border-teal-500/30 text-center transition-all cursor-pointer group/app"
                    >
                      <span className="text-base font-black text-white group-hover/app:text-teal-400 block transition-colors">
                        {job.applicantCount}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 group-hover/app:text-teal-300">
                        Applicants →
                      </span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <Link to={`/employer/edit-job/${job.id}`}>
                        <button
                          title="Edit Job"
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Link>

                      {isActive && (
                        <button
                          onClick={() => setClosingJob(job)}
                          title="Close Job"
                          className="p-2 rounded-xl text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 transition-all cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => setDeletingJob(job)}
                        title="Delete Job"
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirm Close Modal */}
      <Modal
        isOpen={Boolean(closingJob)}
        onClose={() => setClosingJob(null)}
        title="Confirm Close Job"
      >
        <p className="text-sm text-slate-300 mb-6">
          Are you sure you want to close <strong>{closingJob?.title}</strong>? Candidates will no longer be able to submit new applications for this posting.
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={() => setClosingJob(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={actionLoading}
            onClick={handleCloseJob}
          >
            Yes, Close Job
          </Button>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={Boolean(deletingJob)}
        onClose={() => setDeletingJob(null)}
        title="Confirm Delete Job"
      >
        <div className="space-y-3 mb-6">
          <p className="text-sm text-slate-300">
            Are you sure you want to permanently delete <strong className="text-white">{deletingJob?.title}</strong>?
          </p>
          {deletingJob?.applicantCount > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                This job currently has <strong>{deletingJob.applicantCount} applicant(s)</strong>. Deleting it will permanently delete this posting and remove all associated candidate applications.
              </span>
            </div>
          )}
          <p className="text-xs text-rose-400/90 font-medium">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={() => setDeletingJob(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={actionLoading}
            onClick={handleDeleteJob}
          >
            Yes, Delete Permanently
          </Button>
        </div>
      </Modal>
    </PageTransition>
  );
}
