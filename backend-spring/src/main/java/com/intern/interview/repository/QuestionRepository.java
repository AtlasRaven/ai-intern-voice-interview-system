package com.intern.interview.repository;

import com.intern.interview.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByPositionIdAndActiveTrue(Integer positionId);
    List<Question> findByPositionIdAndDifficultyAndActiveTrue(Integer positionId, String difficulty);
}
