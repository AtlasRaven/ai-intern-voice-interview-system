package com.intern.interview.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class InternalServiceAuthFilter extends OncePerRequestFilter {

    private final String expectedServiceKey;

    public InternalServiceAuthFilter(
            @Value("${app.internal.service-key:intern-voice-gateway-internal-secret-token-key-2026}") String expectedServiceKey) {
        this.expectedServiceKey = expectedServiceKey;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();

        if (path.startsWith("/api/v1/internal")) {
            String incomingKey = request.getHeader("X-Internal-Service-Key");

            if (incomingKey == null || !incomingKey.equals(expectedServiceKey)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/problem+json;charset=UTF-8");
                response.getWriter().write("{\"type\":\"https://api.intern-interview.vn/errors/forbidden\"," +
                        "\"title\":\"Forbidden\"," +
                        "\"status\":403," +
                        "\"detail\":\"Khóa dịch vụ nội bộ không hợp lệ hoặc bị thiếu.\"}");
                return;
            }

            // Authenticate internal caller with ROLE_INTERNAL_SERVICE
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    "INTERNAL_VOICE_GATEWAY",
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_INTERNAL_SERVICE"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
