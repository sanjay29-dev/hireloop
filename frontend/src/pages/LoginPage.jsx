import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, Shield, User, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      // Route appropriately based on user role
      if (from) {
        navigate(from, { replace: true });
      } else if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (data.role === 'EMPLOYER') {
        navigate('/employer/dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Quick populate for easy student testing
  const fillDemoCredentials = (role) => {
    if (role === 'ADMIN') {
      setEmail('admin@hireloop.com');
      setPassword('Admin@123');
    } else if (role === 'EMPLOYER') {
      setEmail('alex@techcorp.com');
      setPassword('password123');
    } else {
      setEmail('jane@example.com');
      setPassword('password123');
    }
    setErrorMessage('');
  };

  return (
    <PageTransition className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-teal-400 p-[1.5px] shadow-glow-violet">
              <div className="w-full h-full bg-navy-900 rounded-xl flex items-center justify-center font-black text-white text-lg">
                H
              </div>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to access your Hireloop portal
          </p>
        </div>

        <Card className="p-8">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm leading-relaxed">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Fill Pill for Fast Testing */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Quick Test Accounts:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('ADMIN')}
                className="px-2 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium hover:bg-rose-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('CANDIDATE')}
                className="px-2 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium hover:bg-teal-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <User className="w-3 h-3" /> Candidate
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('EMPLOYER')}
                className="px-2 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Building className="w-3 h-3" /> Employer
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-400 space-y-2">
            <p>
              New Candidate?{' '}
              <Link to="/register/candidate" className="text-teal-400 hover:underline font-medium">
                Register as Candidate
              </Link>
            </p>
            <p>
              Hiring for your team?{' '}
              <Link to="/register/employer" className="text-violet-400 hover:underline font-medium">
                Register as Employer
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
