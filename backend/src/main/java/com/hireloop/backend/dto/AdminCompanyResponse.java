package com.hireloop.backend.dto;

import com.hireloop.backend.entity.Company;
import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.enums.CompanyStatus;

public class AdminCompanyResponse {
    private Long id;
    private String name;
    private String logoPath;
    private String website;
    private String location;
    private String description;
    private ApprovalStatus approvalStatus;
    private CompanyStatus status;
    private Long employerId;
    private String employerName;
    private String employerEmail;
    private long totalJobs;

    public AdminCompanyResponse() {
    }

    public static AdminCompanyResponse fromEntity(Company company, long totalJobs) {
        AdminCompanyResponse resp = new AdminCompanyResponse();
        resp.setId(company.getId());
        resp.setName(company.getName());
        resp.setLogoPath(company.getLogoPath());
        resp.setWebsite(company.getWebsite());
        resp.setLocation(company.getLocation());
        resp.setDescription(company.getDescription());
        resp.setApprovalStatus(company.getApprovalStatus());
        resp.setStatus(company.getStatus());
        if (company.getUser() != null) {
            resp.setEmployerId(company.getUser().getId());
            resp.setEmployerName(company.getUser().getName());
            resp.setEmployerEmail(company.getUser().getEmail());
        }
        resp.setTotalJobs(totalJobs);
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoPath() {
        return logoPath;
    }

    public void setLogoPath(String logoPath) {
        this.logoPath = logoPath;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public CompanyStatus getStatus() {
        return status;
    }

    public void setStatus(CompanyStatus status) {
        this.status = status;
    }

    public Long getEmployerId() {
        return employerId;
    }

    public void setEmployerId(Long employerId) {
        this.employerId = employerId;
    }

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    public String getEmployerEmail() {
        return employerEmail;
    }

    public void setEmployerEmail(String employerEmail) {
        this.employerEmail = employerEmail;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }
}
