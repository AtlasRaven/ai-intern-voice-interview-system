package com.intern.interview.repository;

import com.intern.interview.entity.TranscriptSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TranscriptSegmentRepository extends JpaRepository<TranscriptSegment, Long> {
    List<TranscriptSegment> findBySessionIdOrderByCreatedAtAsc(Long sessionId);
}
