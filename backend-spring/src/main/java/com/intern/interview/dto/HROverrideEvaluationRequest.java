package com.intern.interview.dto;

import java.math.BigDecimal;

public class HROverrideEvaluationRequest {
    private BigDecimal hrScoreOverride;
    private String hrNotes;
    private String finalStatus; // PASSED, FAILED, UNDER_REVIEW

    public HROverrideEvaluationRequest() {}

    public BigDecimal getHrScoreOverride() { return hrScoreOverride; }
    public void setHrScoreOverride(BigDecimal hrScoreOverride) { this.hrScoreOverride = hrScoreOverride; }

    public String getHrNotes() { return hrNotes; }
    public void setHrNotes(String hrNotes) { this.hrNotes = hrNotes; }

    public String getFinalStatus() { return finalStatus; }
    public void setFinalStatus(String finalStatus) { this.finalStatus = finalStatus; }
}
