package com.hireloop.backend.entity;

import com.hireloop.backend.enums.ApplicationStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "applications",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_application_job_candidate",
            columnNames = {"job_id", "candidate_id"}
        )
    }
)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "resume_path", nullable = false, length = 255)
    private String resumePath;

    @Column(nullable = false, updatable = false)
    private LocalDateTime appliedAt;

    public Application() {
    }

    public Application(Long id, Job job, User candidate, ApplicationStatus status, String resumePath, LocalDateTime appliedAt) {
        this.id = id;
        this.job = job;
        this.candidate = candidate;
        this.status = status != null ? status : ApplicationStatus.APPLIED;
        this.resumePath = resumePath;
        this.appliedAt = appliedAt != null ? appliedAt : LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.appliedAt == null) {
            this.appliedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = ApplicationStatus.APPLIED;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Job job;
        private User candidate;
        private ApplicationStatus status = ApplicationStatus.APPLIED;
        private String resumePath;
        private LocalDateTime appliedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder job(Job job) {
            this.job = job;
            return this;
        }

        public Builder candidate(User candidate) {
            this.candidate = candidate;
            return this;
        }

        public Builder status(ApplicationStatus status) {
            this.status = status;
            return this;
        }

        public Builder resumePath(String resumePath) {
            this.resumePath = resumePath;
            return this;
        }

        public Builder appliedAt(LocalDateTime appliedAt) {
            this.appliedAt = appliedAt;
            return this;
        }

        public Application build() {
            return new Application(id, job, candidate, status, resumePath, appliedAt);
        }
    }
}
