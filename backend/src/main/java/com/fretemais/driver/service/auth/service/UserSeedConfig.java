package com.fretemais.driver.service.auth.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fretemais.driver.service.auth.domain.User;
import com.fretemais.driver.service.auth.repository.UserRepository;

@Configuration
public class UserSeedConfig {

    @Bean
    CommandLineRunner seedAdminUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            String email = "admin@fretemais.com";

            if (userRepository.findByEmail(email).isEmpty()) {
                User admin = new User();
                admin.setEmail(email);
                admin.setPassword(passwordEncoder.encode("fretemais@2026"));
                admin.setActive(true);

                userRepository.save(admin);

                System.out.println("Usuário admin criado com sucesso: " + email);
            }
        };
    }
}
