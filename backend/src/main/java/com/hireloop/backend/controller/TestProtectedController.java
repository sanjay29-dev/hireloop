package com.hireloop.backend.controller;

import com.hireloop.backend.dto.ApiResponse;
import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.exception.EmployerNotApprovedException;
import com.hireloop.backend.repository.CompanyRepository;
import com.hireloop.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestProtectedController {

    private final AuthService authService;
    private final CompanyRepository companyRepository;

    public TestProtectedController(AuthService authService, CompanyRepository companyRepository) {
        this.authService = authService;
        this.companyRepository = companyRepository;
    }

    /**
     * Candidate-only protected endpoint
     */
    @GetMapping("/candidate/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> candidateAccess() {
        User user = authService.getCurrentAuthenticatedUser();
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Welcome Candidate " + user.getName());
        data.put("role", user.getRole());
        return ResponseEntity.ok(ApiResponse.success("Candidate access granted", data));
    }

    /**
     * Employer protected endpoint
     */
    @GetMapping("/employer/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> employerAccess() {
        User user = authService.getCurrentAuthenticatedUser();
        Company company = companyRepository.findByUserId(user.getId()).orElse(null);
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Welcome Employer " + user.getName());
        data.put("company", company != null ? company.getName() : null);
        data.put("approvalStatus", company != null ? company.getApprovalStatus() : null);
        return ResponseEntity.ok(ApiResponse.success("Employer access granted", data));
    }

    /**
     * Test job posting check: blocks unapproved employers
     */
    @PostMapping("/employer/jobs/test-post")
    public ResponseEntity<ApiResponse<String>> testJobPostPermission() {
        User user = authService.getCurrentAuthenticatedUser();
        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new EmployerNotApprovedException("No company associated with this employer"));

        if (company.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new EmployerNotApprovedException(
                    "Job posting is disabled. Your company registration status is '" +
                    company.getApprovalStatus() + "'. You must be APPROVED by an administrator before posting jobs."
            );
        }

        return ResponseEntity.ok(ApiResponse.success("Permission granted: Employer is approved to post jobs"));
    }

    /**
     * Admin-only protected endpoint
     */
    @GetMapping("/admin/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminAccess() {
        User user = authService.getCurrentAuthenticatedUser();
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Welcome Admin " + user.getName());
        data.put("role", user.getRole());
        return ResponseEntity.ok(ApiResponse.success("Admin access granted", data));
    }
}
