package com.hireloop.backend.dto;

import com.hireloop.backend.entity.Job;
import com.hireloop.backend.enums.JobStatus;
import com.hireloop.backend.enums.JobType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobResponse {

    private Long id;
    private Long companyId;
    private String companyName;
    private String companyLocation;
    private String companyLogo;
    private com.hireloop.backend.enums.CompanyStatus companyStatus;
    private com.hireloop.backend.enums.ApprovalStatus companyApprovalStatus;
    private String title;
    private String description;
    private String skills;
    private String location;
    private JobType jobType;
    private Double salaryMin;
    private Double salaryMax;
    private String currency = "INR";
    private LocalDate deadline;
    private JobStatus status;
    private LocalDateTime createdAt;
    private long applicantCount;
    private boolean isSaved = false;

    public JobResponse() {
    }

    public static JobResponse fromEntity(Job job, long applicantCount) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        if (job.getCompany() != null) {
            response.setCompanyId(job.getCompany().getId());
            response.setCompanyName(job.getCompany().getName());
            response.setCompanyLocation(job.getCompany().getLocation());
            response.setCompanyLogo(job.getCompany().getLogoPath());
            response.setCompanyStatus(job.getCompany().getStatus());
            response.setCompanyApprovalStatus(job.getCompany().getApprovalStatus());
        }
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setSkills(job.getSkills());
        response.setLocation(job.getLocation());
        response.setJobType(job.getJobType());
        response.setSalaryMin(job.getSalaryMin());
        response.setSalaryMax(job.getSalaryMax());
        response.setCurrency(job.getCurrency() != null ? job.getCurrency() : "INR");
        response.setDeadline(job.getDeadline());
        response.setStatus(job.getStatus());
        response.setCreatedAt(job.getCreatedAt());
        response.setApplicantCount(applicantCount);
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }

    public String getCompanyLogo() {
        return companyLogo;
    }

    public void setCompanyLogo(String companyLogo) {
        this.companyLogo = companyLogo;
    }

    public com.hireloop.backend.enums.CompanyStatus getCompanyStatus() {
        return companyStatus;
    }

    public void setCompanyStatus(com.hireloop.backend.enums.CompanyStatus companyStatus) {
        this.companyStatus = companyStatus;
    }

    public com.hireloop.backend.enums.ApprovalStatus getCompanyApprovalStatus() {
        return companyApprovalStatus;
    }

    public void setCompanyApprovalStatus(com.hireloop.backend.enums.ApprovalStatus companyApprovalStatus) {
        this.companyApprovalStatus = companyApprovalStatus;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public Double getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(Double salaryMin) {
        this.salaryMin = salaryMin;
    }

    public Double getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(Double salaryMax) {
        this.salaryMax = salaryMax;
    }

    public String getCurrency() {
        return currency != null ? currency : "INR";
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getApplicantCount() {
        return applicantCount;
    }

    public void setApplicantCount(long applicantCount) {
        this.applicantCount = applicantCount;
    }

    public boolean isSaved() {
        return isSaved;
    }

    public void setSaved(boolean saved) {
        isSaved = saved;
    }
}
