package com.intern.interview.repository;

import com.intern.interview.entity.SessionQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionQuestionRepository extends JpaRepository<SessionQuestion, Long> {
    List<SessionQuestion> findBySessionIdOrderBySequenceOrderAsc(Long sessionId);
    Optional<SessionQuestion> findBySessionIdAndSequenceOrder(Long sessionId, Integer sequenceOrder);
}
