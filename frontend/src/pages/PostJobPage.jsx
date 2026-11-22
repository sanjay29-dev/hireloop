import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

export default function PostJobPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isApproved = user?.companyApprovalStatus === 'APPROVED';

  const [formData, setFormData] = useState({
    title: '',
    jobType: 'FULL_TIME',
    location: '',
    skills: '',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // If in edit mode, fetch existing job details
  useEffect(() => {
    if (isEditMode) {
      api.get(`/employer/jobs/${id}`)
        .then((res) => {
          const job = res.data.data;
          setFormData({
            title: job.title || '',
            jobType: job.jobType || 'FULL_TIME',
            location: job.location || '',
            skills: job.skills || '',
            salaryMin: job.salaryMin != null ? job.salaryMin : '',
            salaryMax: job.salaryMax != null ? job.salaryMax : '',
            deadline: job.deadline || '',
            description: job.description || '',
          });
          setFetching(false);
        })
        .catch((err) => {
          setErrorMessage(err.response?.data?.message || 'Failed to load job details');
          setFetching(false);
        });
    }
  }, [id, isEditMode]);

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

    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMessage('Please fill in required fields (Job Title and Description).');
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
      deadline: formData.deadline || null,
    };

    try {
      if (isEditMode) {
        await api.put(`/employer/jobs/${id}`, payload);
      } else {
        await api.post('/employer/jobs', payload);
      }
      navigate('/employer/jobs');
    } catch (err) {
      if (err.response?.data?.fieldErrors) {
        setFieldErrors(err.response.data.fieldErrors);
      }
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save job posting'
      );
    } finally {
      setLoading(false);
    }
  };

  // If employer is not approved, block posting jobs with a clear message
  if (!isApproved && !isEditMode) {
    return (
      <PageTransition className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Card className="p-10 border-amber-500/30 bg-navy-900/80">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-6">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">
            Approval Required to Post Jobs
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
            Your company account (<strong>{user?.companyName}</strong>) is currently pending admin review. As soon as an administrator verifies and approves your registration, you will be able to post and manage job listings.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/employer/dashboard">
              <Button variant="secondary" size="md" icon={ArrowLeft}>
                Back to Dashboard
              </Button>
            </Link>
            <Link to="/employer/company">
              <Button variant="outline" size="md">
                Review Company Profile
              </Button>
            </Link>
          </div>
        </Card>
      </PageTransition>
    );
  }

  if (fetching) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/employer/jobs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Jobs
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isEditMode ? 'Edit Job Posting' : 'Create New Job Listing'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {isEditMode
            ? 'Update the requirements and details for this role.'
            : 'Fill in the position requirements to start collecting applications.'}
        </p>
      </div>

      <Card className="p-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Job Title"
            name="title"
            placeholder="e.g. Senior Java Backend Developer"
            value={formData.title}
            onChange={handleChange}
            icon={Briefcase}
            error={fieldErrors.title}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Job Type <span className="text-violet-400">*</span>
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full rounded-xl bg-navy-900/60 border border-white/10 hover:border-white/20 focus:border-violet-500 text-white text-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 backdrop-blur-md transition-all"
              >
                <option value="FULL_TIME" className="bg-navy-900">Full Time</option>
                <option value="PART_TIME" className="bg-navy-900">Part Time</option>
                <option value="CONTRACT" className="bg-navy-900">Contract</option>
                <option value="REMOTE" className="bg-navy-900">Remote</option>
                <option value="INTERNSHIP" className="bg-navy-900">Internship</option>
              </select>
            </div>

            <Input
              label="Location"
              name="location"
              placeholder="e.g. Remote, or New York, NY"
              value={formData.location}
              onChange={handleChange}
              icon={MapPin}
              error={fieldErrors.location}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input
              label="Minimum Salary ($/yr)"
              name="salaryMin"
              type="number"
              placeholder="e.g. 90000"
              value={formData.salaryMin}
              onChange={handleChange}
              icon={DollarSign}
              error={fieldErrors.salaryMin}
            />

            <Input
              label="Maximum Salary ($/yr)"
              name="salaryMax"
              type="number"
              placeholder="e.g. 130000"
              value={formData.salaryMax}
              onChange={handleChange}
              icon={DollarSign}
              error={fieldErrors.salaryMax}
            />

            <Input
              label="Application Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              icon={Calendar}
              error={fieldErrors.deadline}
            />
          </div>

          <Input
            label="Required Skills (Comma separated)"
            name="skills"
            placeholder="e.g. Java, Spring Boot, MySQL, REST API, Git"
            value={formData.skills}
            onChange={handleChange}
            error={fieldErrors.skills}
          />

          <Input
            label="Detailed Job Description"
            name="description"
            type="textarea"
            rows={7}
            placeholder="Outline the responsibilities, qualifications, tech stack, and benefits..."
            value={formData.description}
            onChange={handleChange}
            error={fieldErrors.description}
            required
          />

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Link to="/employer/jobs">
              <Button variant="ghost" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={CheckCircle2}
            >
              {isEditMode ? 'Update Job Listing' : 'Publish Job Listing'}
            </Button>
          </div>
        </form>
      </Card>
    </PageTransition>
  );
}
