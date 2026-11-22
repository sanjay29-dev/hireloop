package com.hireloop.backend.entity;

import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.enums.CompanyStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "logo_path", length = 255)
    private String logoPath;

    @Column(length = 255)
    private String website;

    @Column(length = 150)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 30)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CompanyStatus status = CompanyStatus.ACTIVE;

    public Company() {
    }

    public Company(Long id, User user, String name, String logoPath, String website, String location, String description, ApprovalStatus approvalStatus, CompanyStatus status) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.logoPath = logoPath;
        this.website = website;
        this.location = location;
        this.description = description;
        this.approvalStatus = approvalStatus != null ? approvalStatus : ApprovalStatus.PENDING;
        this.status = status != null ? status : CompanyStatus.ACTIVE;
    }

    @PrePersist
    protected void onCreate() {
        if (this.approvalStatus == null) {
            this.approvalStatus = ApprovalStatus.PENDING;
        }
        if (this.status == null) {
            this.status = CompanyStatus.ACTIVE;
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

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private String name;
        private String logoPath;
        private String website;
        private String location;
        private String description;
        private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;
        private CompanyStatus status = CompanyStatus.ACTIVE;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder logoPath(String logoPath) {
            this.logoPath = logoPath;
            return this;
        }

        public Builder website(String website) {
            this.website = website;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder approvalStatus(ApprovalStatus approvalStatus) {
            this.approvalStatus = approvalStatus;
            return this;
        }

        public Builder status(CompanyStatus status) {
            this.status = status;
            return this;
        }

        public Company build() {
            return new Company(id, user, name, logoPath, website, location, description, approvalStatus, status);
        }
    }
}
