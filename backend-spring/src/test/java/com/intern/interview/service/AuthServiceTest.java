package com.intern.interview.service;

import com.intern.interview.dto.AuthResponse;
import com.intern.interview.dto.LoginRequest;
import com.intern.interview.dto.RegisterRequest;
import com.intern.interview.dto.UserDto;
import com.intern.interview.entity.Candidate;
import com.intern.interview.entity.Role;
import com.intern.interview.entity.User;
import com.intern.interview.exception.BadRequestException;
import com.intern.interview.repository.CandidateRepository;
import com.intern.interview.repository.RoleRepository;
import com.intern.interview.repository.UserRepository;
import com.intern.interview.security.JwtTokenProvider;
import com.intern.interview.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    private Role candidateRole;

    @BeforeEach
    void setUp() {
        candidateRole = new Role(3, "ROLE_CANDIDATE", "Ứng viên");
    }

    @Test
    @DisplayName("US-01: Đăng ký ứng viên thành công (Happy Path)")
    void register_Candidate_Success() {
        // Arrange
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test.candidate@intern.vn");
        req.setPassword("Password123");
        req.setFullName("Nguyễn Văn Test");
        req.setRole("ROLE_CANDIDATE");

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(roleRepository.findByName("ROLE_CANDIDATE")).thenReturn(Optional.of(candidateRole));
        when(passwordEncoder.encode(any())).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(100L);
            return u;
        });
        when(tokenProvider.generateTokenForEmail(any())).thenReturn("jwt_mock_token");
        when(tokenProvider.getExpirationMs()).thenReturn(86400000L);

        // Act
        AuthResponse res = authService.register(req);

        // Assert
        assertNotNull(res);
        assertEquals("jwt_mock_token", res.getToken());
        assertEquals("test.candidate@intern.vn", res.getUser().getEmail());
        verify(candidateRepository, times(1)).save(any(Candidate.class));
    }

    @Test
    @DisplayName("US-01: Đăng ký thất bại khi email đã tồn tại (Edge Case / Failure)")
    void register_DuplicateEmail_ThrowsBadRequest() {
        // Arrange
        RegisterRequest req = new RegisterRequest();
        req.setEmail("existing@intern.vn");
        req.setPassword("Password123");
        req.setFullName("Trùng Email");

        when(userRepository.existsByEmail("existing@intern.vn")).thenReturn(true);

        // Act & Assert
        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.register(req));
        assertTrue(ex.getMessage().contains("đã được đăng ký"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("US-01: Đăng nhập thành công trả về JWT (Happy Path)")
    void login_Success() {
        // Arrange
        LoginRequest req = new LoginRequest("test.candidate@intern.vn", "Password123");
        Authentication auth = mock(Authentication.class);

        User user = new User();
        user.setId(100L);
        user.setEmail("test.candidate@intern.vn");
        user.setFullName("Nguyễn Văn Test");
        user.setRole(candidateRole);

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("jwt_login_token");
        when(tokenProvider.getExpirationMs()).thenReturn(86400000L);
        when(userRepository.findByEmail("test.candidate@intern.vn")).thenReturn(Optional.of(user));

        // Act
        AuthResponse res = authService.login(req);

        // Assert
        assertNotNull(res);
        assertEquals("jwt_login_token", res.getToken());
        assertEquals("test.candidate@intern.vn", res.getUser().getEmail());
    }

    @Test
    @DisplayName("US-01: Đăng nhập sai mật khẩu ném BadCredentialsException (Failure)")
    void login_BadCredentials_ThrowsException() {
        // Arrange
        LoginRequest req = new LoginRequest("test.candidate@intern.vn", "WrongPassword");
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }
}
