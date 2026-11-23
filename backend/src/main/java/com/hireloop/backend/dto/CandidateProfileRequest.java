package com.hireloop.backend.dto;

public class CandidateProfileRequest {

    private String phone;
    private String location;
    private String headline;
    private String skills;
    private String education;
    private String experience;

    public CandidateProfileRequest() {
    }

    public CandidateProfileRequest(String phone, String location, String headline, String skills, String education, String experience) {
        this.phone = phone;
        this.location = location;
        this.headline = headline;
        this.skills = skills;
        this.education = education;
        this.experience = experience;
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
}
