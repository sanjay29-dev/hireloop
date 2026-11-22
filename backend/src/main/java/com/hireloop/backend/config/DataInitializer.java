package com.hireloop.backend.config;

import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.Role;
import com.hireloop.backend.enums.UserStatus;
import com.hireloop.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.name:System Administrator}")
    private String adminName;

    @Value("${app.default-admin.email:admin@hireloop.com}")
    private String adminEmail;

    @Value("${app.default-admin.password:Admin@123}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default admin user on first application start if not already present
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name(adminName)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            userRepository.save(admin);
            log.info("Default Admin user created successfully: email={}", adminEmail);
        } else {
            log.info("Default Admin user already exists: email={}", adminEmail);
        }
    }
}
