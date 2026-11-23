package com.hireloop.backend.service;

import com.hireloop.backend.dto.JobResponse;
import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.Job;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.enums.CompanyStatus;
import com.hireloop.backend.enums.JobStatus;
import com.hireloop.backend.enums.JobType;
import com.hireloop.backend.exception.ResourceNotFoundException;
import com.hireloop.backend.repository.ApplicationRepository;
import com.hireloop.backend.repository.JobRepository;
import com.hireloop.backend.repository.SavedJobRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    public JobService(JobRepository jobRepository,
                      ApplicationRepository applicationRepository,
                      SavedJobRepository savedJobRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
    }

    /**
     * Search & Filter Jobs with Pagination and Sorting
     * Business Rule: Only returns ACTIVE jobs from ACTIVE and APPROVED companies
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> searchJobs(String keyword,
                                       String location,
                                       JobType jobType,
                                       Pageable pageable,
                                       User optionalCandidate) {

        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Only active jobs
            predicates.add(cb.equal(root.get("status"), JobStatus.ACTIVE));

            // 2. Join Company: Company must be ACTIVE and APPROVED
            Join<Job, Company> companyJoin = root.join("company");
            predicates.add(cb.equal(companyJoin.get("status"), CompanyStatus.ACTIVE));
            predicates.add(cb.equal(companyJoin.get("approvalStatus"), ApprovalStatus.APPROVED));

            // 3. Keyword Search (title, description, or skills)
            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate titlePredicate = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descPredicate = cb.like(cb.lower(root.get("description")), searchPattern);
                Predicate skillsPredicate = cb.like(cb.lower(root.get("skills")), searchPattern);
                predicates.add(cb.or(titlePredicate, descPredicate, skillsPredicate));
            }

            // 4. Location Search
            if (location != null && !location.trim().isEmpty()) {
                String locPattern = "%" + location.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("location")), locPattern));
            }

            // 5. Job Type filter
            if (jobType != null) {
                predicates.add(cb.equal(root.get("jobType"), jobType));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Job> jobPage = jobRepository.findAll(spec, pageable);

        return jobPage.map(job -> {
            long count = applicationRepository.countByJobId(job.getId());
            JobResponse res = JobResponse.fromEntity(job, count);
            if (optionalCandidate != null) {
                res.setSaved(savedJobRepository.existsByUserIdAndJobId(optionalCandidate.getId(), job.getId()));
            }
            return res;
        });
    }

    /**
     * Get Job Details by ID
     */
    @Transactional(readOnly = true)
    public JobResponse getJobDetails(Long jobId, User optionalCandidate) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // Ensure company is not suspended
        if (job.getCompany().getStatus() == CompanyStatus.SUSPENDED) {
            throw new ResourceNotFoundException("This job listing is no longer active");
        }

        long count = applicationRepository.countByJobId(job.getId());
        JobResponse response = JobResponse.fromEntity(job, count);

        if (optionalCandidate != null) {
            response.setSaved(savedJobRepository.existsByUserIdAndJobId(optionalCandidate.getId(), job.getId()));
        }

        return response;
    }
}
