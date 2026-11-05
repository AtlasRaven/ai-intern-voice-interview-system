package com.intern.interview.controller;

import com.intern.interview.dto.ApiResponse;
import com.intern.interview.dto.CreatePositionRequest;
import com.intern.interview.dto.PositionDto;
import com.intern.interview.service.PositionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/positions")
@Tag(name = "Positions", description = "Quản lý các vị trí thực tập sinh")
public class PositionController {

    private final PositionService positionService;

    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách các vị trí đang mở tuyển")
    public ResponseEntity<ApiResponse<List<PositionDto>>> getAllOpenPositions() {
        List<PositionDto> positions = positionService.getAllOpenPositions();
        return ResponseEntity.ok(ApiResponse.ok(positions));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<PositionDto>> getPositionById(@PathVariable Integer id) {
        PositionDto position = positionService.getPositionById(id);
        return ResponseEntity.ok(ApiResponse.ok(position));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    @Operation(summary = "Tạo mới vị trí tuyển dụng (HR/Admin)")
    public ResponseEntity<ApiResponse<PositionDto>> createPosition(@Valid @RequestBody CreatePositionRequest request) {
        PositionDto position = positionService.createPosition(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(position, "Tạo vị trí tuyển dụng thành công."));
    }
}
