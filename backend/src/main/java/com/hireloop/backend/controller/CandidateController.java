package com.hireloop.backend.controller;

import com.hireloop.backend.dto.ApiResponse;
import com.hireloop.backend.dto.CandidateProfileRequest;
import com.hireloop.backend.dto.CandidateProfileResponse;
import com.hireloop.backend.dto.JobResponse;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.service.AuthService;
import com.hireloop.backend.service.CandidateService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final CandidateService candidateService;
    private final AuthService authService;

    public CandidateController(CandidateService candidateService, AuthService authService) {
        this.candidateService = candidateService;
        this.authService = authService;
    }

    /**
     * Get Candidate Profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> getProfile() {
        User user = authService.getCurrentAuthenticatedUser();
        CandidateProfileResponse profile = candidateService.getProfile(user);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    /**
     * Update Candidate Profile
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> updateProfile(@RequestBody CandidateProfileRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        CandidateProfileResponse profile = candidateService.updateProfile(user, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    /**
     * Upload Default Resume (PDF)
     */
    @PostMapping(value = "/profile/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadResume(@RequestParam("file") MultipartFile file) {
        User user = authService.getCurrentAuthenticatedUser();
        String resumePath = candidateService.uploadDefaultResume(user, file);
        Map<String, String> data = new HashMap<>();
        data.put("resumePath", resumePath);
        return new ResponseEntity<>(ApiResponse.success("Resume uploaded successfully", data), HttpStatus.CREATED);
    }

    /**
     * Download or Preview Default Resume
     */
    @GetMapping("/profile/resume")
    public ResponseEntity<Resource> downloadDefaultResume() {
        User user = authService.getCurrentAuthenticatedUser();
        Resource resource = candidateService.getDefaultResumeResource(user);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    /**
     * Get All Saved / Bookmarked Jobs
     */
    @GetMapping("/saved-jobs")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getSavedJobs() {
        User user = authService.getCurrentAuthenticatedUser();
        List<JobResponse> savedJobs = candidateService.getSavedJobs(user);
        return ResponseEntity.ok(ApiResponse.success("Saved jobs retrieved successfully", savedJobs));
    }

    /**
     * Save a Job
     */
    @PostMapping("/saved-jobs/{jobId}")
    public ResponseEntity<ApiResponse<Void>> saveJob(@PathVariable Long jobId) {
        User user = authService.getCurrentAuthenticatedUser();
        candidateService.saveJob(user, jobId);
        return ResponseEntity.ok(ApiResponse.success("Job saved successfully"));
    }

    /**
     * Remove / Unsave a Job
     */
    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<ApiResponse<Void>> unsaveJob(@PathVariable Long jobId) {
        User user = authService.getCurrentAuthenticatedUser();
        candidateService.unsaveJob(user, jobId);
        return ResponseEntity.ok(ApiResponse.success("Job removed from saved list"));
    }

    /**
     * Check if a job is saved
     */
    @GetMapping("/saved-jobs/check/{jobId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkJobSaved(@PathVariable Long jobId) {
        User user = authService.getCurrentAuthenticatedUser();
        boolean isSaved = candidateService.isJobSaved(user, jobId);
        Map<String, Boolean> res = new HashMap<>();
        res.put("isSaved", isSaved);
        return ResponseEntity.ok(ApiResponse.success("Check completed", res));
    }
}
