package com.intern.interview.service;

import com.intern.interview.dto.CreateSessionRequest;
import com.intern.interview.dto.CreateSessionResponse;
import com.intern.interview.dto.InterviewSessionDto;
import com.intern.interview.dto.TranscriptSegmentDto;
import java.util.List;

public interface InterviewSessionService {
    CreateSessionResponse createSession(CreateSessionRequest request, String candidateEmail);
    InterviewSessionDto getSessionById(Long id);
    List<InterviewSessionDto> getSessionsForUser(String userEmail);
    List<TranscriptSegmentDto> getSessionTranscripts(Long sessionId);
}
