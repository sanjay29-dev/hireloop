import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import Button from './Button';
import {
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  FileText,
  Bookmark,
  Shield,
  LayoutDashboard,
  Building,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-teal-400 p-[1.5px] shadow-lg shadow-violet-600/20 group-hover:shadow-violet-600/40 transition-all duration-300">
            <div className="w-full h-full bg-navy-900 rounded-xl flex items-center justify-center font-black text-white text-lg tracking-wider">
              H
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-slate-100 transition-colors">
            HIRE<span className="text-teal-400">LOOP</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/jobs"
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/jobs')
                ? 'text-teal-400 bg-teal-500/10'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Find Jobs
          </Link>

          {/* Candidate specific links */}
          {isAuthenticated && role === 'CANDIDATE' && (
            <>
              <Link
                to="/candidate/applications"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/candidate/applications')
                    ? 'text-violet-400 bg-violet-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4 text-violet-400" />
                My Applications
              </Link>
              <Link
                to="/candidate/saved"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/candidate/saved')
                    ? 'text-violet-400 bg-violet-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bookmark className="w-4 h-4 text-teal-400" />
                Saved Jobs
              </Link>
              <Link
                to="/candidate/profile"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/candidate/profile')
                    ? 'text-violet-400 bg-violet-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-4 h-4 text-slate-300" />
                Profile
              </Link>
            </>
          )}

          {/* Employer specific links */}
          {isAuthenticated && role === 'EMPLOYER' && (
            <>
              <Link
                to="/employer/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/employer/dashboard')
                    ? 'text-violet-400 bg-violet-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-violet-400" />
                Dashboard
              </Link>
              <Link
                to="/employer/jobs"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/employer/jobs')
                    ? 'text-violet-400 bg-violet-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-4 h-4 text-violet-400" />
                My Jobs
              </Link>
              <Link
                to="/employer/post-job"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/employer/post-job')
                    ? 'text-teal-400 bg-teal-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-teal-400" />
                Post Job
              </Link>
              <Link
                to="/employer/company"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/employer/company')
                    ? 'text-slate-200 bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building className="w-4 h-4 text-slate-400" />
                Company
              </Link>
            </>
          )}

          {/* Admin specific links */}
          {isAuthenticated && role === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin/dashboard')
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-400" />
              Admin Portal
            </Link>
          )}
        </div>

        {/* Right Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                  {user?.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                title="Log Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer flex items-center justify-center"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register/candidate"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-teal-500 text-white shadow-md shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
          >
            Find Jobs
          </Link>

          {isAuthenticated ? (
            <>
              {role === 'CANDIDATE' && (
                <>
                  <Link
                    to="/candidate/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/candidate/saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    Saved Jobs
                  </Link>
                  <Link
                    to="/candidate/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    Profile
                  </Link>
                </>
              )}

              {role === 'EMPLOYER' && (
                <>
                  <Link
                    to="/employer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    Employer Dashboard
                  </Link>
                  <Link
                    to="/employer/post-job"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    Post a Job
                  </Link>
                </>
              )}

              {role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-rose-300 hover:bg-rose-500/10"
                >
                  Admin Dashboard
                </Link>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-slate-200 bg-white/5"
              >
                Sign In
              </Link>
              <Link
                to="/register/candidate"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-teal-500 text-white shadow-md shadow-violet-600/20"
              >
                Register as Candidate
              </Link>
              <Link
                to="/register/employer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-medium border border-teal-500/30 text-teal-300 hover:bg-teal-500/10"
              >
                Register as Employer
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Sign Out"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 text-rose-400">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Are you sure you want to log out?
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                You are currently signed in as <strong className="text-slate-200">{user?.email}</strong>. Logging out will end your current session.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={LogOut}
              onClick={() => {
                setShowLogoutConfirm(false);
                handleLogout();
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
      </Modal>
    </nav>
  );
}
