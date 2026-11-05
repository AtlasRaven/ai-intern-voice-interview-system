package com.intern.interview.service;

import com.intern.interview.dto.*;
import com.intern.interview.entity.*;
import com.intern.interview.repository.EvaluationRepository;
import com.intern.interview.repository.InterviewSessionRepository;
import com.intern.interview.repository.SessionQuestionRepository;
import com.intern.interview.repository.TranscriptSegmentRepository;
import com.intern.interview.service.impl.InternalGatewayServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InternalGatewayServiceTest {

    @Mock
    private InterviewSessionRepository sessionRepository;

    @Mock
    private SessionQuestionRepository sessionQuestionRepository;

    @Mock
    private TranscriptSegmentRepository transcriptRepository;

    @Mock
    private EvaluationRepository evaluationRepository;

    @InjectMocks
    private InternalGatewayServiceImpl internalGatewayService;

    @Test
    @DisplayName("US-03: Lấy ngữ cảnh session cho AI Interviewer (Happy Path)")
    void getSessionContext_Success() {
        User user = new User();
        user.setFullName("Lê Thị Ứng Viên");

        Candidate candidate = new Candidate();
        candidate.setId(3L);
        candidate.setUser(user);

        Position position = new Position();
        position.setId(1);
        position.setTitle("Java Backend Intern");

        InterviewSession session = new InterviewSession();
        session.setId(42L);
        session.setCandidate(candidate);
        session.setPosition(position);
        session.setStatus("SCHEDULED");

        when(sessionRepository.findById(42L)).thenReturn(Optional.of(session));
        when(sessionQuestionRepository.findBySessionIdOrderBySequenceOrderAsc(42L)).thenReturn(Collections.emptyList());

        InternalSessionContextResponse res = internalGatewayService.getSessionContext(42L);

        assertNotNull(res);
        assertEquals(42L, res.getSessionId());
        assertEquals("Lê Thị Ứng Viên", res.getCandidateName());
        assertEquals("IN_PROGRESS", session.getStatus());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    @DisplayName("US-03: Lưu phân đoạn câu hỏi - trả lời thành công (Happy Path)")
    void saveTranscriptSegment_Success() {
        InterviewSession session = new InterviewSession();
        session.setId(42L);

        SaveTranscriptSegmentRequest req = new SaveTranscriptSegmentRequest();
        req.setQuestionText("OOP là gì?");
        req.setAnswerText("Là lập trình hướng đối tượng");
        req.setDurationSeconds(25);

        when(sessionRepository.findById(42L)).thenReturn(Optional.of(session));
        when(transcriptRepository.save(any(TranscriptSegment.class))).thenAnswer(invocation -> {
            TranscriptSegment ts = invocation.getArgument(0);
            ts.setId(101L);
            return ts;
        });

        TranscriptSegmentDto dto = internalGatewayService.saveTranscriptSegment(42L, req);

        assertNotNull(dto);
        assertEquals(101L, dto.getId());
        assertEquals("OOP là gì?", dto.getQuestionText());
        assertEquals("Là lập trình hướng đối tượng", dto.getAnswerText());
    }

    @Test
    @DisplayName("US-07: Lưu kết quả đánh giá rubric AI và hoàn thành phiên (Happy Path)")
    void submitAIEvaluation_Success() {
        User user = new User();
        user.setFullName("Trần Văn Sinh Viên");

        Candidate candidate = new Candidate();
        candidate.setUser(user);

        Position position = new Position();
        position.setTitle("Java Backend");

        InterviewSession session = new InterviewSession();
        session.setId(42L);
        session.setCandidate(candidate);
        session.setPosition(position);
        session.setStatus("IN_PROGRESS");

        SubmitAIEvaluationRequest req = new SubmitAIEvaluationRequest();
        req.setTechnicalScore(new BigDecimal("8.5"));
        req.setProblemSolvingScore(new BigDecimal("8.0"));
        req.setCommunicationScore(new BigDecimal("8.0"));
        req.setOverallScore(new BigDecimal("8.2"));
        req.setAiFeedback("Tư duy tốt");

        when(sessionRepository.findById(42L)).thenReturn(Optional.of(session));
        when(evaluationRepository.findBySessionId(42L)).thenReturn(Optional.empty());
        when(evaluationRepository.save(any(Evaluation.class))).thenAnswer(invocation -> {
            Evaluation e = invocation.getArgument(0);
            e.setId(88L);
            return e;
        });

        EvaluationDto dto = internalGatewayService.submitAIEvaluation(42L, req);

        assertNotNull(dto);
        assertEquals("COMPLETED", session.getStatus());
        assertEquals("PASSED", dto.getFinalStatus());
        verify(sessionRepository, times(1)).save(session);
        verify(evaluationRepository, times(1)).save(any(Evaluation.class));
    }
}
