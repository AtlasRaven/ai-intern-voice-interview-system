package com.intern.interview.dto;

import java.time.OffsetDateTime;

public class ConsentDto {
    private Long id;
    private Long userId;
    private String consentType;
    private boolean agreed;
    private String policyVersion;
    private OffsetDateTime agreedAt;

    public ConsentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getConsentType() { return consentType; }
    public void setConsentType(String consentType) { this.consentType = consentType; }

    public boolean isAgreed() { return agreed; }
    public void setAgreed(boolean agreed) { this.agreed = agreed; }

    public String getPolicyVersion() { return policyVersion; }
    public void setPolicyVersion(String policyVersion) { this.policyVersion = policyVersion; }

    public OffsetDateTime getAgreedAt() { return agreedAt; }
    public void setAgreedAt(OffsetDateTime agreedAt) { this.agreedAt = agreedAt; }
}
