package com.intern.interview.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private InterviewSession session;

    @Column(name = "technical_score", nullable = false, precision = 4, scale = 2)
    private BigDecimal technicalScore;

    @Column(name = "problem_solving_score", nullable = false, precision = 4, scale = 2)
    private BigDecimal problemSolvingScore;

    @Column(name = "communication_score", nullable = false, precision = 4, scale = 2)
    private BigDecimal communicationScore;

    @Column(name = "overall_score", nullable = false, precision = 4, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "ai_feedback", nullable = false, columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(name = "hr_score_override", precision = 4, scale = 2)
    private BigDecimal hrScoreOverride;

    @Column(name = "hr_notes", columnDefinition = "TEXT")
    private String hrNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hr_evaluator_id")
    private User hrEvaluator;

    @Column(name = "final_status", nullable = false, length = 30)
    private String finalStatus = "UNDER_REVIEW"; // PASSED, FAILED, UNDER_REVIEW

    @Column(name = "evaluated_at", nullable = false)
    private OffsetDateTime evaluatedAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public Evaluation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }

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

    public User getHrEvaluator() { return hrEvaluator; }
    public void setHrEvaluator(User hrEvaluator) { this.hrEvaluator = hrEvaluator; }

    public String getFinalStatus() { return finalStatus; }
    public void setFinalStatus(String finalStatus) { this.finalStatus = finalStatus; }

    public OffsetDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(OffsetDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
