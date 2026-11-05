package com.intern.interview.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intern.interview.dto.InternalSessionContextResponse;
import com.intern.interview.dto.QuestionDto;
import com.intern.interview.dto.SaveTranscriptSegmentRequest;
import com.intern.interview.dto.TranscriptSegmentDto;
import com.intern.interview.security.CustomUserDetailsService;
import com.intern.interview.security.JwtTokenProvider;
import com.intern.interview.service.InternalGatewayService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = InternalGatewayController.class)
@AutoConfigureMockMvc(addFilters = false)
class InternalGatewayControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InternalGatewayService internalGatewayService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("REST: GET /api/v1/internal/sessions/{id}/context thành công trả về 200 OK")
    void getSessionContext_Success() throws Exception {
        InternalSessionContextResponse res = new InternalSessionContextResponse();
        res.setSessionId(42L);
        res.setCandidateId(1L);
        res.setCandidateName("Nguyen Van An");
        res.setPositionTitle("Java Backend Intern");
        res.setQuestions(List.of(new QuestionDto()));

        when(internalGatewayService.getSessionContext(42L)).thenReturn(res);

        mockMvc.perform(get("/api/v1/internal/sessions/42/context")
                        .header("X-Internal-Service-Key", "intern-voice-gateway-internal-secret-token-key-2026")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.sessionId").value(42));
    }

    @Test
    @DisplayName("REST: POST /api/v1/internal/sessions/{id}/transcripts lưu đoạn hội thoại thành công")
    void saveTranscriptSegment_Success() throws Exception {
        SaveTranscriptSegmentRequest req = new SaveTranscriptSegmentRequest();
        req.setQuestionText("Câu hỏi 1?");
        req.setAnswerText("Trả lời 1.");

        TranscriptSegmentDto dto = new TranscriptSegmentDto();
        dto.setId(101L);
        dto.setSessionId(42L);
        dto.setQuestionText("Câu hỏi 1?");
        dto.setAnswerText("Trả lời 1.");

        when(internalGatewayService.saveTranscriptSegment(eq(42L), any())).thenReturn(dto);

        mockMvc.perform(post("/api/v1/internal/sessions/42/transcripts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(101));
    }
}
