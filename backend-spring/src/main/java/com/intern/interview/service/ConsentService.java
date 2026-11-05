package com.intern.interview.service;

import com.intern.interview.dto.ConsentDto;
import com.intern.interview.dto.CreateConsentRequest;

public interface ConsentService {
    ConsentDto recordConsent(CreateConsentRequest request, String userEmail, String ipAddress, String userAgent);
    ConsentDto getLatestConsent(String userEmail, String consentType);
}
