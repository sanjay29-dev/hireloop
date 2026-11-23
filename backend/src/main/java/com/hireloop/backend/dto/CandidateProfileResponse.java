package com.hireloop.backend.dto;

import com.hireloop.backend.entity.CandidateProfile;

public class CandidateProfileResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String location;
    private String headline;
    private String skills;
    private String education;
    private String experience;
    private String defaultResumePath;
    private boolean hasResume;

    public CandidateProfileResponse() {
    }

    public static CandidateProfileResponse fromEntity(CandidateProfile profile) {
        CandidateProfileResponse res = new CandidateProfileResponse();
        res.setId(profile.getId());
        if (profile.getUser() != null) {
            res.setUserId(profile.getUser().getId());
            res.setName(profile.getUser().getName());
            res.setEmail(profile.getUser().getEmail());
        }
        res.setPhone(profile.getPhone());
        res.setLocation(profile.getLocation());
        res.setHeadline(profile.getHeadline());
        res.setSkills(profile.getSkills());
        res.setEducation(profile.getEducation());
        res.setExperience(profile.getExperience());
        res.setDefaultResumePath(profile.getDefaultResumePath());
        res.setHasResume(profile.getDefaultResumePath() != null && !profile.getDefaultResumePath().trim().isEmpty());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public boolean isHasResume() {
        return hasResume;
    }

    public void setHasResume(boolean hasResume) {
        this.hasResume = hasResume;
    }
}
