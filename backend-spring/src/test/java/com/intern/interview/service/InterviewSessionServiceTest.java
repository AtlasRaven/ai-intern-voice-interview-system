package com.intern.interview.service;

import com.intern.interview.dto.CreateSessionRequest;
import com.intern.interview.dto.CreateSessionResponse;
import com.intern.interview.dto.InterviewSessionDto;
import com.intern.interview.entity.*;
import com.intern.interview.exception.BadRequestException;
import com.intern.interview.repository.*;
import com.intern.interview.service.impl.InterviewSessionServiceImpl;
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
class InterviewSessionServiceTest {

    @Mock
    private InterviewSessionRepository sessionRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private PositionRepository positionRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private SessionQuestionRepository sessionQuestionRepository;

    @Mock
    private TranscriptSegmentRepository transcriptRepository;

    @Mock
    private ConsentRepository consentRepository;

    @InjectMocks
    private InterviewSessionServiceImpl sessionService;

    @Test
    @DisplayName("US-02: Tạo phiên phỏng vấn khi đã có Consent ghi âm (Happy Path)")
    void createSession_WithConsent_Success() {
        // Arrange
        String email = "candidate@intern.vn";
        User user = new User();
        user.setId(10L);
        user.setEmail(email);
        user.setFullName("Nguyễn Văn An");

        Candidate candidate = new Candidate();
        candidate.setId(5L);
        candidate.setUser(user);

        Consent consent = new Consent();
        consent.setUser(user);
        consent.setAgreed(true);

        Position position = new Position();
        position.setId(1);
        position.setTitle("Java Backend");

        CreateSessionRequest req = new CreateSessionRequest();
        req.setPositionId(1);

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(consentRepository.findFirstByUserIdAndConsentTypeOrderByAgreedAtDesc(10L, "AUDIO_RECORDING"))
                .thenReturn(Optional.of(consent));
        when(positionRepository.findById(1)).thenReturn(Optional.of(position));
        when(sessionRepository.save(any(InterviewSession.class))).thenAnswer(invocation -> {
            InterviewSession s = invocation.getArgument(0);
            s.setId(42L);
            return s;
        });
        when(questionRepository.findByPositionIdAndDifficultyAndActiveTrue(any(), any())).thenReturn(Collections.emptyList());

        // Act
        CreateSessionResponse res = sessionService.createSession(req, email);

        // Assert
        assertNotNull(res);
        assertEquals(42L, res.getSessionId());
        assertTrue(res.getSessionToken().startsWith("sess_"));
        verify(sessionRepository, times(1)).save(any(InterviewSession.class));
    }

    @Test
    @DisplayName("US-02: Từ chối tạo phiên khi ứng viên chưa ký Consent ghi âm (Failure)")
    void createSession_WithoutConsent_ThrowsBadRequest() {
        String email = "candidate@intern.vn";
        User user = new User();
        user.setId(10L);

        Candidate candidate = new Candidate();
        candidate.setUser(user);

        CreateSessionRequest req = new CreateSessionRequest();
        req.setPositionId(1);

        when(candidateRepository.findByUserEmail(email)).thenReturn(Optional.of(candidate));
        when(consentRepository.findFirstByUserIdAndConsentTypeOrderByAgreedAtDesc(10L, "AUDIO_RECORDING"))
                .thenReturn(Optional.empty());

        BadRequestException ex = assertThrows(BadRequestException.class, () -> sessionService.createSession(req, email));
        assertTrue(ex.getMessage().contains("xác nhận đồng thuận"));
    }
}
