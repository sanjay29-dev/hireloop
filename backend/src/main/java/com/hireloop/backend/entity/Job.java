package com.hireloop.backend.entity;

import com.hireloop.backend.enums.JobStatus;
import com.hireloop.backend.enums.JobType;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false, length = 30)
    private JobType jobType;

    @Column(name = "salary_min")
    private Double salaryMin;

    @Column(name = "salary_max")
    private Double salaryMax;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private JobStatus status = JobStatus.ACTIVE;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Job() {
    }

    public Job(Long id, Company company, String title, String description, String skills, String location, JobType jobType, Double salaryMin, Double salaryMax, LocalDate deadline, JobStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.company = company;
        this.title = title;
        this.description = description;
        this.skills = skills;
        this.location = location;
        this.jobType = jobType;
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.deadline = deadline;
        this.status = status != null ? status : JobStatus.ACTIVE;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = JobStatus.ACTIVE;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public Double getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(Double salaryMin) {
        this.salaryMin = salaryMin;
    }

    public Double getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(Double salaryMax) {
        this.salaryMax = salaryMax;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Company company;
        private String title;
        private String description;
        private String skills;
        private String location;
        private JobType jobType;
        private Double salaryMin;
        private Double salaryMax;
        private LocalDate deadline;
        private JobStatus status = JobStatus.ACTIVE;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder company(Company company) {
            this.company = company;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder skills(String skills) {
            this.skills = skills;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder jobType(JobType jobType) {
            this.jobType = jobType;
            return this;
        }

        public Builder salaryMin(Double salaryMin) {
            this.salaryMin = salaryMin;
            return this;
        }

        public Builder salaryMax(Double salaryMax) {
            this.salaryMax = salaryMax;
            return this;
        }

        public Builder deadline(LocalDate deadline) {
            this.deadline = deadline;
            return this;
        }

        public Builder status(JobStatus status) {
            this.status = status;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Job build() {
            return new Job(id, company, title, description, skills, location, jobType, salaryMin, salaryMax, deadline, status, createdAt);
        }
    }
}
