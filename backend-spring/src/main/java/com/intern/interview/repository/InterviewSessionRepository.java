package com.intern.interview.repository;

import com.intern.interview.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    Optional<InterviewSession> findBySessionToken(String sessionToken);
    List<InterviewSession> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);
    List<InterviewSession> findByStatusOrderByCreatedAtDesc(String status);
}
