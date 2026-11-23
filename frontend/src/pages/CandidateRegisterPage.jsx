import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

export default function CandidateRegisterPage() {
  const { registerCandidate } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    // Client-side quick check
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setFieldErrors({ password: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);
    try {
      await registerCandidate(formData);
      navigate('/jobs');
    } catch (err) {
      if (err.response?.data?.fieldErrors) {
        setFieldErrors(err.response.data.fieldErrors);
      }
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-teal-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-3 border border-teal-500/20">
            <User className="w-3.5 h-3.5" /> Candidate Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Candidate Account
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Build your professional profile and unlock top job offers
          </p>
        </div>

        <Card className="p-8">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              error={fieldErrors.name}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              error={fieldErrors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              error={fieldErrors.password}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                name="phone"
                placeholder="+1 555-0199"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                error={fieldErrors.phone}
              />

              <Input
                label="Location"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
                icon={MapPin}
                error={fieldErrors.location}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              loading={loading}
              icon={UserPlus}
            >
              Register Candidate Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 text-center text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 dark:text-teal-400 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
            <p>
              Looking to hire?{' '}
              <Link to="/register/employer" className="text-violet-600 dark:text-violet-400 hover:underline font-semibold">
                Register as an Employer
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
