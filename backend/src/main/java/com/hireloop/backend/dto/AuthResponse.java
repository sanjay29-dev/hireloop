package com.hireloop.backend.dto;

import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.enums.Role;
import com.hireloop.backend.enums.UserStatus;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String name;
    private String email;
    private Role role;
    private UserStatus status;
    private Long companyId;
    private String companyName;
    private ApprovalStatus companyApprovalStatus;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String name, String email, Role role, UserStatus status) {
        this.token = token;
        this.tokenType = "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
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

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
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
}
