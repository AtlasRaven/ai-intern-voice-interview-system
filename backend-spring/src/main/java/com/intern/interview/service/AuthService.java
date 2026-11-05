package com.intern.interview.service;

import com.intern.interview.dto.AuthResponse;
import com.intern.interview.dto.LoginRequest;
import com.intern.interview.dto.RegisterRequest;
import com.intern.interview.dto.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDto getCurrentUser(String email);
}
