package com.hireloop.backend.dto;

import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.enums.CompanyStatus;
import com.hireloop.backend.enums.Role;
import com.hireloop.backend.enums.UserStatus;

import java.time.LocalDateTime;

public class AdminUserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private String companyName;
    private ApprovalStatus companyApprovalStatus;
    private CompanyStatus companyStatus;

    public AdminUserResponse() {
    }

    public static AdminUserResponse fromEntity(User user, Company company) {
        AdminUserResponse resp = new AdminUserResponse();
        resp.setId(user.getId());
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setRole(user.getRole());
        resp.setStatus(user.getStatus());
        resp.setCreatedAt(user.getCreatedAt());
        if (company != null) {
            resp.setCompanyName(company.getName());
            resp.setCompanyApprovalStatus(company.getApprovalStatus());
            resp.setCompanyStatus(company.getStatus());
        }
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public ApprovalStatus getCompanyApprovalStatus() {
        return companyApprovalStatus;
    }

    public void setCompanyApprovalStatus(ApprovalStatus companyApprovalStatus) {
        this.companyApprovalStatus = companyApprovalStatus;
    }

    public CompanyStatus getCompanyStatus() {
        return companyStatus;
    }

    public void setCompanyStatus(CompanyStatus companyStatus) {
        this.companyStatus = companyStatus;
    }
}
