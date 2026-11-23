package com.hireloop.backend.service;

import com.hireloop.backend.dto.CandidateProfileRequest;
import com.hireloop.backend.dto.CandidateProfileResponse;
import com.hireloop.backend.dto.JobResponse;
import com.hireloop.backend.entity.CandidateProfile;
import com.hireloop.backend.entity.Job;
import com.hireloop.backend.entity.SavedJob;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.exception.BadRequestException;
import com.hireloop.backend.exception.ResourceNotFoundException;
import com.hireloop.backend.repository.ApplicationRepository;
import com.hireloop.backend.repository.CandidateProfileRepository;
import com.hireloop.backend.repository.JobRepository;
import com.hireloop.backend.repository.SavedJobRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final ApplicationRepository applicationRepository;
    private final FileStorageService fileStorageService;

    public CandidateService(CandidateProfileRepository candidateProfileRepository,
                            JobRepository jobRepository,
                            SavedJobRepository savedJobRepository,
                            ApplicationRepository applicationRepository,
                            FileStorageService fileStorageService) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.jobRepository = jobRepository;
        this.savedJobRepository = savedJobRepository;
        this.applicationRepository = applicationRepository;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Get Candidate Profile
     */
    @Transactional
    public CandidateProfileResponse getProfile(User user) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    CandidateProfile newProfile = CandidateProfile.builder()
                            .user(user)
                            .build();
                    return candidateProfileRepository.save(newProfile);
                });

        return CandidateProfileResponse.fromEntity(profile);
    }

    /**
     * Update Candidate Profile
     */
    @Transactional
    public CandidateProfileResponse updateProfile(User user, CandidateProfileRequest request) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> CandidateProfile.builder().user(user).build());

        profile.setUser(user);
        profile.setPhone(request.getPhone());
        profile.setLocation(request.getLocation());
        profile.setHeadline(request.getHeadline());
        profile.setSkills(request.getSkills());
        profile.setEducation(request.getEducation());
        profile.setExperience(request.getExperience());

        CandidateProfile saved = candidateProfileRepository.save(profile);
        return CandidateProfileResponse.fromEntity(saved);
    }

    /**
     * Upload Default Resume (PDF)
     */
    @Transactional
    public String uploadDefaultResume(User user, MultipartFile file) {
        String storedPath = fileStorageService.storeResume(file);

        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> CandidateProfile.builder().user(user).build());

        profile.setUser(user);
        profile.setDefaultResumePath(storedPath);
        candidateProfileRepository.save(profile);

        return storedPath;
    }

    /**
     * Load Candidate Default Resume file resource
     */
    @Transactional(readOnly = true)
    public Resource getDefaultResumeResource(User user) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        if (profile.getDefaultResumePath() == null || profile.getDefaultResumePath().trim().isEmpty()) {
            throw new ResourceNotFoundException("No default resume uploaded yet");
        }

        return fileStorageService.loadFileAsResource(profile.getDefaultResumePath());
    }

    /**
     * Save / Bookmark a Job
     */
    @Transactional
    public void saveJob(User user, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            SavedJob savedJob = SavedJob.builder()
                    .user(user)
                    .job(job)
                    .build();
            savedJobRepository.save(savedJob);
        }
    }

    /**
     * Unsave / Remove Bookmark for a Job
     */
    @Transactional
    public void unsaveJob(User user, Long jobId) {
        savedJobRepository.deleteByUserIdAndJobId(user.getId(), jobId);
    }

    /**
     * Get all Saved Jobs for logged-in candidate
     */
    @Transactional(readOnly = true)
    public List<JobResponse> getSavedJobs(User user) {
        List<SavedJob> savedJobs = savedJobRepository.findByUserIdOrderBySavedAtDesc(user.getId());

        return savedJobs.stream().map(saved -> {
            Job job = saved.getJob();
            long applicantCount = applicationRepository.countByJobId(job.getId());
            JobResponse res = JobResponse.fromEntity(job, applicantCount);
            res.setSaved(true);
            return res;
        }).collect(Collectors.toList());
    }

    /**
     * Check if a job is saved by current candidate
     */
    @Transactional(readOnly = true)
    public boolean isJobSaved(User user, Long jobId) {
        return savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId);
    }
}
