package com.hireloop.backend.service;

import com.hireloop.backend.dto.AuthResponse;
import com.hireloop.backend.dto.CandidateRegisterRequest;
import com.hireloop.backend.dto.EmployerRegisterRequest;
import com.hireloop.backend.dto.LoginRequest;
import com.hireloop.backend.entity.CandidateProfile;
import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.enums.CompanyStatus;
import com.hireloop.backend.enums.Role;
import com.hireloop.backend.enums.UserStatus;
import com.hireloop.backend.exception.AccountSuspendedException;
import com.hireloop.backend.exception.BadRequestException;
import com.hireloop.backend.exception.ResourceNotFoundException;
import com.hireloop.backend.repository.CandidateProfileRepository;
import com.hireloop.backend.repository.CompanyRepository;
import com.hireloop.backend.repository.UserRepository;
import com.hireloop.backend.security.JwtUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       CandidateProfileRepository candidateProfileRepository,
                       CompanyRepository companyRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Registers a new Candidate and creates an associated candidate profile.
     */
    @Transactional
    public AuthResponse registerCandidate(CandidateRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email is already registered. Please login or use a different email.");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CANDIDATE)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        // Initialize candidate profile
        CandidateProfile profile = CandidateProfile.builder()
                .user(savedUser)
                .phone(request.getPhone())
                .location(request.getLocation())
                .build();
        candidateProfileRepository.save(profile);

        String token = jwtUtils.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), savedUser.getStatus());
    }

    /**
     * Registers a new Employer and creates an associated Company with approvalStatus = PENDING.
     */
    @Transactional
    public AuthResponse registerEmployer(EmployerRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email is already registered. Please login or use a different email.");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.EMPLOYER)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        // Create company profile with PENDING approval status
        Company company = Company.builder()
                .user(savedUser)
                .name(request.getCompanyName().trim())
                .website(request.getCompanyWebsite())
                .location(request.getCompanyLocation())
                .description(request.getCompanyDescription())
                .approvalStatus(ApprovalStatus.PENDING)
                .status(CompanyStatus.ACTIVE)
                .build();
        Company savedCompany = companyRepository.save(company);

        String token = jwtUtils.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());

        AuthResponse response = new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), savedUser.getStatus());
        response.setCompanyId(savedCompany.getId());
        response.setCompanyName(savedCompany.getName());
        response.setCompanyApprovalStatus(savedCompany.getApprovalStatus());

        return response;
    }

    /**
     * Authenticates a user, verifies password, blocks suspended accounts, and returns JWT.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Rule: Block login for suspended users
        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new AccountSuspendedException("Your account has been suspended. Please contact the administrator for assistance.");
        }

        // Rule: A suspended company cannot log in to post
        if (user.getRole() == Role.EMPLOYER) {
            Company company = companyRepository.findByUserId(user.getId()).orElse(null);
            if (company != null && company.getStatus() == CompanyStatus.SUSPENDED) {
                throw new AccountSuspendedException("Your company account has been suspended by administration. Access is restricted.");
            }
        }

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        AuthResponse response = new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getStatus());

        // If employer, attach company details
        if (user.getRole() == Role.EMPLOYER) {
            companyRepository.findByUserId(user.getId()).ifPresent(company -> {
                response.setCompanyId(company.getId());
                response.setCompanyName(company.getName());
                response.setCompanyApprovalStatus(company.getApprovalStatus());
            });
        }

        return response;
    }

    /**
     * Retrieves the currently authenticated User entity.
     */
    @Transactional(readOnly = true)
    public User getCurrentAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadCredentialsException("No authenticated user found");
        }
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
