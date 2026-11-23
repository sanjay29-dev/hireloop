package com.hireloop.backend.controller;

import com.hireloop.backend.dto.AdminCompanyResponse;
import com.hireloop.backend.dto.AdminStatsResponse;
import com.hireloop.backend.dto.AdminUserResponse;
import com.hireloop.backend.dto.ApiResponse;
import com.hireloop.backend.dto.JobResponse;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.service.AdminService;
import com.hireloop.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    public AdminController(AdminService adminService, AuthService authService) {
        this.adminService = adminService;
        this.authService = authService;
    }

    /**
     * Get system-wide platform statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    /**
     * Get all pending employer company registrations
     */
    @GetMapping("/companies/pending")
    public ResponseEntity<List<AdminCompanyResponse>> getPendingCompanies() {
        return ResponseEntity.ok(adminService.getPendingCompanies());
    }

    /**
     * Get all companies
     */
    @GetMapping("/companies")
    public ResponseEntity<List<AdminCompanyResponse>> getAllCompanies() {
        return ResponseEntity.ok(adminService.getAllCompanies());
    }

    /**
     * Approve employer company registration
     */
    @PatchMapping("/companies/{id}/approve")
    public ResponseEntity<ApiResponse<AdminCompanyResponse>> approveCompany(@PathVariable Long id) {
        AdminCompanyResponse comp = adminService.approveCompany(id);
        return ResponseEntity.ok(ApiResponse.success("Company registration approved successfully", comp));
    }

    /**
     * Reject employer company registration
     */
    @PatchMapping("/companies/{id}/reject")
    public ResponseEntity<ApiResponse<AdminCompanyResponse>> rejectCompany(@PathVariable Long id) {
        AdminCompanyResponse comp = adminService.rejectCompany(id);
        return ResponseEntity.ok(ApiResponse.success("Company registration rejected", comp));
    }

    /**
     * Suspend company (hides all jobs & prevents employer login)
     */
    @PatchMapping("/companies/{id}/suspend")
    public ResponseEntity<ApiResponse<AdminCompanyResponse>> suspendCompany(@PathVariable Long id) {
        AdminCompanyResponse comp = adminService.suspendCompany(id);
        return ResponseEntity.ok(ApiResponse.success("Company suspended successfully. Job postings are now hidden.", comp));
    }

    /**
     * Reactivate company
     */
    @PatchMapping("/companies/{id}/reactivate")
    public ResponseEntity<ApiResponse<AdminCompanyResponse>> reactivateCompany(@PathVariable Long id) {
        AdminCompanyResponse comp = adminService.reactivateCompany(id);
        return ResponseEntity.ok(ApiResponse.success("Company reactivated successfully. Job postings are restored.", comp));
    }

    /**
     * Get all jobs across the platform
     */
    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(adminService.getAllJobs());
    }

    /**
     * Suspend a job posting
     */
    @PatchMapping("/jobs/{id}/suspend")
    public ResponseEntity<ApiResponse<JobResponse>> suspendJob(@PathVariable Long id) {
        JobResponse job = adminService.suspendJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job posting suspended successfully", job));
    }

    /**
     * Reactivate a job posting
     */
    @PatchMapping("/jobs/{id}/reactivate")
    public ResponseEntity<ApiResponse<JobResponse>> reactivateJob(@PathVariable Long id) {
        JobResponse job = adminService.reactivateJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job posting reactivated successfully", job));
    }

    /**
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    /**
     * Suspend user account
     */
    @PatchMapping("/users/{id}/suspend")
    public ResponseEntity<ApiResponse<AdminUserResponse>> suspendUser(@PathVariable Long id) {
        User admin = authService.getCurrentAuthenticatedUser();
        AdminUserResponse user = adminService.suspendUser(id, admin);
        return ResponseEntity.ok(ApiResponse.success("User account suspended successfully", user));
    }

    /**
     * Reactivate user account
     */
    @PatchMapping("/users/{id}/reactivate")
    public ResponseEntity<ApiResponse<AdminUserResponse>> reactivateUser(@PathVariable Long id) {
        AdminUserResponse user = adminService.reactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User account reactivated successfully", user));
    }
}
