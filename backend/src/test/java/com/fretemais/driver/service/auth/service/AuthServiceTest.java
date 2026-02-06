package com.fretemais.driver.service.auth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fretemais.driver.service.auth.domain.User;
import com.fretemais.driver.service.auth.dto.LoginRequest;
import com.fretemais.driver.service.auth.dto.LoginResponse;
import com.fretemais.driver.service.auth.exception.UnauthorizedException;
import com.fretemais.driver.service.auth.repository.UserRepository;
import com.fretemais.driver.service.auth.security.JwtTokenProvider;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_success_returns_token_and_expiration() {
        User user = new User();
        user.setEmail("admin@fretemais.com");
        user.setPassword("hash");
        user.setActive(true);

        LoginRequest request = new LoginRequest("admin@fretemais.com", "fretemais@2026");

        when(userRepository.findByEmail("admin@fretemais.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("fretemais@2026", "hash"))
                .thenReturn(true);
        when(jwtTokenProvider.generateToken(user))
                .thenReturn("token-123");
        when(jwtTokenProvider.getExpirationInMillis())
                .thenReturn(3600000L);

        LoginResponse response = authService.login(request);

        assertEquals("token-123", response.token());
        assertEquals("3600000", response.expiresAt());
    }

    @Test
    void login_user_not_found_throws_unauthorized() {
        LoginRequest request = new LoginRequest("missing@fretemais.com", "123456");

        when(userRepository.findByEmail("missing@fretemais.com"))
                .thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
        verify(passwordEncoder, never()).matches(any(), any());
    }

    @Test
    void login_inactive_user_throws_unauthorized() {
        User user = new User();
        user.setEmail("inactive@fretemais.com");
        user.setPassword("hash");
        user.setActive(false);

        LoginRequest request = new LoginRequest("inactive@fretemais.com", "123456");

        when(userRepository.findByEmail("inactive@fretemais.com"))
                .thenReturn(Optional.of(user));

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtTokenProvider, never()).generateToken(any());
    }

    @Test
    void login_wrong_password_throws_unauthorized() {
        User user = new User();
        user.setEmail("admin@fretemais.com");
        user.setPassword("hash");
        user.setActive(true);

        LoginRequest request = new LoginRequest("admin@fretemais.com", "wrong");

        when(userRepository.findByEmail("admin@fretemais.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches(eq("wrong"), eq("hash")))
                .thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
        verify(jwtTokenProvider, never()).generateToken(any());
    }
}
