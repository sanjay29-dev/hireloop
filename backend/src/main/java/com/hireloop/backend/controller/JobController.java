package com.hireloop.backend.controller;

import com.hireloop.backend.dto.ApiResponse;
import com.hireloop.backend.dto.JobResponse;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.JobType;
import com.hireloop.backend.repository.UserRepository;
import com.hireloop.backend.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    public JobController(JobService jobService, UserRepository userRepository) {
        this.jobService = jobService;
        this.userRepository = userRepository;
    }

    private User getOptionalCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return userRepository.findByEmail(auth.getName()).orElse(null);
        }
        return null;
    }

    /**
     * Search and Filter Jobs with Sorting and Pagination
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = "asc".equalsIgnoreCase(direction) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        User currentUser = getOptionalCurrentUser();
        Page<JobResponse> jobs = jobService.searchJobs(keyword, location, jobType, pageable, currentUser);

        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved successfully", jobs));
    }

    /**
     * Get Job Details by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        User currentUser = getOptionalCurrentUser();
        JobResponse job = jobService.getJobDetails(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Job details retrieved", job));
    }
}
