import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Bookmark,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';
import { formatSalary } from '../utils/formatSalary';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingJobId, setSavingJobId] = useState(null);

  // Quick Indian & International Location Chips
  const popularLocations = [
    'All',
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Gurgaon',
    'Remote - India',
    'USA',
  ];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (location.trim()) params.append('location', location.trim());
      if (jobType) params.append('jobType', jobType);
      params.append('page', page);
      params.append('size', 9);
      params.append('sortBy', sortBy);
      params.append('direction', direction);

      const res = await api.get(`/jobs?${params.toString()}`);
      const data = res.data.data;
      setJobs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, jobType, sortBy, direction]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  const handleLocationChip = (loc) => {
    if (loc === 'All') {
      setLocation('');
    } else {
      setLocation(loc);
    }
    setPage(0);
  };

  // Bookmark / Save Job Handler
  const toggleSaveJob = async (e, job) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (role !== 'CANDIDATE') {
      alert('Only candidates can save jobs.');
      return;
    }

    setSavingJobId(job.id);
    try {
      if (job.saved) {
        await api.delete(`/candidate/saved-jobs/${job.id}`);
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, saved: false } : j))
        );
      } else {
        await api.post(`/candidate/saved-jobs/${job.id}`);
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, saved: true } : j))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update saved job');
    } finally {
      setSavingJobId(null);
    }
  };

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Header Banner */}
      <div className="mb-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-3 border border-teal-500/20">
          <Sparkles className="w-3.5 h-3.5" /> Over {totalElements || 8}+ Verified Roles
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Explore Top Tech Jobs
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Leading Indian software engineering openings and global opportunities.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="glass-panel p-2.5 rounded-2xl sm:rounded-full border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center gap-2 mb-4"
        >
          <div className="flex items-center gap-2 w-full px-4 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-white/10">
            <Search className="w-5 h-5 text-violet-400 flex-shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Title, skills (e.g. Java, Spring, React)..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full px-4 py-2 sm:py-0">
            <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City (e.g. Bangalore, Pune, Remote)..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full sm:w-auto sm:px-7 rounded-xl sm:rounded-full flex-shrink-0"
            icon={Search}
          >
            Search
          </Button>
        </form>

        {/* Quick Indian & Foreign Location Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Quick Locations:</span>
          {popularLocations.map((loc) => {
            const isSelected =
              (loc === 'All' && !location) ||
              location.toLowerCase().includes(loc.toLowerCase());

            return (
              <button
                key={loc}
                type="button"
                onClick={() => handleLocationChip(loc)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-glow-teal'
                    : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Sort Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Job Type Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { label: 'All Types', value: '' },
            { label: 'Full Time', value: 'FULL_TIME' },
            { label: 'Remote', value: 'REMOTE' },
            { label: 'Internship', value: 'INTERNSHIP' },
            { label: 'Contract', value: 'CONTRACT' },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setJobType(type.value);
                setPage(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                jobType === type.value
                  ? 'bg-violet-600/25 text-violet-300 border border-violet-500/40 shadow-glow-violet'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            Sort by:
          </span>
          <select
            value={`${sortBy},${direction}`}
            onChange={(e) => {
              const [sb, dir] = e.target.value.split(',');
              setSortBy(sb);
              setDirection(dir);
              setPage(0);
            }}
            className="rounded-xl bg-navy-900/80 border border-white/10 text-white text-xs py-1.5 px-3 focus:outline-none focus:border-violet-500"
          >
            <option value="createdAt,desc" className="bg-navy-900">Newest First</option>
            <option value="salaryMax,desc" className="bg-navy-900">Highest Salary</option>
            <option value="deadline,asc" className="bg-navy-900">Deadline Approaching</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : jobs.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-white/10 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No jobs match your search</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Try clearing filters or searching with different keywords like 'Java', 'React', or 'Bangalore'.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setKeyword('');
              setLocation('');
              setJobType('');
              setPage(0);
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobs.map((job) => (
            <Card
              key={job.id}
              hover={true}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Company initial + Save Bookmark + Job Type */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600/20 to-teal-500/20 border border-white/10 flex items-center justify-center font-black text-white text-base">
                      {job.companyName ? job.companyName.charAt(0) : 'C'}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300">
                        {job.companyName}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => toggleSaveJob(e, job)}
                    title={job.saved ? 'Remove from Saved' : 'Save Job'}
                    disabled={savingJobId === job.id}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      job.saved
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white border-white/5 hover:border-white/20'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${job.saved ? 'fill-rose-400 text-rose-400' : ''}`}
                    />
                  </button>
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors mb-2 line-clamp-1">
                  {job.title}
                </h3>

                {/* Description snippet */}
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills Chips */}
                {job.skills && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.skills.split(',').slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300"
                      >
                        {s.trim()}
                      </span>
                    ))}
                    {job.skills.split(',').length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-slate-500">
                        +{job.skills.split(',').length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Card Footer: Salary + Job Type badge */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Salary
                  </span>
                  <span className="text-sm font-bold text-teal-300">
                    {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  {job.jobType.replace('_', ' ')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            icon={ChevronLeft}
          >
            Previous
          </Button>

          <span className="text-xs font-semibold text-slate-400 px-3">
            Page {page + 1} of {totalPages}
          </span>

          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            icon={ChevronRight}
          >
            Next
          </Button>
        </div>
      )}
    </PageTransition>
  );
}
