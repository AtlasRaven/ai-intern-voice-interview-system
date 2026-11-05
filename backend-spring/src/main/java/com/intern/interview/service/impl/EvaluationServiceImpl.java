package com.intern.interview.service.impl;

import com.intern.interview.dto.EvaluationDto;
import com.intern.interview.dto.HROverrideEvaluationRequest;
import com.intern.interview.entity.AuditLog;
import com.intern.interview.entity.Evaluation;
import com.intern.interview.entity.User;
import com.intern.interview.exception.ResourceNotFoundException;
import com.intern.interview.repository.AuditLogRepository;
import com.intern.interview.repository.EvaluationRepository;
import com.intern.interview.repository.UserRepository;
import com.intern.interview.service.EvaluationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluationServiceImpl implements EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public EvaluationServiceImpl(EvaluationRepository evaluationRepository,
                                 UserRepository userRepository,
                                 AuditLogRepository auditLogRepository) {
        this.evaluationRepository = evaluationRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EvaluationDto> getEvaluations(Integer positionId, BigDecimal minScore) {
        return evaluationRepository.findWithFilters(positionId, minScore).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EvaluationDto getEvaluationById(Long id) {
        Evaluation eval = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kết quả đánh giá id: " + id));
        return toDto(eval);
    }

    @Override
    @Transactional(readOnly = true)
    public EvaluationDto getEvaluationBySessionId(Long sessionId) {
        Evaluation eval = evaluationRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Chưa có kết quả đánh giá cho phiên phỏng vấn id: " + sessionId));
        return toDto(eval);
    }

    @Override
    @Transactional
    public EvaluationDto hrOverrideEvaluation(Long id, HROverrideEvaluationRequest request, String hrEmail) {
        Evaluation eval = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kết quả đánh giá id: " + id));

        User hrUser = userRepository.findByEmail(hrEmail).orElse(null);

        String oldValue = String.format("Score: %s, Status: %s, Notes: %s",
                eval.getHrScoreOverride() != null ? eval.getHrScoreOverride() : eval.getOverallScore(),
                eval.getFinalStatus(),
                eval.getHrNotes());

        if (request.getHrScoreOverride() != null) {
            eval.setHrScoreOverride(request.getHrScoreOverride());
        }
        if (request.getHrNotes() != null) {
            eval.setHrNotes(request.getHrNotes().trim());
        }
        if (request.getFinalStatus() != null) {
            eval.setFinalStatus(request.getFinalStatus().trim().toUpperCase());
        }

        eval.setHrEvaluator(hrUser);
        eval.setUpdatedAt(OffsetDateTime.now());

        Evaluation saved = evaluationRepository.save(eval);

        // Record Audit Log
        AuditLog log = new AuditLog();
        log.setUser(hrUser);
        log.setAction("HR_OVERRIDE_EVALUATION");
        log.setResourceType("EVALUATION");
        log.setResourceId(saved.getId().toString());
        log.setOldValue(oldValue);
        log.setNewValue(String.format("Score: %s, Status: %s, Notes: %s",
                saved.getHrScoreOverride(), saved.getFinalStatus(), saved.getHrNotes()));
        auditLogRepository.save(log);

        return toDto(saved);
    }

    private EvaluationDto toDto(Evaluation e) {
        EvaluationDto dto = new EvaluationDto();
        dto.setId(e.getId());
        dto.setSessionId(e.getSession().getId());
        dto.setCandidateName(e.getSession().getCandidate().getUser().getFullName());
        dto.setPositionTitle(e.getSession().getPosition().getTitle());
        dto.setTechnicalScore(e.getTechnicalScore());
        dto.setProblemSolvingScore(e.getProblemSolvingScore());
        dto.setCommunicationScore(e.getCommunicationScore());
        dto.setOverallScore(e.getOverallScore());
        dto.setAiFeedback(e.getAiFeedback());
        dto.setHrScoreOverride(e.getHrScoreOverride());
        dto.setHrNotes(e.getHrNotes());
        dto.setFinalStatus(e.getFinalStatus());
        dto.setEvaluatedAt(e.getEvaluatedAt());
        return dto;
    }
}
