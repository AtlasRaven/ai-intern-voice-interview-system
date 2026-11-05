package com.intern.interview.service.impl;

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
import com.intern.interview.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CandidateRepository candidateRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           CandidateRepository candidateRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.candidateRepository = candidateRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được đăng ký trong hệ thống.");
        }

        String roleName = request.getRole() != null ? request.getRole() : "ROLE_CANDIDATE";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(null, roleName, "Tự động khởi tạo")));

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // If candidate, initialize candidate profile
        if ("ROLE_CANDIDATE".equals(role.getName())) {
            Candidate candidate = new Candidate();
            candidate.setUser(savedUser);
            candidateRepository.save(candidate);
        }

        String token = tokenProvider.generateTokenForEmail(savedUser.getEmail());
        UserDto userDto = new UserDto(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getPhone(), savedUser.getRole().getName());

        return new AuthResponse(token, tokenProvider.getExpirationMs(), userDto);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(), user.getRole().getName());
        return new AuthResponse(token, tokenProvider.getExpirationMs(), userDto);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        return new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(), user.getRole().getName());
    }
}
