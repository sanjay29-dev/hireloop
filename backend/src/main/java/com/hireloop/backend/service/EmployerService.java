package com.hireloop.backend.service;

import com.hireloop.backend.dto.CompanyUpdateRequest;
import com.hireloop.backend.dto.EmployerStatsResponse;
import com.hireloop.backend.dto.JobRequest;
import com.hireloop.backend.dto.JobResponse;
import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.Job;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.ApplicationStatus;
import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.enums.CompanyStatus;
import com.hireloop.backend.enums.JobStatus;
import com.hireloop.backend.exception.BadRequestException;
import com.hireloop.backend.exception.EmployerNotApprovedException;
import com.hireloop.backend.exception.ResourceNotFoundException;
import com.hireloop.backend.repository.ApplicationRepository;
import com.hireloop.backend.repository.CompanyRepository;
import com.hireloop.backend.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EmployerService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public EmployerService(CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository) {
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    /**
     * Get Company profile for the authenticated employer
     */
    @Transactional(readOnly = true)
    public Company getCompany(User user) {
        return companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No company profile found for user"));
    }

    /**
     * Update Company profile
     */
    @Transactional
    public Company updateCompany(User user, CompanyUpdateRequest request) {
        Company company = getCompany(user);
        company.setName(request.getName().trim());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());
        company.setDescription(request.getDescription());
        if (request.getLogoPath() != null) {
            company.setLogoPath(request.getLogoPath());
        }
        return companyRepository.save(company);
    }

    /**
     * Get all jobs created by this employer
     */
    @Transactional(readOnly = true)
    public List<JobResponse> getEmployerJobs(User user) {
        Company company = getCompany(user);
        List<Job> jobs = jobRepository.findByCompanyId(company.getId());

        return jobs.stream().map(job -> {
            long applicantCount = applicationRepository.countByJobId(job.getId());
            return JobResponse.fromEntity(job, applicantCount);
        }).collect(Collectors.toList());
    }

    /**
     * Get a specific job by ID ensuring ownership
     */
    @Transactional(readOnly = true)
    public JobResponse getJobById(User user, Long jobId) {
        Company company = getCompany(user);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!job.getCompany().getId().equals(company.getId())) {
            throw new BadRequestException("You do not have permission to view or edit this job");
        }

        long applicantCount = applicationRepository.countByJobId(job.getId());
        return JobResponse.fromEntity(job, applicantCount);
    }

    /**
     * Create a new job listing
     * Business Rule: Employer must have approvalStatus = APPROVED and company status = ACTIVE
     */
    @Transactional
    public JobResponse createJob(User user, JobRequest request) {
        Company company = getCompany(user);

        if (company.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new EmployerNotApprovedException(
                    "Job posting is disabled. Your company registration status is '" +
                    company.getApprovalStatus() + "'. You must be APPROVED by an administrator before posting jobs."
            );
        }

        if (company.getStatus() == CompanyStatus.SUSPENDED) {
            throw new BadRequestException("Your company account has been suspended by administration. Job posting is disabled.");
        }

        Job job = Job.builder()
                .company(company)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .skills(request.getSkills())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .deadline(request.getDeadline())
                .status(JobStatus.ACTIVE)
                .build();

        Job savedJob = jobRepository.save(job);
        return JobResponse.fromEntity(savedJob, 0);
    }

    /**
     * Update an existing job
     */
    @Transactional
    public JobResponse updateJob(User user, Long jobId, JobRequest request) {
        Company company = getCompany(user);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!job.getCompany().getId().equals(company.getId())) {
            throw new BadRequestException("You do not have permission to edit this job");
        }

        if (company.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new EmployerNotApprovedException("Your company must be APPROVED to edit jobs");
        }

        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setSkills(request.getSkills());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        if (request.getCurrency() != null) {
            job.setCurrency(request.getCurrency());
        }
        job.setDeadline(request.getDeadline());

        Job updatedJob = jobRepository.save(job);
        long applicantCount = applicationRepository.countByJobId(updatedJob.getId());
        return JobResponse.fromEntity(updatedJob, applicantCount);
    }

    /**
     * Close a job posting
     */
    @Transactional
    public JobResponse closeJob(User user, Long jobId) {
        Company company = getCompany(user);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!job.getCompany().getId().equals(company.getId())) {
            throw new BadRequestException("You do not have permission to modify this job");
        }

        job.setStatus(JobStatus.CLOSED);
        Job updatedJob = jobRepository.save(job);
        long applicantCount = applicationRepository.countByJobId(updatedJob.getId());
        return JobResponse.fromEntity(updatedJob, applicantCount);
    }

    /**
     * Delete a job posting
     */
    @Transactional
    public void deleteJob(User user, Long jobId) {
        Company company = getCompany(user);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!job.getCompany().getId().equals(company.getId())) {
            throw new BadRequestException("You do not have permission to delete this job");
        }

        jobRepository.delete(job);
    }

    /**
     * Compute statistics for the employer dashboard
     */
    @Transactional(readOnly = true)
    public EmployerStatsResponse getEmployerStats(User user) {
        Company company = getCompany(user);
        List<Job> jobs = jobRepository.findByCompanyId(company.getId());

        long totalJobs = jobs.size();
        long activeJobs = jobs.stream().filter(j -> j.getStatus() == JobStatus.ACTIVE).count();
        long closedJobs = jobs.stream().filter(j -> j.getStatus() == JobStatus.CLOSED).count();

        long totalApplicants = 0;
        Map<String, Long> statusCounts = new HashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusCounts.put(status.name(), 0L);
        }

        if (!jobs.isEmpty()) {
            totalApplicants = applicationRepository.countByJobIn(jobs);
            for (ApplicationStatus status : ApplicationStatus.values()) {
                long count = applicationRepository.countByJobInAndStatus(jobs, status);
                statusCounts.put(status.name(), count);
            }
        }

        EmployerStatsResponse stats = new EmployerStatsResponse();
        stats.setTotalJobs(totalJobs);
        stats.setActiveJobs(activeJobs);
        stats.setClosedJobs(closedJobs);
        stats.setTotalApplicants(totalApplicants);
        stats.setStatusCounts(statusCounts);
        stats.setCompanyName(company.getName());
        stats.setApprovalStatus(company.getApprovalStatus());

        return stats;
    }
}
