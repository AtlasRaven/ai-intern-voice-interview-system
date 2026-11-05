package com.intern.interview.controller;

import com.intern.interview.dto.*;
import com.intern.interview.service.InterviewSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sessions")
@Tag(name = "Interview Sessions", description = "Quản lý phiên phỏng vấn và transcript")
public class InterviewSessionController {

    private final InterviewSessionService sessionService;

    public InterviewSessionController(InterviewSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    @Operation(summary = "Tạo mới hoặc đặt lịch phiên phỏng vấn")
    public ResponseEntity<ApiResponse<CreateSessionResponse>> createSession(
            @Valid @RequestBody CreateSessionRequest request,
            Authentication authentication) {
        CreateSessionResponse response = sessionService.createSession(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response, "Khởi tạo phiên phỏng vấn thành công."));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách các phiên phỏng vấn của người dùng")
    public ResponseEntity<ApiResponse<List<InterviewSessionDto>>> getSessions(Authentication authentication) {
        List<InterviewSessionDto> sessions = sessionService.getSessionsForUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(sessions));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một phiên phỏng vấn")
    public ResponseEntity<ApiResponse<InterviewSessionDto>> getSessionById(@PathVariable Long id) {
        InterviewSessionDto session = sessionService.getSessionById(id);
        return ResponseEntity.ok(ApiResponse.ok(session));
    }

    @GetMapping("/{id}/transcripts")
    @Operation(summary = "Lấy toàn bộ transcript các lượt hỏi đáp của phiên")
    public ResponseEntity<ApiResponse<List<TranscriptSegmentDto>>> getSessionTranscripts(@PathVariable Long id) {
        List<TranscriptSegmentDto> transcripts = sessionService.getSessionTranscripts(id);
        return ResponseEntity.ok(ApiResponse.ok(transcripts));
    }
}
