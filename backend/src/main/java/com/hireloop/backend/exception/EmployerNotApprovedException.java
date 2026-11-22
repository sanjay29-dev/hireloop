package com.hireloop.backend.exception;

public class EmployerNotApprovedException extends RuntimeException {
    public EmployerNotApprovedException(String message) {
        super(message);
    }
}
