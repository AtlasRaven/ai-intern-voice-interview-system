package com.intern.interview.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class SubmitAIEvaluationRequest {

    @NotNull(message = "Điểm kỹ thuật không được để trống")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    private BigDecimal technicalScore;

    @NotNull(message = "Điểm giải quyết vấn đề không được để trống")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    private BigDecimal problemSolvingScore;

    @NotNull(message = "Điểm giao tiếp không được để trống")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    private BigDecimal communicationScore;

    @NotNull(message = "Điểm tổng kết không được để trống")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    private BigDecimal overallScore;

    @NotBlank(message = "Nhận xét AI không được để trống")
    private String aiFeedback;

    public SubmitAIEvaluationRequest() {}

    public BigDecimal getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(BigDecimal technicalScore) { this.technicalScore = technicalScore; }

    public BigDecimal getProblemSolvingScore() { return problemSolvingScore; }
    public void setProblemSolvingScore(BigDecimal problemSolvingScore) { this.problemSolvingScore = problemSolvingScore; }

    public BigDecimal getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(BigDecimal communicationScore) { this.communicationScore = communicationScore; }

    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }

    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }
}
