package com.intern.interview.service;

import com.intern.interview.dto.*;

public interface InternalGatewayService {
    InternalSessionContextResponse getSessionContext(Long sessionId);
    TranscriptSegmentDto saveTranscriptSegment(Long sessionId, SaveTranscriptSegmentRequest request);
    EvaluationDto submitAIEvaluation(Long sessionId, SubmitAIEvaluationRequest request);
    void terminateSession(Long sessionId, String reason);
}
