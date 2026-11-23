import api from './api';

export const adminService = {
  // Stats
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  // Employer Companies
  getPendingCompanies: async () => {
    const res = await api.get('/admin/companies/pending');
    return res.data;
  },

  getAllCompanies: async () => {
    const res = await api.get('/admin/companies');
    return res.data;
  },

  approveCompany: async (id) => {
    const res = await api.patch(`/admin/companies/${id}/approve`);
    return res.data;
  },

  rejectCompany: async (id) => {
    const res = await api.patch(`/admin/companies/${id}/reject`);
    return res.data;
  },

  suspendCompany: async (id) => {
    const res = await api.patch(`/admin/companies/${id}/suspend`);
    return res.data;
  },

  reactivateCompany: async (id) => {
    const res = await api.patch(`/admin/companies/${id}/reactivate`);
    return res.data;
  },

  // Job Postings
  getAllJobs: async () => {
    const res = await api.get('/admin/jobs');
    return res.data;
  },

  suspendJob: async (id) => {
    const res = await api.patch(`/admin/jobs/${id}/suspend`);
    return res.data;
  },

  reactivateJob: async (id) => {
    const res = await api.patch(`/admin/jobs/${id}/reactivate`);
    return res.data;
  },

  // User Accounts
  getAllUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  suspendUser: async (id) => {
    const res = await api.patch(`/admin/users/${id}/suspend`);
    return res.data;
  },

  reactivateUser: async (id) => {
    const res = await api.patch(`/admin/users/${id}/reactivate`);
    return res.data;
  },
};

export default adminService;
