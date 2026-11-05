package com.intern.interview.service.impl;

import com.intern.interview.dto.ConsentDto;
import com.intern.interview.dto.CreateConsentRequest;
import com.intern.interview.entity.Consent;
import com.intern.interview.entity.User;
import com.intern.interview.exception.BadRequestException;
import com.intern.interview.exception.ResourceNotFoundException;
import com.intern.interview.repository.ConsentRepository;
import com.intern.interview.repository.UserRepository;
import com.intern.interview.service.ConsentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class ConsentServiceImpl implements ConsentService {

    private final ConsentRepository consentRepository;
    private final UserRepository userRepository;

    public ConsentServiceImpl(ConsentRepository consentRepository, UserRepository userRepository) {
        this.consentRepository = consentRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ConsentDto recordConsent(CreateConsentRequest request, String userEmail, String ipAddress, String userAgent) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy người dùng."));

        Consent consent = new Consent();
        consent.setUser(user);
        consent.setConsentType(request.getConsentType());
        consent.setAgreed(request.isAgreed());
        consent.setPolicyVersion(request.getPolicyVersion());
        consent.setIpAddress(ipAddress);
        consent.setUserAgent(userAgent);
        consent.setAgreedAt(OffsetDateTime.now());

        Consent saved = consentRepository.save(consent);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ConsentDto getLatestConsent(String userEmail, String consentType) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy người dùng."));

        Consent consent = consentRepository.findFirstByUserIdAndConsentTypeOrderByAgreedAtDesc(user.getId(), consentType)
                .orElseThrow(() -> new ResourceNotFoundException("Chưa có bản ghi đồng thuận cho người dùng này."));

        return toDto(consent);
    }

    private ConsentDto toDto(Consent c) {
        ConsentDto dto = new ConsentDto();
        dto.setId(c.getId());
        dto.setUserId(c.getUser().getId());
        dto.setConsentType(c.getConsentType());
        dto.setAgreed(c.isAgreed());
        dto.setPolicyVersion(c.getPolicyVersion());
        dto.setAgreedAt(c.getAgreedAt());
        return dto;
    }
}
