package com.intern.interview.service;

import com.intern.interview.dto.CreatePositionRequest;
import com.intern.interview.dto.PositionDto;
import com.intern.interview.entity.Position;
import com.intern.interview.exception.BadRequestException;
import com.intern.interview.exception.ResourceNotFoundException;
import com.intern.interview.repository.PositionRepository;
import com.intern.interview.repository.SkillRepository;
import com.intern.interview.service.impl.PositionServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PositionServiceTest {

    @Mock
    private PositionRepository positionRepository;

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private PositionServiceImpl positionService;

    @Test
    @DisplayName("US-02: Lấy danh sách các vị trí đang mở (Happy Path)")
    void getAllOpenPositions_Success() {
        // Arrange
        Position p = new Position();
        p.setId(1);
        p.setCode("JAVA_BE");
        p.setTitle("Java Backend Intern");
        p.setDescription("Mô tả");
        p.setRequirements("Yêu cầu");
        p.setOpen(true);

        when(positionRepository.findByOpenTrue()).thenReturn(List.of(p));

        // Act
        List<PositionDto> list = positionService.getAllOpenPositions();

        // Assert
        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("JAVA_BE", list.get(0).getCode());
    }

    @Test
    @DisplayName("US-02: Tạo vị trí mới thành công (Happy Path)")
    void createPosition_Success() {
        // Arrange
        CreatePositionRequest req = new CreatePositionRequest();
        req.setCode("FLUTTER_INTERN");
        req.setTitle("Flutter Mobile Intern");
        req.setDescription("Mô tả");
        req.setRequirements("Yêu cầu");

        when(positionRepository.findByCode("FLUTTER_INTERN")).thenReturn(Optional.empty());
        when(positionRepository.save(any(Position.class))).thenAnswer(invocation -> {
            Position p = invocation.getArgument(0);
            p.setId(10);
            return p;
        });

        // Act
        PositionDto dto = positionService.createPosition(req);

        // Assert
        assertNotNull(dto);
        assertEquals("FLUTTER_INTERN", dto.getCode());
        assertEquals("Flutter Mobile Intern", dto.getTitle());
    }

    @Test
    @DisplayName("US-02: Báo lỗi khi tạo vị trí trùng mã (Edge Case)")
    void createPosition_DuplicateCode_ThrowsBadRequest() {
        CreatePositionRequest req = new CreatePositionRequest();
        req.setCode("JAVA_BE");
        req.setTitle("Java Backend Duplicate");

        when(positionRepository.findByCode("JAVA_BE")).thenReturn(Optional.of(new Position()));

        assertThrows(BadRequestException.class, () -> positionService.createPosition(req));
    }

    @Test
    @DisplayName("US-02: Tìm vị trí không tồn tại ném ResourceNotFoundException (Failure)")
    void getPositionById_NotFound_ThrowsException() {
        when(positionRepository.findById(999)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> positionService.getPositionById(999));
    }
}
