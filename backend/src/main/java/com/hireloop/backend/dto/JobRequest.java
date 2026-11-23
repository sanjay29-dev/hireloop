package com.hireloop.backend.dto;

import com.hireloop.backend.enums.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String skills;
    private String location;

    @NotNull(message = "Job type is required (e.g. FULL_TIME, PART_TIME, CONTRACT, REMOTE, INTERNSHIP)")
    private JobType jobType;

    private Double salaryMin;
    private Double salaryMax;
    private String currency = "INR";
    private LocalDate deadline;

    public JobRequest() {
    }

    public JobRequest(String title, String description, String skills, String location, JobType jobType, Double salaryMin, Double salaryMax, String currency, LocalDate deadline) {
        this.title = title;
        this.description = description;
        this.skills = skills;
        this.location = location;
        this.jobType = jobType;
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.currency = currency != null ? currency : "INR";
        this.deadline = deadline;
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

    public String getCurrency() {
        return currency != null ? currency : "INR";
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
}
