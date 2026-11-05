package com.intern.interview.controller;

import com.intern.interview.dto.ApiResponse;
import com.intern.interview.dto.CreateQuestionRequest;
import com.intern.interview.dto.QuestionDto;
import com.intern.interview.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@Tag(name = "Questions", description = "Quản lý ngân hàng câu hỏi phỏng vấn")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    @Operation(summary = "Truy vấn ngân hàng câu hỏi theo vị trí và độ khó")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> getQuestions(
            @RequestParam(required = false) Integer positionId,
            @RequestParam(required = false) String difficulty) {
        List<QuestionDto> questions = questionService.getQuestions(positionId, difficulty);
        return ResponseEntity.ok(ApiResponse.ok(questions));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết câu hỏi")
    public ResponseEntity<ApiResponse<QuestionDto>> getQuestionById(@PathVariable Long id) {
        QuestionDto question = questionService.getQuestionById(id);
        return ResponseEntity.ok(ApiResponse.ok(question));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    @Operation(summary = "Thêm câu hỏi mới vào ngân hàng (HR/Admin)")
    public ResponseEntity<ApiResponse<QuestionDto>> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        QuestionDto question = questionService.createQuestion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(question, "Tạo câu hỏi mới thành công."));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    @Operation(summary = "Ẩn/Xóa câu hỏi (HR/Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa câu hỏi thành công."));
    }
}
