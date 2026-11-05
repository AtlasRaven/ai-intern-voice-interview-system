package com.intern.interview.controller;

import com.intern.interview.dto.ApiResponse;
import com.intern.interview.dto.ConsentDto;
import com.intern.interview.dto.CreateConsentRequest;
import com.intern.interview.service.ConsentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/consents")
@Tag(name = "Consents", description = "Quản lý thỏa thuận ghi âm và bảo mật dữ liệu")
public class ConsentController {

    private final ConsentService consentService;

    public ConsentController(ConsentService consentService) {
        this.consentService = consentService;
    }

    @PostMapping
    @Operation(summary = "Ký thỏa thuận đồng thuận ghi âm giọng nói")
    public ResponseEntity<ApiResponse<ConsentDto>> recordConsent(
            @Valid @RequestBody CreateConsentRequest request,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        String userAgent = servletRequest.getHeader("User-Agent");
        ConsentDto dto = consentService.recordConsent(request, authentication.getName(), ip, userAgent);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(dto, "Ghi nhận đồng thuận thành công."));
    }

    @GetMapping("/latest")
    @Operation(summary = "Lấy trạng thái đồng thuận mới nhất của người dùng")
    public ResponseEntity<ApiResponse<ConsentDto>> getLatestConsent(
            @RequestParam(defaultValue = "AUDIO_RECORDING") String consentType,
            Authentication authentication) {
        ConsentDto dto = consentService.getLatestConsent(authentication.getName(), consentType);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
}
