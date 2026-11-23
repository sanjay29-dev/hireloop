import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-navy-950/80 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-teal-400 p-[1.5px]">
                <div className="w-full h-full bg-navy-900 rounded-xl flex items-center justify-center font-bold text-white text-base">
                  H
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                HIRE<span className="text-teal-400">LOOP</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation job matching platform connecting top talents with leading companies worldwide.
            </p>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              For Candidates
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-teal-400 transition-colors">
                  Explore Open Jobs
                </Link>
              </li>
              <li>
                <Link to="/register/candidate" className="hover:text-teal-400 transition-colors">
                  Create Candidate Profile
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-400 transition-colors">
                  Candidate Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              For Employers
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/register/employer" className="hover:text-violet-400 transition-colors">
                  Register Company
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-violet-400 transition-colors">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-violet-400 transition-colors">
                  Employer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  About Hireloop
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Hireloop. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for job seekers & recruiters.
          </p>
        </div>
      </div>
    </footer>
  );
}
