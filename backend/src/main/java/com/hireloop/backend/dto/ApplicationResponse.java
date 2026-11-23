package com.hireloop.backend.dto;

import com.hireloop.backend.entity.Application;
import com.hireloop.backend.entity.CandidateProfile;
import com.hireloop.backend.entity.Job;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.ApplicationStatus;
import com.hireloop.backend.enums.JobType;

import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private String jobLocation;
    private JobType jobType;
    private String companyName;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String candidateLocation;
    private String candidateHeadline;
    private String candidateSkills;
    private String candidateEducation;
    private String candidateExperience;

    private ApplicationStatus status;
    private String resumePath;
    private LocalDateTime appliedAt;

    public ApplicationResponse() {
    }

    public static ApplicationResponse fromEntity(Application app, CandidateProfile profile) {
        ApplicationResponse res = new ApplicationResponse();
        res.setId(app.getId());

        Job job = app.getJob();
        if (job != null) {
            res.setJobId(job.getId());
            res.setJobTitle(job.getTitle());
            res.setJobLocation(job.getLocation());
            res.setJobType(job.getJobType());
            if (job.getCompany() != null) {
                res.setCompanyName(job.getCompany().getName());
            }
        }

        User candidate = app.getCandidate();
        if (candidate != null) {
            res.setCandidateId(candidate.getId());
            res.setCandidateName(candidate.getName());
            res.setCandidateEmail(candidate.getEmail());
        }

        if (profile != null) {
            res.setCandidatePhone(profile.getPhone());
            res.setCandidateLocation(profile.getLocation());
            res.setCandidateHeadline(profile.getHeadline());
            res.setCandidateSkills(profile.getSkills());
            res.setCandidateEducation(profile.getEducation());
            res.setCandidateExperience(profile.getExperience());
        }

        res.setStatus(app.getStatus());
        res.setResumePath(app.getResumePath());
        res.setAppliedAt(app.getAppliedAt());

        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getCandidatePhone() {
        return candidatePhone;
    }

    public void setCandidatePhone(String candidatePhone) {
        this.candidatePhone = candidatePhone;
    }

    public String getCandidateLocation() {
        return candidateLocation;
    }

    public void setCandidateLocation(String candidateLocation) {
        this.candidateLocation = candidateLocation;
    }

    public String getCandidateHeadline() {
        return candidateHeadline;
    }

    public void setCandidateHeadline(String candidateHeadline) {
        this.candidateHeadline = candidateHeadline;
    }

    public String getCandidateSkills() {
        return skillsOrEmpty();
    }

    private String skillsOrEmpty() {
        return candidateSkills;
    }

    public String getCandidateEducation() {
        return candidateEducation;
    }

    public void setCandidateEducation(String candidateEducation) {
        this.candidateEducation = candidateEducation;
    }

    public String getCandidateExperience() {
        return candidateExperience;
    }

    public void setCandidateExperience(String candidateExperience) {
        this.candidateExperience = candidateExperience;
    }

    public void setCandidateSkills(String candidateSkills) {
        this.candidateSkills = candidateSkills;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
}
