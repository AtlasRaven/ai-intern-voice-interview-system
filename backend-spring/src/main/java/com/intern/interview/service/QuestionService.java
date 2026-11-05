package com.intern.interview.service;

import com.intern.interview.dto.CreateQuestionRequest;
import com.intern.interview.dto.QuestionDto;
import java.util.List;

public interface QuestionService {
    List<QuestionDto> getQuestions(Integer positionId, String difficulty);
    QuestionDto getQuestionById(Long id);
    QuestionDto createQuestion(CreateQuestionRequest request);
    void deleteQuestion(Long id);
}
