package com.intern.interview.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intern.interview.dto.AuthResponse;
import com.intern.interview.dto.LoginRequest;
import com.intern.interview.dto.RegisterRequest;
import com.intern.interview.dto.UserDto;
import com.intern.interview.security.CustomUserDetailsService;
import com.intern.interview.security.JwtTokenProvider;
import com.intern.interview.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("REST: POST /api/v1/auth/register thành công trả về 201 Created")
    void register_Success_Returns201() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@intern.vn");
        req.setPassword("Password123");
        req.setFullName("Nguyen Van Test");

        AuthResponse res = new AuthResponse("mock_token", 86400000L,
                new UserDto(1L, "test@intern.vn", "Nguyen Van Test", null, "ROLE_CANDIDATE"));

        when(authService.register(any())).thenReturn(res);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock_token"))
                .andExpect(jsonPath("$.data.user.email").value("test@intern.vn"));
    }

    @Test
    @DisplayName("REST: POST /api/v1/auth/register lỗi validation khi email không hợp lệ trả về 400 Bad Request")
    void register_InvalidEmail_Returns400() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("not-an-email");
        req.setPassword("short");
        req.setFullName("");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Validation Failed"));
    }

    @Test
    @DisplayName("REST: POST /api/v1/auth/login thành công trả về 200 OK")
    void login_Success_Returns200() throws Exception {
        LoginRequest req = new LoginRequest("test@intern.vn", "Password123");
        AuthResponse res = new AuthResponse("login_jwt", 86400000L,
                new UserDto(1L, "test@intern.vn", "Nguyen Van Test", null, "ROLE_CANDIDATE"));

        when(authService.login(any())).thenReturn(res);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("login_jwt"));
    }
}
