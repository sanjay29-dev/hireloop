package com.hireloop.backend.service;

import com.hireloop.backend.dto.ApplicationResponse;
import com.hireloop.backend.entity.Application;
import com.hireloop.backend.entity.CandidateProfile;
import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.Job;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.ApplicationStatus;
import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.enums.CompanyStatus;
import com.hireloop.backend.enums.JobStatus;
import com.hireloop.backend.enums.Role;
import com.hireloop.backend.exception.BadRequestException;
import com.hireloop.backend.exception.ResourceNotFoundException;
import com.hireloop.backend.repository.ApplicationRepository;
import com.hireloop.backend.repository.CandidateProfileRepository;
import com.hireloop.backend.repository.CompanyRepository;
import com.hireloop.backend.repository.JobRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CompanyRepository companyRepository;
    private final FileStorageService fileStorageService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              CandidateProfileRepository candidateProfileRepository,
                              CompanyRepository companyRepository,
                              FileStorageService fileStorageService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.companyRepository = companyRepository;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Submit an application to a job.
     */
    @Transactional
    public ApplicationResponse applyToJob(User candidate, Long jobId, boolean useDefaultResume, MultipartFile customResume) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // Ensure job is active
        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job listing is no longer accepting applications.");
        }

        Company company = job.getCompany();
        if (company.getStatus() == CompanyStatus.SUSPENDED || company.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new BadRequestException("This employer is not authorized to accept applications.");
        }

        // Prevent duplicate applications
        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidate.getId())) {
            throw new BadRequestException("You have already submitted an application for this position.");
        }

        CandidateProfile profile = candidateProfileRepository.findByUserId(candidate.getId()).orElse(null);

        String resumePathToUse;
        if (customResume != null && !customResume.isEmpty()) {
            // Upload different resume for this application
            resumePathToUse = fileStorageService.storeResume(customResume);
        } else if (useDefaultResume) {
            // Use candidate's default resume
            if (profile == null || profile.getDefaultResumePath() == null || profile.getDefaultResumePath().trim().isEmpty()) {
                throw new BadRequestException("You do not have a default resume saved in your profile. Please upload a resume first.");
            }
            resumePathToUse = profile.getDefaultResumePath();
        } else {
            throw new BadRequestException("Please select your default resume or upload a custom resume for this application.");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .status(ApplicationStatus.APPLIED)
                .resumePath(resumePathToUse)
                .build();

        Application saved = applicationRepository.save(application);
        return ApplicationResponse.fromEntity(saved, profile);
    }

    /**
     * Get all applications submitted by the logged-in candidate
     */
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getCandidateApplications(User candidate) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(candidate.getId()).orElse(null);
        List<Application> applications = applicationRepository.findByCandidateIdOrderByAppliedAtDesc(candidate.getId());

        return applications.stream()
                .map(app -> ApplicationResponse.fromEntity(app, profile))
                .collect(Collectors.toList());
    }

    /**
     * Withdraw an application
     */
    @Transactional
    public ApplicationResponse withdrawApplication(User candidate, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!application.getCandidate().getId().equals(candidate.getId())) {
            throw new BadRequestException("You can only withdraw your own applications.");
        }

        if (application.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new BadRequestException("This application has already been withdrawn.");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        Application updated = applicationRepository.save(application);

        CandidateProfile profile = candidateProfileRepository.findByUserId(candidate.getId()).orElse(null);
        return ApplicationResponse.fromEntity(updated, profile);
    }

    /**
     * Check if a candidate has already applied to a job
     */
    @Transactional(readOnly = true)
    public boolean hasCandidateApplied(User candidate, Long jobId) {
        return applicationRepository.existsByJobIdAndCandidateId(jobId, candidate.getId());
    }

    /**
     * Get all applicants for a specific job (Employer View)
     */
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getJobApplicants(User employer, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // Verify employer owns this job
        if (!job.getCompany().getUser().getId().equals(employer.getId())) {
            throw new BadRequestException("You do not have permission to view applicants for this job.");
        }

        List<Application> applications = applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);

        return applications.stream().map(app -> {
            CandidateProfile profile = candidateProfileRepository.findByUserId(app.getCandidate().getId()).orElse(null);
            return ApplicationResponse.fromEntity(app, profile);
        }).collect(Collectors.toList());
    }

    /**
     * Update an applicant's status (Employer View)
     * Status options: APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED
     */
    @Transactional
    public ApplicationResponse updateApplicationStatus(User employer, Long applicationId, ApplicationStatus newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Verify employer owns the job
        if (!application.getJob().getCompany().getUser().getId().equals(employer.getId())) {
            throw new BadRequestException("You do not have permission to update this application.");
        }

        application.setStatus(newStatus);
        Application updated = applicationRepository.save(application);

        CandidateProfile profile = candidateProfileRepository.findByUserId(application.getCandidate().getId()).orElse(null);
        return ApplicationResponse.fromEntity(updated, profile);
    }

    /**
     * Download or view the resume submitted with an application
     * Authorized for: Candidate who applied, Employer who owns the job, or Admin
     */
    @Transactional(readOnly = true)
    public Resource getApplicationResumeResource(User user, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        boolean isCandidate = application.getCandidate().getId().equals(user.getId());
        boolean isEmployer = application.getJob().getCompany().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCandidate && !isEmployer && !isAdmin) {
            throw new BadRequestException("You do not have permission to view this resume.");
        }

        return fileStorageService.loadFileAsResource(application.getResumePath());
    }
}
