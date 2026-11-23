package com.hireloop.backend.repository;

import com.hireloop.backend.entity.Application;
import com.hireloop.backend.entity.Job;
import com.hireloop.backend.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByCandidateIdOrderByAppliedAtDesc(Long candidateId);
    List<Application> findByJobId(Long jobId);
    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);
    long countByJobId(Long jobId);
    long countByJobIdAndStatus(Long jobId, ApplicationStatus status);

    List<Application> findByJobIn(List<Job> jobs);
    long countByJobIn(List<Job> jobs);
    long countByJobInAndStatus(List<Job> jobs, ApplicationStatus status);

    @Modifying
    @Transactional
    @Query("DELETE FROM Application a WHERE a.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);
}
