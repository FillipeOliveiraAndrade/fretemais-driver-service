package com.fretemais.driver.service.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fretemais.driver.service.auth.dto.LoginRequest;
import com.fretemais.driver.service.auth.dto.LoginResponse;
import com.fretemais.driver.service.auth.domain.User;
import com.fretemais.driver.service.auth.repository.UserRepository;
import com.fretemais.driver.service.auth.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponse login(LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        boolean passwordMatches = passwordEncoder.matches(
                loginRequest.password(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Credenciais inválidas");
        }

        String token = jwtTokenProvider.generateToken(user);

        return new LoginResponse(
                token,
                String.valueOf(jwtTokenProvider.getExpirationInMillis())
        );
    }
}
