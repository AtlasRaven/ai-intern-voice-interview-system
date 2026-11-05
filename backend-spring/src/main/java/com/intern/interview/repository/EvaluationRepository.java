package com.intern.interview.repository;

import com.intern.interview.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findBySessionId(Long sessionId);

    @Query("SELECT e FROM Evaluation e WHERE " +
           "(:positionId IS NULL OR e.session.position.id = :positionId) AND " +
           "(:minScore IS NULL OR e.overallScore >= :minScore) " +
           "ORDER BY e.overallScore DESC")
    List<Evaluation> findWithFilters(@Param("positionId") Integer positionId,
                                     @Param("minScore") BigDecimal minScore);
}
