package com.hireloop.backend.controller;

import com.hireloop.backend.dto.ApiResponse;
import com.hireloop.backend.dto.AuthResponse;
import com.hireloop.backend.dto.CandidateRegisterRequest;
import com.hireloop.backend.dto.EmployerRegisterRequest;
import com.hireloop.backend.dto.LoginRequest;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Candidate Registration
     */
    @PostMapping("/register/candidate")
    public ResponseEntity<ApiResponse<AuthResponse>> registerCandidate(@Valid @RequestBody CandidateRegisterRequest request) {
        AuthResponse response = authService.registerCandidate(request);
        return new ResponseEntity<>(ApiResponse.success("Candidate registered successfully", response), HttpStatus.CREATED);
    }

    /**
     * Employer Registration
     * Creates User + Company with approvalStatus = PENDING
     */
    @PostMapping("/register/employer")
    public ResponseEntity<ApiResponse<AuthResponse>> registerEmployer(@Valid @RequestBody EmployerRegisterRequest request) {
        AuthResponse response = authService.registerEmployer(request);
        return new ResponseEntity<>(ApiResponse.success("Employer registered successfully. Account is pending admin approval.", response), HttpStatus.CREATED);
    }

    /**
     * User Login (Candidate, Employer, Admin)
     * Blocks suspended accounts
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    /**
     * Get Current Authenticated User Info
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }
}
