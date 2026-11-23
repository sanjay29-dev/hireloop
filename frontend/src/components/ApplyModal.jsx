import React, { useState, useEffect } from 'react';
import { Send, Upload, FileCheck, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Modal from './Modal';
import Button from './Button';

export default function ApplyModal({
  isOpen,
  onClose,
  job,
  onApplicationSuccess,
}) {
  const [profile, setProfile] = useState(null);
  const [useDefault, setUseDefault] = useState(true);
  const [customFile, setCustomFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccess(false);
      setCustomFile(null);
      setFetchingProfile(true);

      api.get('/candidate/profile')
        .then((res) => {
          const prof = res.data.data;
          setProfile(prof);
          if (prof && prof.hasResume) {
            setUseDefault(true);
          } else {
            setUseDefault(false);
          }
          setFetchingProfile(false);
        })
        .catch(() => {
          setFetchingProfile(false);
        });
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
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

    setCustomFile(file);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!useDefault && !customFile) {
      setErrorMessage('Please select a PDF resume file to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('jobId', job.id);
    formData.append('useDefaultResume', useDefault);
    if (!useDefault && customFile) {
      formData.append('file', customFile);
    }

    try {
      await api.post('/candidate/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      if (onApplicationSuccess) {
        onApplicationSuccess();
      }
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to submit application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Position">
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            Your application for <strong className="text-white">{job.title}</strong> has been sent to {job.companyName}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
              Position
            </span>
            <h4 className="text-lg font-bold text-white">{job.title}</h4>
            <p className="text-xs text-slate-400">
              {job.companyName} • {job.location}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Resume Selection */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Choose Resume for this Application
            </span>

            {/* Option 1: Default Resume */}
            {profile?.hasResume ? (
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  useDefault
                    ? 'bg-violet-600/15 border-violet-500/40 shadow-glow-violet'
                    : 'bg-navy-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="resumeChoice"
                  checked={useDefault}
                  onChange={() => setUseDefault(true)}
                  className="mt-1 text-violet-600 focus:ring-violet-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-teal-400" />
                    <span className="text-sm font-semibold text-white">
                      Use Default Resume
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {profile.defaultResumePath.split('/').pop()}
                  </p>
                </div>
              </label>
            ) : null}

            {/* Option 2: Upload Custom Resume */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                !useDefault
                  ? 'bg-teal-600/15 border-teal-500/40 shadow-glow-teal'
                  : 'bg-navy-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="resumeChoice"
                checked={!useDefault}
                onChange={() => setUseDefault(false)}
                className="mt-1 text-teal-600 focus:ring-teal-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-semibold text-white">
                    Upload a different resume for this job
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a tailored PDF resume file (Max 10MB)
                </p>
              </div>
            </label>

            {!useDefault && (
              <div className="pt-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-violet-600/20 file:text-violet-300 hover:file:bg-violet-600/30 file:cursor-pointer"
                />
                {customFile && (
                  <p className="text-xs text-teal-300 mt-1.5 flex items-center gap-1 font-medium">
                    <FileText className="w-3.5 h-3.5" /> Selected: {customFile.name}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={Send}
            >
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
