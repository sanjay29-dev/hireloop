package com.hireloop.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "saved_jobs",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_saved_job_user_job",
            columnNames = {"user_id", "job_id"}
        )
    }
)
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false, updatable = false)
    private LocalDateTime savedAt;

    public SavedJob() {
    }

    public SavedJob(Long id, User user, Job job, LocalDateTime savedAt) {
        this.id = id;
        this.user = user;
        this.job = job;
        this.savedAt = savedAt != null ? savedAt : LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.savedAt == null) {
            this.savedAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private Job job;
        private LocalDateTime savedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder job(Job job) {
            this.job = job;
            return this;
        }

        public Builder savedAt(LocalDateTime savedAt) {
            this.savedAt = savedAt;
            return this;
        }

        public SavedJob build() {
            return new SavedJob(id, user, job, savedAt);
        }
    }
}
