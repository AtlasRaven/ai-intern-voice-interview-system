package com.intern.interview.service.impl;

import com.intern.interview.dto.CreateSessionRequest;
import com.intern.interview.dto.CreateSessionResponse;
import com.intern.interview.dto.InterviewSessionDto;
import com.intern.interview.dto.TranscriptSegmentDto;
import com.intern.interview.entity.*;
import com.intern.interview.exception.BadRequestException;
import com.intern.interview.exception.ResourceNotFoundException;
import com.intern.interview.repository.*;
import com.intern.interview.service.InterviewSessionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InterviewSessionServiceImpl implements InterviewSessionService {

    private final InterviewSessionRepository sessionRepository;
    private final CandidateRepository candidateRepository;
    private final PositionRepository positionRepository;
    private final QuestionRepository questionRepository;
    private final SessionQuestionRepository sessionQuestionRepository;
    private final TranscriptSegmentRepository transcriptRepository;
    private final ConsentRepository consentRepository;

    @Value("${app.gateway.ws-url:ws://localhost:3000/ws/interview}")
    private String gatewayWsUrl;

    public InterviewSessionServiceImpl(InterviewSessionRepository sessionRepository,
                                       CandidateRepository candidateRepository,
                                       PositionRepository positionRepository,
                                       QuestionRepository questionRepository,
                                       SessionQuestionRepository sessionQuestionRepository,
                                       TranscriptSegmentRepository transcriptRepository,
                                       ConsentRepository consentRepository) {
        this.sessionRepository = sessionRepository;
        this.candidateRepository = candidateRepository;
        this.positionRepository = positionRepository;
        this.questionRepository = questionRepository;
        this.sessionQuestionRepository = sessionQuestionRepository;
        this.transcriptRepository = transcriptRepository;
        this.consentRepository = consentRepository;
    }

    @Override
    @Transactional
    public CreateSessionResponse createSession(CreateSessionRequest request, String candidateEmail) {
        Candidate candidate = candidateRepository.findByUserEmail(candidateEmail)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy hồ sơ ứng viên tương ứng với tài khoản này."));

        // Verify audio recording consent
        consentRepository.findFirstByUserIdAndConsentTypeOrderByAgreedAtDesc(candidate.getUser().getId(), "AUDIO_RECORDING")
                .filter(Consent::isAgreed)
                .orElseThrow(() -> new BadRequestException("Ứng viên bắt buộc phải xác nhận đồng thuận ghi âm trước khi tạo phiên phỏng vấn."));

        Position position = positionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vị trí tuyển dụng id: " + request.getPositionId()));

        String sessionToken = "sess_" + UUID.randomUUID().toString().replace("-", "");

        InterviewSession session = new InterviewSession();
        session.setCandidate(candidate);
        session.setPosition(position);
        session.setSessionToken(sessionToken);
        session.setStatus("SCHEDULED");
        session.setScheduledAt(request.getScheduledTime() != null ? request.getScheduledTime() : OffsetDateTime.now());

        InterviewSession savedSession = sessionRepository.save(session);

        // Pre-select questions for the session (Easy -> Medium -> Hard)
        List<Question> easyQuestions = questionRepository.findByPositionIdAndDifficultyAndActiveTrue(position.getId(), "EASY");
        List<Question> mediumQuestions = questionRepository.findByPositionIdAndDifficultyAndActiveTrue(position.getId(), "MEDIUM");
        List<Question> hardQuestions = questionRepository.findByPositionIdAndDifficultyAndActiveTrue(position.getId(), "HARD");

        int order = 1;
        if (!easyQuestions.isEmpty()) {
            sessionQuestionRepository.save(new SessionQuestion(savedSession, easyQuestions.get(0), order++));
        }
        if (!mediumQuestions.isEmpty()) {
            sessionQuestionRepository.save(new SessionQuestion(savedSession, mediumQuestions.get(0), order++));
        }
        if (mediumQuestions.size() > 1) {
            sessionQuestionRepository.save(new SessionQuestion(savedSession, mediumQuestions.get(1), order++));
        }
        if (!hardQuestions.isEmpty()) {
            sessionQuestionRepository.save(new SessionQuestion(savedSession, hardQuestions.get(0), order++));
        }

        return new CreateSessionResponse(savedSession.getId(), sessionToken, gatewayWsUrl);
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewSessionDto getSessionById(Long id) {
        InterviewSession s = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên phỏng vấn id: " + id));
        return toDto(s);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewSessionDto> getSessionsForUser(String userEmail) {
        return candidateRepository.findByUserEmail(userEmail)
                .map(c -> sessionRepository.findByCandidateIdOrderByCreatedAtDesc(c.getId()).stream().map(this::toDto).collect(Collectors.toList()))
                .orElseGet(() -> sessionRepository.findAll().stream().map(this::toDto).collect(Collectors.toList()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TranscriptSegmentDto> getSessionTranscripts(Long sessionId) {
        return transcriptRepository.findBySessionIdOrderByCreatedAtAsc(sessionId).stream()
                .map(ts -> {
                    TranscriptSegmentDto dto = new TranscriptSegmentDto();
                    dto.setId(ts.getId());
                    dto.setSessionId(ts.getSession().getId());
                    dto.setQuestionId(ts.getSessionQuestion() != null ? ts.getSessionQuestion().getQuestion().getId() : null);
                    dto.setQuestionText(ts.getQuestionText());
                    dto.setAnswerText(ts.getAnswerText());
                    dto.setDurationSeconds(ts.getDurationSeconds());
                    dto.setAudioRecordingUrl(ts.getAudioRecordingUrl());
                    dto.setCreatedAt(ts.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private InterviewSessionDto toDto(InterviewSession s) {
        InterviewSessionDto dto = new InterviewSessionDto();
        dto.setId(s.getId());
        dto.setCandidateId(s.getCandidate().getId());
        dto.setCandidateName(s.getCandidate().getUser().getFullName());
        dto.setPositionId(s.getPosition().getId());
        dto.setPositionTitle(s.getPosition().getTitle());
        dto.setSessionToken(s.getSessionToken());
        dto.setStatus(s.getStatus());
        dto.setScheduledAt(s.getScheduledAt());
        dto.setStartedAt(s.getStartedAt());
        dto.setCompletedAt(s.getCompletedAt());
        dto.setCreatedAt(s.getCreatedAt());
        return dto;
    }
}
