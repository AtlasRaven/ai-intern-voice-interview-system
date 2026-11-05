package com.intern.interview.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreatePositionRequest {

    @NotBlank(message = "Mã vị trí không được để trống")
    private String code;

    @NotBlank(message = "Tiêu đề vị trí không được để trống")
    private String title;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotBlank(message = "Yêu cầu không được để trống")
    private String requirements;

    private List<Integer> skillIds;

    public CreatePositionRequest() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public List<Integer> getSkillIds() { return skillIds; }
    public void setSkillIds(List<Integer> skillIds) { this.skillIds = skillIds; }
}
