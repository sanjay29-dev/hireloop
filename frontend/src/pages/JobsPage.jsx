import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Briefcase, Building2, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

export default function JobsPage() {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  // Sample jobs list for Phase 3 UI preview
  const sampleJobs = [
    {
      id: 1,
      title: 'Senior Java Spring Boot Engineer',
      company: 'CloudSphere Labs',
      location: 'Remote',
      jobType: 'FULL_TIME',
      salary: '$120,000 - $150,000',
      description: 'Design and build high-throughput backend services using Spring Boot 3, Hibernate, and MySQL.',
      skills: 'Java 17, Spring Boot, MySQL, REST API, Docker',
    },
    {
      id: 2,
      title: 'React & Frontend Specialist',
      company: 'NextGen Digital',
      location: 'New York, NY',
      jobType: 'FULL_TIME',
      salary: '$95,000 - $130,000',
      description: 'Craft responsive, pixel-perfect user experiences with Vite, Tailwind CSS, and Framer Motion.',
      skills: 'React, Vite, Tailwind CSS, Framer Motion, JavaScript',
    },
    {
      id: 3,
      title: 'Full Stack Java / React Developer',
      company: 'InnoTech Ventures',
      location: 'San Francisco, CA (Hybrid)',
      jobType: 'CONTRACT',
      salary: '$80 - $100 / hr',
      description: 'Deliver end-to-end features connecting RESTful Spring APIs with modern responsive React frontends.',
      skills: 'Java, Spring Security, JWT, React, Tailwind',
    },
  ];

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Discover Open Opportunities
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Search hundreds of tech jobs across top employers worldwide.
        </p>

        <div className="glass-panel p-2.5 rounded-2xl border border-white/10 shadow-xl flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 w-full px-4 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-white/10">
            <Search className="w-5 h-5 text-violet-400 flex-shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Title or skill..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full px-4 py-2 sm:py-0">
            <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or remote..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <Button variant="primary" size="md" className="flex-shrink-0">
            Search Jobs
          </Button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobs.map((job) => (
          <Card key={job.id} hover={true} className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  {job.jobType.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold text-violet-300">{job.salary}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {job.company} • {job.location}
              </p>

              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {job.skills.split(',').map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-500">Just posted</span>
              <Button variant="secondary" size="sm">
                Apply Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </PageTransition>
  );
}
