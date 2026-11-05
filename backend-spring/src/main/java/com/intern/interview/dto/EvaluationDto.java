package com.intern.interview.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class EvaluationDto {
    private Long id;
    private Long sessionId;
    private String candidateName;
    private String positionTitle;
    private BigDecimal technicalScore;
    private BigDecimal problemSolvingScore;
    private BigDecimal communicationScore;
    private BigDecimal overallScore;
    private String aiFeedback;
    private BigDecimal hrScoreOverride;
    private String hrNotes;
    private String finalStatus;
    private OffsetDateTime evaluatedAt;

    public EvaluationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getPositionTitle() { return positionTitle; }
    public void setPositionTitle(String positionTitle) { this.positionTitle = positionTitle; }

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

    public BigDecimal getHrScoreOverride() { return hrScoreOverride; }
    public void setHrScoreOverride(BigDecimal hrScoreOverride) { this.hrScoreOverride = hrScoreOverride; }

    public String getHrNotes() { return hrNotes; }
    public void setHrNotes(String hrNotes) { this.hrNotes = hrNotes; }

    public String getFinalStatus() { return finalStatus; }
    public void setFinalStatus(String finalStatus) { this.finalStatus = finalStatus; }

    public OffsetDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(OffsetDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
