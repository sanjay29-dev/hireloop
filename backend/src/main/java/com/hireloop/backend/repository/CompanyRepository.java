package com.hireloop.backend.repository;

import com.hireloop.backend.entity.Company;
import com.hireloop.backend.enums.ApprovalStatus;
import com.hireloop.backend.enums.CompanyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUserId(Long userId);
    List<Company> findByApprovalStatus(ApprovalStatus approvalStatus);
    long countByApprovalStatus(ApprovalStatus approvalStatus);
    List<Company> findByStatus(CompanyStatus status);
}
