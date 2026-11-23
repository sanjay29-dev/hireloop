package com.hireloop.backend.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalEmployers;
    private long totalCandidates;
    private long totalCompanies;
    private long pendingCompanies;
    private long approvedCompanies;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long totalEmployers, long totalCandidates,
                              long totalCompanies, long pendingCompanies, long approvedCompanies,
                              long totalJobs, long activeJobs, long totalApplications) {
        this.totalUsers = totalUsers;
        this.totalEmployers = totalEmployers;
        this.totalCandidates = totalCandidates;
        this.totalCompanies = totalCompanies;
        this.pendingCompanies = pendingCompanies;
        this.approvedCompanies = approvedCompanies;
        this.totalJobs = totalJobs;
        this.activeJobs = activeJobs;
        this.totalApplications = totalApplications;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalEmployers() {
        return totalEmployers;
    }

    public void setTotalEmployers(long totalEmployers) {
        this.totalEmployers = totalEmployers;
    }

    public long getTotalCandidates() {
        return totalCandidates;
    }

    public void setTotalCandidates(long totalCandidates) {
        this.totalCandidates = totalCandidates;
    }

    public long getTotalCompanies() {
        return totalCompanies;
    }

    public void setTotalCompanies(long totalCompanies) {
        this.totalCompanies = totalCompanies;
    }

    public long getPendingCompanies() {
        return pendingCompanies;
    }

    public void setPendingCompanies(long pendingCompanies) {
        this.pendingCompanies = pendingCompanies;
    }

    public long getApprovedCompanies() {
        return approvedCompanies;
    }

    public void setApprovedCompanies(long approvedCompanies) {
        this.approvedCompanies = approvedCompanies;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }
}
