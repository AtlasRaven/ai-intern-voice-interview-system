package com.intern.interview.service.impl;

import com.intern.interview.dto.*;
import com.intern.interview.entity.Evaluation;
import com.intern.interview.entity.InterviewSession;
import com.intern.interview.entity.SessionQuestion;
import com.intern.interview.entity.TranscriptSegment;
import com.intern.interview.exception.ResourceNotFoundException;
import com.intern.interview.repository.EvaluationRepository;
import com.intern.interview.repository.InterviewSessionRepository;
import com.intern.interview.repository.SessionQuestionRepository;
import com.intern.interview.repository.TranscriptSegmentRepository;
import com.intern.interview.service.InternalGatewayService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InternalGatewayServiceImpl implements InternalGatewayService {

    private final InterviewSessionRepository sessionRepository;
    private final SessionQuestionRepository sessionQuestionRepository;
    private final TranscriptSegmentRepository transcriptRepository;
    private final EvaluationRepository evaluationRepository;

    public InternalGatewayServiceImpl(InterviewSessionRepository sessionRepository,
                                      SessionQuestionRepository sessionQuestionRepository,
                                      TranscriptSegmentRepository transcriptRepository,
                                      EvaluationRepository evaluationRepository) {
        this.sessionRepository = sessionRepository;
        this.sessionQuestionRepository = sessionQuestionRepository;
        this.transcriptRepository = transcriptRepository;
        this.evaluationRepository = evaluationRepository;
    }

    @Override
    @Transactional
    public InternalSessionContextResponse getSessionContext(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên phỏng vấn id: " + sessionId));

        if ("SCHEDULED".equals(session.getStatus())) {
            session.setStatus("IN_PROGRESS");
            session.setStartedAt(OffsetDateTime.now());
            sessionRepository.save(session);
        }

        List<SessionQuestion> sessionQuestions = sessionQuestionRepository.findBySessionIdOrderBySequenceOrderAsc(sessionId);

        List<QuestionDto> questionDtos = sessionQuestions.stream().map(sq -> {
            QuestionDto dto = new QuestionDto();
            dto.setId(sq.getQuestion().getId());
            dto.setPositionId(session.getPosition().getId());
            dto.setPositionTitle(session.getPosition().getTitle());
            dto.setContent(sq.getQuestion().getContent());
            dto.setDifficulty(sq.getQuestion().getDifficulty());
            dto.setSampleAnswer(sq.getQuestion().getSampleAnswer());
            dto.setEvaluationRubric(sq.getQuestion().getEvaluationRubric());
            return dto;
        }).collect(Collectors.toList());

        InternalSessionContextResponse response = new InternalSessionContextResponse();
        response.setSessionId(session.getId());
        response.setCandidateId(session.getCandidate().getId());
        response.setCandidateName(session.getCandidate().getUser().getFullName());
        response.setPositionId(session.getPosition().getId());
        response.setPositionTitle(session.getPosition().getTitle());
        response.setQuestions(questionDtos);

        return response;
    }

    @Override
    @Transactional
    public TranscriptSegmentDto saveTranscriptSegment(Long sessionId, SaveTranscriptSegmentRequest request) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên phỏng vấn id: " + sessionId));

        TranscriptSegment segment = new TranscriptSegment();
        segment.setSession(session);
        segment.setQuestionText(request.getQuestionText().trim());
        segment.setAnswerText(request.getAnswerText().trim());
        segment.setDurationSeconds(request.getDurationSeconds() != null ? request.getDurationSeconds() : 0);
        segment.setAudioRecordingUrl(request.getAudioRecordingUrl());
        segment.setCreatedAt(OffsetDateTime.now());

        if (request.getQuestionId() != null) {
            sessionQuestionRepository.findBySessionIdOrderBySequenceOrderAsc(sessionId).stream()
                    .filter(sq -> sq.getQuestion().getId().equals(request.getQuestionId()))
                    .findFirst()
                    .ifPresent(segment::setSessionQuestion);
        }

        TranscriptSegment saved = transcriptRepository.save(segment);

        TranscriptSegmentDto dto = new TranscriptSegmentDto();
        dto.setId(saved.getId());
        dto.setSessionId(sessionId);
        dto.setQuestionId(request.getQuestionId());
        dto.setQuestionText(saved.getQuestionText());
        dto.setAnswerText(saved.getAnswerText());
        dto.setDurationSeconds(saved.getDurationSeconds());
        dto.setAudioRecordingUrl(saved.getAudioRecordingUrl());
        dto.setCreatedAt(saved.getCreatedAt());
        return dto;
    }

    @Override
    @Transactional
    public EvaluationDto submitAIEvaluation(Long sessionId, SubmitAIEvaluationRequest request) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên phỏng vấn id: " + sessionId));

        // Update session completion
        session.setStatus("COMPLETED");
        session.setCompletedAt(OffsetDateTime.now());
        sessionRepository.save(session);

        // Save evaluation
        Evaluation eval = evaluationRepository.findBySessionId(sessionId).orElse(new Evaluation());
        eval.setSession(session);
        eval.setTechnicalScore(request.getTechnicalScore());
        eval.setProblemSolvingScore(request.getProblemSolvingScore());
        eval.setCommunicationScore(request.getCommunicationScore());
        eval.setOverallScore(request.getOverallScore());
        eval.setAiFeedback(request.getAiFeedback().trim());
        eval.setFinalStatus(request.getOverallScore().doubleValue() >= 6.5 ? "PASSED" : "FAILED");
        eval.setEvaluatedAt(OffsetDateTime.now());
        eval.setUpdatedAt(OffsetDateTime.now());

        Evaluation saved = evaluationRepository.save(eval);

        EvaluationDto dto = new EvaluationDto();
        dto.setId(saved.getId());
        dto.setSessionId(sessionId);
        dto.setCandidateName(session.getCandidate().getUser().getFullName());
        dto.setPositionTitle(session.getPosition().getTitle());
        dto.setTechnicalScore(saved.getTechnicalScore());
        dto.setProblemSolvingScore(saved.getProblemSolvingScore());
        dto.setCommunicationScore(saved.getCommunicationScore());
        dto.setOverallScore(saved.getOverallScore());
        dto.setAiFeedback(saved.getAiFeedback());
        dto.setFinalStatus(saved.getFinalStatus());
        dto.setEvaluatedAt(saved.getEvaluatedAt());
        return dto;
    }

    @Override
    @Transactional
    public void terminateSession(Long sessionId, String reason) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            session.setStatus("TIMEOUT".equalsIgnoreCase(reason) ? "TIMEOUT" : "CANCELLED");
            session.setCompletedAt(OffsetDateTime.now());
            sessionRepository.save(session);
        });
    }
}
