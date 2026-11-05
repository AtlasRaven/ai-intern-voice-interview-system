package com.intern.interview.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.OffsetDateTime;

public class CreateConsentRequest {

    @NotBlank(message = "Loại đồng thuận không được để trống")
    private String consentType = "AUDIO_RECORDING";

    private boolean agreed = true;

    private String policyVersion = "v1.0";

    public CreateConsentRequest() {}

    public String getConsentType() { return consentType; }
    public void setConsentType(String consentType) { this.consentType = consentType; }

    public boolean isAgreed() { return agreed; }
    public void setAgreed(boolean agreed) { this.agreed = agreed; }

    public String getPolicyVersion() { return policyVersion; }
    public void setPolicyVersion(String policyVersion) { this.policyVersion = policyVersion; }
}
