import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ArrowLeft,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';

export default function EmployerApplicantsPage() {
  const { id: jobId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fetchApplicants = async () => {
    try {
      const [appRes, jobRes] = await Promise.all([
        api.get(`/employer/jobs/${jobId}/applicants`),
        api.get(`/employer/jobs/${jobId}`),
      ]);
      setApplicants(appRes.data.data || []);
      setJob(jobRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load applicants:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdatingId(appId);
    try {
      await api.patch(`/employer/applications/${appId}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      if (selectedApplicant && selectedApplicant.id === appId) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      }
      setToast({
        show: true,
        message: `Applicant status updated to ${newStatus}`,
        type: 'success',
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update applicant status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDownloadResume = async (e, appId, candidateName) => {
    e.stopPropagation();
    try {
      const res = await api.get(`/applications/${appId}/resume`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Could not download resume.');
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesFilter = filter === 'ALL' || app.status === filter;
    const matchesSearch =
      !search.trim() ||
      app.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
      app.candidateSkills?.toLowerCase().includes(search.toLowerCase()) ||
      app.candidateHeadline?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/employer/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Jobs
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Applicants: <span className="text-teal-400">{job?.title || 'Job'}</span>
            </h1>
            <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-500/30">
              {applicants.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review candidate resumes, evaluate skill profiles, and progress candidates through the hiring pipeline.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-glow-teal'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab} (
              {tab === 'ALL'
                ? applicants.length
                : applicants.filter((a) => a.status === tab).length}
              )
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate or skill..."
            className="w-full rounded-xl bg-navy-900/80 border border-white/10 text-white text-xs pl-9 pr-3 py-2 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Applicants List */}
      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : filteredApplicants.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-white/10 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Applicants Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {applicants.length === 0
              ? 'Applications will appear here as candidates submit for this position.'
              : 'No applicants match the current filter criteria.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => (
            <Card key={app.id} hover={true} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Candidate Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-bold text-white">
                      {app.candidateName}
                    </h3>
                    <span className="text-xs text-slate-400">({app.candidateEmail})</span>
                    {app.candidatePhone && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {app.candidatePhone}
                      </span>
                    )}
                  </div>

                  {app.candidateHeadline && (
                    <p className="text-xs text-violet-300 font-medium">
                      {app.candidateHeadline}
                    </p>
                  )}

                  {app.candidateLocation && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-400" />
                      {app.candidateLocation}
                    </p>
                  )}

                  {/* Skills tags preview */}
                  {app.candidateSkills && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {app.candidateSkills.split(',').slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300"
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Update Dropdown & Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
                  {/* Status Dropdown */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Status
                    </label>
                    <select
                      value={app.status}
                      disabled={statusUpdatingId === app.id}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="rounded-xl bg-navy-900 border border-white/10 text-xs font-semibold px-3 py-1.5 text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="SELECTED">Selected</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Download}
                      onClick={(e) => handleDownloadResume(e, app.id, app.candidateName)}
                      title="Download PDF Resume"
                    >
                      Resume
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => setSelectedApplicant(app)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Candidate Profile Modal */}
      <Modal
        isOpen={Boolean(selectedApplicant)}
        onClose={() => setSelectedApplicant(null)}
        title="Candidate Full Profile"
        maxWidth="max-w-2xl"
      >
        {selectedApplicant && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedApplicant.candidateName}
                </h3>
                <p className="text-xs text-violet-300 mt-0.5">
                  {selectedApplicant.candidateHeadline || 'Candidate'}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {selectedApplicant.candidateEmail}
                  </span>
                  {selectedApplicant.candidatePhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {selectedApplicant.candidatePhone}
                    </span>
                  )}
                  {selectedApplicant.candidateLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      {selectedApplicant.candidateLocation}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={(e) =>
                  handleDownloadResume(e, selectedApplicant.id, selectedApplicant.candidateName)
                }
              >
                Download Resume
              </Button>
            </div>

            {/* Technical Skills */}
            {selectedApplicant.candidateSkills && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Skills & Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApplicant.candidateSkills.split(',').map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/15 border border-violet-500/25 text-violet-300 font-medium"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {selectedApplicant.candidateExperience && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                  Work Experience
                </h4>
                <div className="text-xs text-slate-300 bg-navy-950/60 p-4 rounded-xl border border-white/5 whitespace-pre-line leading-relaxed">
                  {selectedApplicant.candidateExperience}
                </div>
              </div>
            )}

            {/* Education */}
            {selectedApplicant.candidateEducation && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  Education
                </h4>
                <div className="text-xs text-slate-300 bg-navy-950/60 p-4 rounded-xl border border-white/5 whitespace-pre-line leading-relaxed">
                  {selectedApplicant.candidateEducation}
                </div>
              </div>
            )}

            {/* Pipeline Stage Management */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Move Candidate Pipeline Stage:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedApplicant.id, st)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedApplicant.status === st
                        ? 'bg-teal-500 text-white font-bold'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
}
