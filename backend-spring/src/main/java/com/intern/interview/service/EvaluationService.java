package com.intern.interview.service;

import com.intern.interview.dto.EvaluationDto;
import com.intern.interview.dto.HROverrideEvaluationRequest;
import java.math.BigDecimal;
import java.util.List;

public interface EvaluationService {
    List<EvaluationDto> getEvaluations(Integer positionId, BigDecimal minScore);
    EvaluationDto getEvaluationById(Long id);
    EvaluationDto getEvaluationBySessionId(Long sessionId);
    EvaluationDto hrOverrideEvaluation(Long id, HROverrideEvaluationRequest request, String hrEmail);
}
