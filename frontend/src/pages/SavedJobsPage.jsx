import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Building2, Trash2, ArrowRight, ArrowLeft, Briefcase } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';
import { formatSalary } from '../utils/formatSalary';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/candidate/saved-jobs');
      setSavedJobs(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (e, jobId) => {
    e.stopPropagation();
    setRemovingId(jobId);
    try {
      await api.delete(`/candidate/saved-jobs/${jobId}`);
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove saved job');
    } finally {
      setRemovingId(null);
    }
  };

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
          Saved Jobs
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Positions you have bookmarked for easy reference and application.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : savedJobs.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-white/10 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Saved Jobs Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Bookmark interesting opportunities while exploring the job board to apply when you're ready.
          </p>
          <Link to="/jobs">
            <Button variant="primary" size="md" icon={Briefcase}>
              Discover Open Jobs
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <Card
              key={job.id}
              hover={true}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-teal-50 dark:from-violet-600/20 dark:to-teal-500/20 border border-violet-200/80 dark:border-white/10 flex items-center justify-center font-bold text-violet-700 dark:text-white text-base shadow-sm">
                      {job.companyName ? job.companyName.charAt(0) : 'C'}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {job.companyName}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleRemove(e, job.id)}
                    disabled={removingId === job.id}
                    title="Remove from Saved"
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors mb-2 line-clamp-1">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                {job.skills && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.skills.split(',').slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/5 dark:border-white/5 dark:text-slate-300 font-medium"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Salary
                  </span>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-300">
                    {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                  </span>
                </div>

                <Button variant="secondary" size="sm" icon={ArrowRight}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
