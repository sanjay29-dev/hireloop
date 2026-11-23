package com.hireloop.backend.controller;

import com.hireloop.backend.dto.ApiResponse;
import com.hireloop.backend.dto.ApplicationResponse;
import com.hireloop.backend.dto.UpdateApplicationStatusRequest;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.service.ApplicationService;
import com.hireloop.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final AuthService authService;

    public ApplicationController(ApplicationService applicationService, AuthService authService) {
        this.applicationService = applicationService;
        this.authService = authService;
    }

    // ==========================================
    // CANDIDATE APPLICATION ENDPOINTS
    // ==========================================

    /**
     * Submit an Application to a Job
     */
    @PostMapping(value = "/candidate/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyToJob(
            @RequestParam("jobId") Long jobId,
            @RequestParam(value = "useDefaultResume", defaultValue = "true") boolean useDefaultResume,
            @RequestParam(value = "file", required = false) MultipartFile customResume
    ) {
        User candidate = authService.getCurrentAuthenticatedUser();
        ApplicationResponse response = applicationService.applyToJob(candidate, jobId, useDefaultResume, customResume);
        return new ResponseEntity<>(ApiResponse.success("Application submitted successfully!", response), HttpStatus.CREATED);
    }

    /**
     * Get Candidate's Submitted Applications
     */
    @GetMapping("/candidate/applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications() {
        User candidate = authService.getCurrentAuthenticatedUser();
        List<ApplicationResponse> list = applicationService.getCandidateApplications(candidate);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved successfully", list));
    }

    /**
     * Withdraw an Application
     */
    @PatchMapping("/candidate/applications/{id}/withdraw")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> withdrawApplication(@PathVariable Long id) {
        User candidate = authService.getCurrentAuthenticatedUser();
        ApplicationResponse response = applicationService.withdrawApplication(candidate, id);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully", response));
    }

    /**
     * Check if Candidate has already applied to a job
     */
    @GetMapping("/candidate/applications/check/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkApplied(@PathVariable Long jobId) {
        User candidate = authService.getCurrentAuthenticatedUser();
        boolean hasApplied = applicationService.hasCandidateApplied(candidate, jobId);
        Map<String, Boolean> res = new HashMap<>();
        res.put("hasApplied", hasApplied);
        return ResponseEntity.ok(ApiResponse.success("Check completed", res));
    }

    // ==========================================
    // EMPLOYER APPLICANTS PIPELINE ENDPOINTS
    // ==========================================

    /**
     * Get All Applicants for a Specific Job
     */
    @GetMapping("/employer/jobs/{jobId}/applicants")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getJobApplicants(@PathVariable Long jobId) {
        User employer = authService.getCurrentAuthenticatedUser();
        List<ApplicationResponse> applicants = applicationService.getJobApplicants(employer, jobId);
        return ResponseEntity.ok(ApiResponse.success("Applicants retrieved successfully", applicants));
    }

    /**
     * Update an Applicant's Status
     * (APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED)
     */
    @PatchMapping("/employer/applications/{applicationId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody UpdateApplicationStatusRequest request
    ) {
        User employer = authService.getCurrentAuthenticatedUser();
        ApplicationResponse response = applicationService.updateApplicationStatus(employer, applicationId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Applicant status updated to " + request.getStatus(), response));
    }

    // ==========================================
    // RESUME DOWNLOAD ENDPOINT
    // ==========================================

    /**
     * Download or view the resume submitted with an application
     * Accessible by candidate, employer who owns the job, or admin
     */
    @GetMapping("/applications/{applicationId}/resume")
    public ResponseEntity<Resource> downloadApplicationResume(@PathVariable Long applicationId) {
        User user = authService.getCurrentAuthenticatedUser();
        Resource resource = applicationService.getApplicationResumeResource(user, applicationId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
