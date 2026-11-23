import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Globe, MapPin, FileText, CheckCircle2, Clock, XCircle, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import PageTransition from '../components/PageTransition';

export default function CompanyProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    location: '',
    description: '',
    logoPath: '',
  });

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    api.get('/employer/company')
      .then((res) => {
        const comp = res.data.data;
        setCompany(comp);
        setFormData({
          name: comp.name || '',
          website: comp.website || '',
          location: comp.location || '',
          description: comp.description || '',
          logoPath: comp.logoPath || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage(err.response?.data?.message || 'Failed to load company profile');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.name.trim()) {
      setErrorMessage('Company name is required.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put('/employer/company', formData);
      const updated = res.data.data;
      setCompany(updated);
      updateUser({ companyName: updated.name });
      setToast({ show: true, message: 'Company profile updated successfully!', type: 'success' });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'APPROVED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold dark:border-emerald-500/30 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved by Admin
        </span>
      );
    }
    if (status === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 font-semibold dark:border-rose-500/30 text-xs">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 font-semibold dark:border-amber-500/30 text-xs">
        <Clock className="w-3.5 h-3.5" /> Pending Review
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/employer/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Company Profile
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage public details that candidates see when applying for your jobs.
          </p>
        </div>

        {company && getStatusBadge(company.approvalStatus)}
      </div>

      <Card className="p-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Company Name"
            name="name"
            placeholder="e.g. Acme Innovations"
            value={formData.name}
            onChange={handleChange}
            icon={Building2}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Website URL"
              name="website"
              placeholder="https://company.com"
              value={formData.website}
              onChange={handleChange}
              icon={Globe}
            />

            <Input
              label="Headquarters Location"
              name="location"
              placeholder="City, Country (e.g. San Francisco, CA)"
              value={formData.location}
              onChange={handleChange}
              icon={MapPin}
            />
          </div>

          <Input
            label="About the Company"
            name="description"
            type="textarea"
            rows={5}
            placeholder="Describe your company culture, mission, team size, and what makes working here exciting..."
            value={formData.description}
            onChange={handleChange}
            icon={FileText}
          />

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Link to="/employer/dashboard">
              <Button variant="ghost" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
              icon={Save}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </PageTransition>
  );
}
