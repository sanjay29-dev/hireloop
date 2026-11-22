package com.hireloop.backend.controller;

import com.hireloop.backend.dto.*;
import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.service.AuthService;
import com.hireloop.backend.service.EmployerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employer")
public class EmployerController {

    private final EmployerService employerService;
    private final AuthService authService;

    public EmployerController(EmployerService employerService, AuthService authService) {
        this.employerService = employerService;
        this.authService = authService;
    }

    /**
     * Get Company Profile
     */
    @GetMapping("/company")
    public ResponseEntity<ApiResponse<Company>> getCompanyProfile() {
        User user = authService.getCurrentAuthenticatedUser();
        Company company = employerService.getCompany(user);
        return ResponseEntity.ok(ApiResponse.success("Company profile retrieved", company));
    }

    /**
     * Update Company Profile
     */
    @PutMapping("/company")
    public ResponseEntity<ApiResponse<Company>> updateCompanyProfile(@Valid @RequestBody CompanyUpdateRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Company company = employerService.updateCompany(user, request);
        return ResponseEntity.ok(ApiResponse.success("Company profile updated successfully", company));
    }

    /**
     * Get Employer Dashboard Statistics (total jobs, applicants, count per status)
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<EmployerStatsResponse>> getDashboardStats() {
        User user = authService.getCurrentAuthenticatedUser();
        EmployerStatsResponse stats = employerService.getEmployerStats(user);
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved", stats));
    }

    /**
     * Get All Jobs Posted by Current Employer
     */
    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyJobs() {
        User user = authService.getCurrentAuthenticatedUser();
        List<JobResponse> jobs = employerService.getEmployerJobs(user);
        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved successfully", jobs));
    }

    /**
     * Get Job Details by ID
     */
    @GetMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        JobResponse job = employerService.getJobById(user, id);
        return ResponseEntity.ok(ApiResponse.success("Job retrieved successfully", job));
    }

    /**
     * Post a New Job
     * Blocked if employer is not APPROVED
     */
    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody JobRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        JobResponse job = employerService.createJob(user, request);
        return new ResponseEntity<>(ApiResponse.success("Job posted successfully", job), HttpStatus.CREATED);
    }

    /**
     * Update an Existing Job
     */
    @PutMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        JobResponse job = employerService.updateJob(user, id, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", job));
    }

    /**
     * Close a Job Listing
     */
    @PatchMapping("/jobs/{id}/close")
    public ResponseEntity<ApiResponse<JobResponse>> closeJob(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        JobResponse job = employerService.closeJob(user, id);
        return ResponseEntity.ok(ApiResponse.success("Job closed successfully", job));
    }

    /**
     * Delete a Job Listing
     */
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        employerService.deleteJob(user, id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully"));
    }
}
