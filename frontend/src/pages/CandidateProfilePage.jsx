import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle2,
  FileCheck,
  Download,
  Save,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';

export default function CandidateProfilePage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    headline: '',
    skills: '',
    education: '',
    experience: '',
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/candidate/profile');
      const data = res.data.data;
      setProfile(data);
      setFormData({
        phone: data.phone || '',
        location: data.location || '',
        headline: data.headline || '',
        skills: data.skills || '',
        education: data.education || '',
        experience: data.experience || '',
      });
      setLoading(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to load profile');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    try {
      const res = await api.put('/candidate/profile', formData);
      setProfile(res.data.data);
      setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF document (.pdf)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingResume(true);
    try {
      await api.post('/candidate/profile/resume', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setToast({ show: true, message: 'Default resume uploaded successfully!', type: 'success' });
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  const handleDownloadResume = async () => {
    try {
      const res = await api.get('/candidate/profile/resume', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Could not download resume. Please upload a new resume.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <SkeletonLoader type="list" count={4} />
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

      {/* Header */}
      <div className="mb-8">
        <Link
          to="/candidate/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Candidate Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Keep your professional details and default resume up to date for fast 1-click applications.
        </p>
      </div>

      <div className="space-y-8">
        {/* Default Resume Upload Card */}
        <Card className="p-6 border-teal-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Default PDF Resume</h3>
                <p className="text-xs text-slate-400">
                  Used automatically when applying for any job on Hireloop.
                </p>
              </div>
            </div>

            {profile?.hasResume ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resume Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold border border-amber-500/30">
                No Resume Uploaded
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-900/60 p-4 rounded-xl border border-white/5">
            <div className="text-xs text-slate-300">
              {profile?.hasResume ? (
                <div className="space-y-1">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-400" />
                    {profile.defaultResumePath.split('/').pop()}
                  </p>
                  <p className="text-slate-400">Ready for instant job applications.</p>
                </div>
              ) : (
                <p className="text-slate-400">
                  Upload a PDF document (up to 10MB).
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {profile?.hasResume && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  onClick={handleDownloadResume}
                >
                  Download / View
                </Button>
              )}

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <Button
                  variant="primary"
                  size="sm"
                  icon={Upload}
                  loading={uploadingResume}
                  className="pointer-events-none"
                >
                  {profile?.hasResume ? 'Replace Resume' : 'Upload Resume'}
                </Button>
              </label>
            </div>
          </div>
        </Card>

        {/* Profile Details Form Card */}
        <Card className="p-8">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Readonly Account Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-6 border-b border-white/10">
              <Input
                label="Full Name"
                name="name"
                value={profile?.name || user?.name || ''}
                icon={User}
                disabled
              />
              <Input
                label="Email Address"
                name="email"
                value={profile?.email || user?.email || ''}
                icon={Mail}
                disabled
              />
            </div>

            {/* Editable Info */}
            <Input
              label="Professional Headline"
              name="headline"
              placeholder="e.g. Senior Java Full Stack Developer | Spring Boot, React, MySQL"
              value={formData.headline}
              onChange={handleChange}
              icon={Briefcase}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Contact Phone"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
              />

              <Input
                label="Current Location"
                name="location"
                placeholder="e.g. Bangalore, Karnataka, India"
                value={formData.location}
                onChange={handleChange}
                icon={MapPin}
              />
            </div>

            <Input
              label="Skills & Technologies (Comma separated)"
              name="skills"
              placeholder="e.g. Java, Spring Boot, React, MySQL, Hibernate, REST API, Git"
              value={formData.skills}
              onChange={handleChange}
            />

            <Input
              label="Education & Certifications"
              name="education"
              type="textarea"
              rows={3}
              placeholder="e.g. B.Tech in Computer Science, VTU Bangalore (2020 - 2024)"
              value={formData.education}
              onChange={handleChange}
              icon={GraduationCap}
            />

            <Input
              label="Work Experience / Internships"
              name="experience"
              type="textarea"
              rows={4}
              placeholder="e.g. Software Engineer at ABC Tech (2 years) - Developed REST microservices with Spring Boot and optimized MySQL database queries."
              value={formData.experience}
              onChange={handleChange}
              icon={FileText}
            />

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <Link to="/candidate/dashboard">
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
      </div>
    </PageTransition>
  );
}
