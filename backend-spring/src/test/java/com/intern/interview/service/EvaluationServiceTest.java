package com.intern.interview.service;

import com.intern.interview.dto.EvaluationDto;
import com.intern.interview.dto.HROverrideEvaluationRequest;
import com.intern.interview.entity.*;
import com.intern.interview.exception.ResourceNotFoundException;
import com.intern.interview.repository.AuditLogRepository;
import com.intern.interview.repository.EvaluationRepository;
import com.intern.interview.repository.UserRepository;
import com.intern.interview.service.impl.EvaluationServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EvaluationServiceTest {

    @Mock
    private EvaluationRepository evaluationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private EvaluationServiceImpl evaluationService;

    @Test
    @DisplayName("US-08: HR hiệu chỉnh điểm và nhận xét thành công có ghi Audit Log (Happy Path)")
    void hrOverrideEvaluation_Success() {
        // Arrange
        User candidateUser = new User();
        candidateUser.setFullName("Trần Sinh Viên");

        Candidate candidate = new Candidate();
        candidate.setUser(candidateUser);

        Position position = new Position();
        position.setTitle("Java Backend Intern");

        InterviewSession session = new InterviewSession();
        session.setId(42L);
        session.setCandidate(candidate);
        session.setPosition(position);

        Evaluation eval = new Evaluation();
        eval.setId(1L);
        eval.setSession(session);
        eval.setTechnicalScore(new BigDecimal("7.0"));
        eval.setProblemSolvingScore(new BigDecimal("7.0"));
        eval.setCommunicationScore(new BigDecimal("7.0"));
        eval.setOverallScore(new BigDecimal("7.0"));
        eval.setFinalStatus("UNDER_REVIEW");

        User hrUser = new User();
        hrUser.setId(2L);
        hrUser.setEmail("hr@intern.vn");

        HROverrideEvaluationRequest req = new HROverrideEvaluationRequest();
        req.setHrScoreOverride(new BigDecimal("8.5"));
        req.setFinalStatus("PASSED");
        req.setHrNotes("Ứng viên xuất sắc");

        when(evaluationRepository.findById(1L)).thenReturn(Optional.of(eval));
        when(userRepository.findByEmail("hr@intern.vn")).thenReturn(Optional.of(hrUser));
        when(evaluationRepository.save(any(Evaluation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        EvaluationDto dto = evaluationService.hrOverrideEvaluation(1L, req, "hr@intern.vn");

        // Assert
        assertNotNull(dto);
        assertEquals(new BigDecimal("8.5"), dto.getHrScoreOverride());
        assertEquals("PASSED", dto.getFinalStatus());
        assertEquals("Ứng viên xuất sắc", dto.getHrNotes());
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    @DisplayName("US-08: Hiệu chỉnh điểm trên evaluation không tồn tại ném ResourceNotFoundException (Failure)")
    void hrOverrideEvaluation_NotFound_ThrowsException() {
        when(evaluationRepository.findById(999L)).thenReturn(Optional.empty());

        HROverrideEvaluationRequest req = new HROverrideEvaluationRequest();
        assertThrows(ResourceNotFoundException.class, () -> evaluationService.hrOverrideEvaluation(999L, req, "hr@intern.vn"));
    }
}
