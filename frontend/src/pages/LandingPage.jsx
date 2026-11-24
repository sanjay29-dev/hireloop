import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  Code2,
  Cpu,
  Cloud,
  Palette,
  LineChart,
  Megaphone,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

export default function LandingPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { title: 'Full Stack Java', keyword: 'Java', count: '6 Openings', icon: Code2, color: 'text-violet-400', bg: 'bg-violet-500/20' },
    { title: 'Frontend & React', keyword: 'React', count: '4 Openings', icon: Palette, color: 'text-teal-400', bg: 'bg-teal-500/20' },
    { title: 'DevOps & Cloud', keyword: 'DevOps', count: '2 Openings', icon: Cloud, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { title: 'Spring Boot & APIs', keyword: 'Spring', count: '4 Openings', icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { title: 'Remote Positions', jobType: 'REMOTE', count: '2 Openings', icon: Megaphone, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { title: 'Engineering Internships', jobType: 'INTERNSHIP', count: '1 Opening', icon: LineChart, color: 'text-rose-400', bg: 'bg-rose-500/20' },
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Full Stack Java Engineer',
      company: 'Razorpay Software',
      location: 'Bangalore, Karnataka, India',
      type: 'FULL_TIME',
      salary: 'â‚¹18 - â‚¹28 LPA',
      tags: ['Java 17', 'Spring Boot', 'React', 'MySQL'],
    },
    {
      id: 2,
      title: 'Java Spring Boot Developer',
      company: 'Infosys Digital',
      location: 'Bangalore, Karnataka, India',
      type: 'FULL_TIME',
      salary: 'â‚¹12 - â‚¹18 LPA',
      tags: ['Spring Boot', 'JPA', 'MySQL', 'Docker'],
    },
    {
      id: 3,
      title: 'Frontend React Developer',
      company: 'Swiggy Labs',
      location: 'Hyderabad, Telangana, India',
      type: 'FULL_TIME',
      salary: 'â‚¹10 - â‚¹16 LPA',
      tags: ['React', 'Tailwind CSS', 'Vite', 'Framer Motion'],
    },
    {
      id: 4,
      title: 'Staff Infrastructure Engineer',
      company: 'Stripe Global',
      location: 'San Francisco, CA, USA',
      type: 'FULL_TIME',
      salary: '$150k - $190k / yr',
      tags: ['Distributed Systems', 'Java', 'Cloud', 'High Availability'],
    },
  ];

  return (
    <PageTransition className="relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-teal-500/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] -right-[150px] w-[500px] h-[500px] bg-teal-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-[1400px] -left-[150px] w-[600px] h-[600px] bg-violet-600/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-violet-300 text-xs sm:text-sm mb-8 border border-violet-500/20 shadow-glow-violet"
        >
          <Briefcase className="w-4 h-4 text-teal-400" />
          <span>The Modern Job Discovery & Hiring Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto"
        >
          Find Your Next Career Move With{' '}
          <span className="glow-gradient-text">HIRELOOP</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Connecting exceptional candidates with verified employers. Seamless one-click applications with live status tracking.
        </motion.p>

        {/* Hero Interactive Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <form
            onSubmit={handleSearch}
            className="glass-panel p-2.5 rounded-2xl sm:rounded-full border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2 w-full px-4 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-white/10">
              <Search className="w-5 h-5 text-violet-400 flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skill, or keyword..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full px-4 py-2 sm:py-0">
              <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or 'Remote'..."
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

          {/* Quick trend pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-semibold">Popular Searches:</span>
            {['Java', 'Spring Boot', 'React', 'DevOps', 'Remote'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setKeyword(tag);
                  navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
                }}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200 hover:border-violet-500/40 hover:text-white hover:bg-violet-600/20 transition-all cursor-pointer font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Popular Job Categories
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Explore open positions with verified companies across tech domains.
            </p>
          </div>
          <Link
            to="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Card
                key={idx}
                hover={true}
                onClick={() => {
                  if (cat.jobType) {
                    navigate(`/jobs?jobType=${encodeURIComponent(cat.jobType)}`);
                  } else {
                    navigate(`/jobs?keyword=${encodeURIComponent(cat.keyword)}`);
                  }
                }}
                className="cursor-pointer group flex items-center gap-4 p-5 bg-navy-850/80 border border-white/10 hover:border-violet-500/40 hover:shadow-glow-violet transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.bg} border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">{cat.count}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Job Openings
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Verified opportunities currently open for candidate applications.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            Browse All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredJobs.map((job) => (
            <Card key={job.id} hover={true} className="flex flex-col justify-between p-6 bg-navy-850/80 border border-white/10">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300">
                    {job.company.substring(0, 1)}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    {job.type.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-4 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {job.company} â€¢ {job.location}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Salary</span>
                  <span className="text-sm font-black text-teal-300">{job.salary}</span>
                </div>
                <Link to="/jobs">
                  <Button variant="secondary" size="sm">
                    View Job
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
            How Hireloop Works
          </h2>
          <p className="text-sm text-slate-400">
            A seamless experience tailored for both ambitious job seekers and forward-thinking recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Candidates Flow */}
          <Card className="p-8 bg-navy-850/80 border border-violet-500/30">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">For Candidates</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Profile & Resume:</strong> Create your profile once and store your default resume for rapid one-click applications.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Smart Filters:</strong> Filter jobs by title, skills, remote preference, and job types.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Live Status:</strong> Track real-time progress of your applications from Applied to Interview and Selected.</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link to="/register/candidate">
                <Button variant="primary" size="md" className="w-full">
                  Create Candidate Account
                </Button>
              </Link>
            </div>
          </Card>

          {/* Employers Flow */}
          <Card className="p-8 bg-navy-850/80 border border-teal-500/30">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">For Employers</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Verified Profiles:</strong> High-trust ecosystem where every employer is approved by admin before posting.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Manage Listings:</strong> Post, update, pause, or close job listings with rich skill tagging.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Applicant Tracking:</strong> Review candidate resumes, advance status through interview stages in one click.</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link to="/register/employer">
                <Button variant="secondary" size="md" className="w-full">
                  Register as Employer
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to action section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-violet-950/60 via-navy-850 to-teal-950/50 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Loop Into Your Future?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm sm:base">
            Join candidates and employers discovering seamless job matches every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register/candidate" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full">
                Get Started as Candidate
              </Button>
            </Link>
            <Link to="/register/employer" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                Hire Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
