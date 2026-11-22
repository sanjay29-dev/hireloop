package com.hireloop.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String location;

    @Column(length = 200)
    private String headline;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(name = "default_resume_path", length = 255)
    private String defaultResumePath;

    public CandidateProfile() {
    }

    public CandidateProfile(Long id, User user, String phone, String location, String headline, String skills, String education, String experience, String defaultResumePath) {
        this.id = id;
        this.user = user;
        this.phone = phone;
        this.location = location;
        this.headline = headline;
        this.skills = skills;
        this.education = education;
        this.experience = experience;
        this.defaultResumePath = defaultResumePath;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getDefaultResumePath() {
        return defaultResumePath;
    }

    public void setDefaultResumePath(String defaultResumePath) {
        this.defaultResumePath = defaultResumePath;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private String phone;
        private String location;
        private String headline;
        private String skills;
        private String education;
        private String experience;
        private String defaultResumePath;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder headline(String headline) {
            this.headline = headline;
            return this;
        }

        public Builder skills(String skills) {
            this.skills = skills;
            return this;
        }

        public Builder education(String education) {
            this.education = education;
            return this;
        }

        public Builder experience(String experience) {
            this.experience = experience;
            return this;
        }

        public Builder defaultResumePath(String defaultResumePath) {
            this.defaultResumePath = defaultResumePath;
            return this;
        }

        public CandidateProfile build() {
            return new CandidateProfile(id, user, phone, location, headline, skills, education, experience, defaultResumePath);
        }
    }
}
