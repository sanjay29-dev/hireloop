import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Mail, Lock, User, Globe, MapPin, FileText, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

export default function EmployerRegisterPage() {
  const { registerEmployer } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    companyWebsite: '',
    companyLocation: '',
    companyDescription: '',
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

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.companyName.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setFieldErrors({ password: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);
    try {
      await registerEmployer(formData);
      navigate('/employer/dashboard');
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
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-3 border border-violet-500/20">
            <Building className="w-3.5 h-3.5" /> Employer Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Register Your Company
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Post open positions and recruit vetted candidates on Hireloop
          </p>
        </div>

        {/* Approval Notice Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Verification Notice:</strong> All new employer company registrations undergo verification by our administrator team before job listings can be published.
          </p>
        </div>

        <Card className="p-8">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-white/10 pb-4 mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Recruiter / Contact Person
              </h3>
              <div className="space-y-3">
                <Input
                  label="Contact Name"
                  name="name"
                  placeholder="e.g. Alex Smith"
                  value={formData.name}
                  onChange={handleChange}
                  icon={User}
                  error={fieldErrors.name}
                  required
                />

                <Input
                  label="Work Email"
                  name="email"
                  type="email"
                  placeholder="alex@company.com"
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
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Company Details
              </h3>

              <Input
                label="Company Name"
                name="companyName"
                placeholder="e.g. TechCorp Labs"
                value={formData.companyName}
                onChange={handleChange}
                icon={Building}
                error={fieldErrors.companyName}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Website URL"
                  name="companyWebsite"
                  placeholder="https://company.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  icon={Globe}
                  error={fieldErrors.companyWebsite}
                />

                <Input
                  label="Headquarters Location"
                  name="companyLocation"
                  placeholder="San Francisco, CA"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  icon={MapPin}
                  error={fieldErrors.companyLocation}
                />
              </div>

              <Input
                label="Company Description"
                name="companyDescription"
                type="textarea"
                rows={3}
                placeholder="Tell candidates about your company mission and culture..."
                value={formData.companyDescription}
                onChange={handleChange}
                icon={FileText}
                error={fieldErrors.companyDescription}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              loading={loading}
              icon={ArrowRight}
            >
              Submit Company Registration
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 text-center text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <p>
              Already registered?{' '}
              <Link to="/login" className="text-teal-600 dark:text-teal-400 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
            <p>
              Job seeker?{' '}
              <Link to="/register/candidate" className="text-violet-600 dark:text-violet-400 hover:underline font-semibold">
                Register as a Candidate
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
