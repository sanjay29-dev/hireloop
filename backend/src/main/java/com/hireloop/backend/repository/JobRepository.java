package com.hireloop.backend.repository;

import com.hireloop.backend.entity.Job;
import com.hireloop.backend.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    List<Job> findByCompanyId(Long companyId);
    Page<Job> findByCompanyId(Long companyId, Pageable pageable);
    List<Job> findByStatus(JobStatus status);
    long countByCompanyId(Long companyId);
    long countByStatus(JobStatus status);
}
