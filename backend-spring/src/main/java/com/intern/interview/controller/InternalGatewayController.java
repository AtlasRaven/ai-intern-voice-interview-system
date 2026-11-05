package com.intern.interview.controller;

import com.intern.interview.dto.*;
import com.intern.interview.service.InternalGatewayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/internal")
@Tag(name = "Internal Gateway Integration", description = "Endpoints nội bộ dành riêng cho Voice/AI Gateway (yêu cầu X-Internal-Service-Key)")
@SecurityRequirement(name = "InternalServiceKey")
public class InternalGatewayController {

    private final InternalGatewayService internalService;

    public InternalGatewayController(InternalGatewayService internalService) {
        this.internalService = internalService;
    }

    @GetMapping("/sessions/{id}/context")
    @Operation(summary = "Lấy ngữ cảnh phiên phỏng vấn và bộ câu hỏi cho AI Interviewer")
    public ResponseEntity<ApiResponse<InternalSessionContextResponse>> getSessionContext(@PathVariable Long id) {
        InternalSessionContextResponse context = internalService.getSessionContext(id);
        return ResponseEntity.ok(ApiResponse.ok(context));
    }

    @PostMapping("/sessions/{id}/transcripts")
    @Operation(summary = "Lưu phân đoạn câu hỏi - câu trả lời vừa hoàn thành")
    public ResponseEntity<ApiResponse<TranscriptSegmentDto>> saveTranscriptSegment(
            @PathVariable Long id,
            @Valid @RequestBody SaveTranscriptSegmentRequest request) {
        TranscriptSegmentDto segment = internalService.saveTranscriptSegment(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(segment, "Lưu phân đoạn transcript thành công."));
    }

    @PostMapping("/sessions/{id}/evaluations")
    @Operation(summary = "Lưu kết quả chấm điểm Rubric cuối cùng của AI")
    public ResponseEntity<ApiResponse<EvaluationDto>> submitAIEvaluation(
            @PathVariable Long id,
            @Valid @RequestBody SubmitAIEvaluationRequest request) {
        EvaluationDto eval = internalService.submitAIEvaluation(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(eval, "Lưu kết quả đánh giá thành công."));
    }

    @PostMapping("/sessions/{id}/terminate")
    @Operation(summary = "Báo kết thúc phiên phỏng vấn bất thường (timeout hoặc ngắt kết nối)")
    public ResponseEntity<ApiResponse<Void>> terminateSession(
            @PathVariable Long id,
            @RequestParam(defaultValue = "TIMEOUT") String reason) {
        internalService.terminateSession(id, reason);
        return ResponseEntity.ok(ApiResponse.ok(null, "Kết thúc phiên thành công."));
    }
}
