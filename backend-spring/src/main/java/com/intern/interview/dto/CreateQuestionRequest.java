package com.intern.interview.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateQuestionRequest {

    @NotNull(message = "Vị trí không được để trống")
    private Integer positionId;

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String content;

    @NotBlank(message = "Độ khó không được để trống")
    private String difficulty; // EASY, MEDIUM, HARD

    @NotBlank(message = "Câu trả lời mẫu không được để trống")
    private String sampleAnswer;

    @NotBlank(message = "Tiêu chí chấm điểm không được để trống")
    private String evaluationRubric;

    private List<Integer> skillIds;

    public CreateQuestionRequest() {}

    public Integer getPositionId() { return positionId; }
    public void setPositionId(Integer positionId) { this.positionId = positionId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getSampleAnswer() { return sampleAnswer; }
    public void setSampleAnswer(String sampleAnswer) { this.sampleAnswer = sampleAnswer; }

    public String getEvaluationRubric() { return evaluationRubric; }
    public void setEvaluationRubric(String evaluationRubric) { this.evaluationRubric = evaluationRubric; }

    public List<Integer> getSkillIds() { return skillIds; }
    public void setSkillIds(List<Integer> skillIds) { this.skillIds = skillIds; }
}
