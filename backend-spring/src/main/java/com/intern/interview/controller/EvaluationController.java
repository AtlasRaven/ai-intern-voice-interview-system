package com.intern.interview.controller;

import com.intern.interview.dto.ApiResponse;
import com.intern.interview.dto.EvaluationDto;
import com.intern.interview.dto.HROverrideEvaluationRequest;
import com.intern.interview.service.EvaluationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/evaluations")
@Tag(name = "Evaluations", description = "Quản lý kết quả đánh giá và rubric scoring")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    @Operation(summary = "Lấy danh sách kết quả đánh giá (HR/Admin)")
    public ResponseEntity<ApiResponse<List<EvaluationDto>>> getEvaluations(
            @RequestParam(required = false) Integer positionId,
            @RequestParam(required = false) BigDecimal minScore) {
        List<EvaluationDto> evaluations = evaluationService.getEvaluations(positionId, minScore);
        return ResponseEntity.ok(ApiResponse.ok(evaluations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đánh giá theo ID")
    public ResponseEntity<ApiResponse<EvaluationDto>> getEvaluationById(@PathVariable Long id) {
        EvaluationDto evaluation = evaluationService.getEvaluationById(id);
        return ResponseEntity.ok(ApiResponse.ok(evaluation));
    }

    @GetMapping("/session/{sessionId}")
    @Operation(summary = "Xem chi tiết đánh giá theo phiên phỏng vấn")
    public ResponseEntity<ApiResponse<EvaluationDto>> getEvaluationBySessionId(@PathVariable Long sessionId) {
        EvaluationDto evaluation = evaluationService.getEvaluationBySessionId(sessionId);
        return ResponseEntity.ok(ApiResponse.ok(evaluation));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    @Operation(summary = "HR hiệu chỉnh điểm số và ghi nhận xét thủ công")
    public ResponseEntity<ApiResponse<EvaluationDto>> hrOverrideEvaluation(
            @PathVariable Long id,
            @RequestBody HROverrideEvaluationRequest request,
            Authentication authentication) {
        EvaluationDto updated = evaluationService.hrOverrideEvaluation(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(updated, "Cập nhật đánh giá thành công."));
    }
}
