package com.hireloop.backend.service;

import com.hireloop.backend.dto.AdminCompanyResponse;
import com.hireloop.backend.dto.AdminStatsResponse;
import com.hireloop.backend.dto.AdminUserResponse;
import com.hireloop.backend.dto.JobResponse;
import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.Job;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.*;
import com.hireloop.backend.exception.BadRequestException;
import com.hireloop.backend.exception.ResourceNotFoundException;
import com.hireloop.backend.repository.ApplicationRepository;
import com.hireloop.backend.repository.CompanyRepository;
import com.hireloop.backend.repository.JobRepository;
import com.hireloop.backend.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminService(UserRepository userRepository,
                        CompanyRepository companyRepository,
                        JobRepository jobRepository,
                        ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    /**
     * Compute system-wide administration statistics
     */
    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalEmployers = userRepository.countByRole(Role.EMPLOYER);
        long totalCandidates = userRepository.countByRole(Role.CANDIDATE);

        long totalCompanies = companyRepository.count();
        long pendingCompanies = companyRepository.countByApprovalStatus(ApprovalStatus.PENDING);
        long approvedCompanies = companyRepository.countByApprovalStatus(ApprovalStatus.APPROVED);

        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.ACTIVE);

        long totalApplications = applicationRepository.count();

        return new AdminStatsResponse(
                totalUsers,
                totalEmployers,
                totalCandidates,
                totalCompanies,
                pendingCompanies,
                approvedCompanies,
                totalJobs,
                activeJobs,
                totalApplications
        );
    }

    /**
     * Get all companies awaiting admin approval (PENDING)
     */
    @Transactional(readOnly = true)
    public List<AdminCompanyResponse> getPendingCompanies() {
        List<Company> pending = companyRepository.findByApprovalStatus(ApprovalStatus.PENDING);
        return pending.stream().map(comp -> {
            long jobCount = jobRepository.countByCompanyId(comp.getId());
            return AdminCompanyResponse.fromEntity(comp, jobCount);
        }).collect(Collectors.toList());
    }

    /**
     * Get all registered companies
     */
    @Transactional(readOnly = true)
    public List<AdminCompanyResponse> getAllCompanies() {
        List<Company> companies = companyRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        return companies.stream().map(comp -> {
            long jobCount = jobRepository.countByCompanyId(comp.getId());
            return AdminCompanyResponse.fromEntity(comp, jobCount);
        }).collect(Collectors.toList());
    }

    /**
     * Approve employer company registration
     */
    @Transactional
    public AdminCompanyResponse approveCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        company.setApprovalStatus(ApprovalStatus.APPROVED);
        Company saved = companyRepository.save(company);
        long jobCount = jobRepository.countByCompanyId(saved.getId());
        return AdminCompanyResponse.fromEntity(saved, jobCount);
    }

    /**
     * Reject employer company registration
     */
    @Transactional
    public AdminCompanyResponse rejectCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        company.setApprovalStatus(ApprovalStatus.REJECTED);
        Company saved = companyRepository.save(company);
        long jobCount = jobRepository.countByCompanyId(saved.getId());
        return AdminCompanyResponse.fromEntity(saved, jobCount);
    }

    /**
     * Suspend company (does not hard delete; hides its jobs from candidates)
     */
    @Transactional
    public AdminCompanyResponse suspendCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        company.setStatus(CompanyStatus.SUSPENDED);
        Company saved = companyRepository.save(company);
        long jobCount = jobRepository.countByCompanyId(saved.getId());
        return AdminCompanyResponse.fromEntity(saved, jobCount);
    }

    /**
     * Reactivate company
     */
    @Transactional
    public AdminCompanyResponse reactivateCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        company.setStatus(CompanyStatus.ACTIVE);
        Company saved = companyRepository.save(company);
        long jobCount = jobRepository.countByCompanyId(saved.getId());
        return AdminCompanyResponse.fromEntity(saved, jobCount);
    }

    /**
     * View all job postings across the portal
     */
    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobs() {
        List<Job> jobs = jobRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        return jobs.stream().map(job -> {
            long count = applicationRepository.countByJobId(job.getId());
            return JobResponse.fromEntity(job, count);
        }).collect(Collectors.toList());
    }

    /**
     * Suspend a job posting
     */
    @Transactional
    public JobResponse suspendJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        job.setStatus(JobStatus.SUSPENDED);
        Job saved = jobRepository.save(job);
        long count = applicationRepository.countByJobId(saved.getId());
        return JobResponse.fromEntity(saved, count);
    }

    /**
     * Reactivate a job posting
     */
    @Transactional
    public JobResponse reactivateJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        job.setStatus(JobStatus.ACTIVE);
        Job saved = jobRepository.save(job);
        long count = applicationRepository.countByJobId(saved.getId());
        return JobResponse.fromEntity(saved, count);
    }

    /**
     * View all registered users (candidates, employers, admins)
     */
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<Company> companies = companyRepository.findAll();
        Map<Long, Company> companyByUserId = companies.stream()
                .filter(c -> c.getUser() != null)
                .collect(Collectors.toMap(c -> c.getUser().getId(), c -> c, (c1, c2) -> c1));

        return users.stream().map(u -> {
            Company comp = companyByUserId.get(u.getId());
            return AdminUserResponse.fromEntity(u, comp);
        }).collect(Collectors.toList());
    }

    /**
     * Suspend user account
     */
    @Transactional
    public AdminUserResponse suspendUser(Long userId, User adminUser) {
        if (adminUser.getId().equals(userId)) {
            throw new BadRequestException("You cannot suspend your own administrator account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setStatus(UserStatus.SUSPENDED);
        User saved = userRepository.save(user);
        Company comp = companyRepository.findByUserId(saved.getId()).orElse(null);
        return AdminUserResponse.fromEntity(saved, comp);
    }

    /**
     * Reactivate user account
     */
    @Transactional
    public AdminUserResponse reactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setStatus(UserStatus.ACTIVE);
        User saved = userRepository.save(user);
        Company comp = companyRepository.findByUserId(saved.getId()).orElse(null);
        return AdminUserResponse.fromEntity(saved, comp);
    }
}
