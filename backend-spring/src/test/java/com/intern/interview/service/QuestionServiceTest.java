package com.intern.interview.service;

import com.intern.interview.dto.CreateQuestionRequest;
import com.intern.interview.dto.QuestionDto;
import com.intern.interview.entity.Position;
import com.intern.interview.entity.Question;
import com.intern.interview.exception.ResourceNotFoundException;
import com.intern.interview.repository.PositionRepository;
import com.intern.interview.repository.QuestionRepository;
import com.intern.interview.repository.SkillRepository;
import com.intern.interview.service.impl.QuestionServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private PositionRepository positionRepository;

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private QuestionServiceImpl questionService;

    @Test
    @DisplayName("US-06: Lấy danh sách câu hỏi theo vị trí và độ khó (Happy Path)")
    void getQuestions_Success() {
        Position pos = new Position();
        pos.setId(1);
        pos.setTitle("Java Backend Intern");

        Question q = new Question();
        q.setId(10L);
        q.setPosition(pos);
        q.setContent("OOP là gì?");
        q.setDifficulty("EASY");
        q.setSampleAnswer("Sample");
        q.setEvaluationRubric("Rubric");
        q.setActive(true);

        when(questionRepository.findByPositionIdAndDifficultyAndActiveTrue(1, "EASY")).thenReturn(List.of(q));

        List<QuestionDto> list = questionService.getQuestions(1, "EASY");

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("OOP là gì?", list.get(0).getContent());
    }

    @Test
    @DisplayName("US-06: Tạo câu hỏi mới thành công (Happy Path)")
    void createQuestion_Success() {
        Position pos = new Position();
        pos.setId(1);
        pos.setTitle("Java Backend");

        CreateQuestionRequest req = new CreateQuestionRequest();
        req.setPositionId(1);
        req.setContent("JVM là gì?");
        req.setDifficulty("EASY");
        req.setSampleAnswer("Java Virtual Machine");
        req.setEvaluationRubric("Nêu định nghĩa 10đ");

        when(positionRepository.findById(1)).thenReturn(Optional.of(pos));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> {
            Question q = invocation.getArgument(0);
            q.setId(50L);
            return q;
        });

        QuestionDto dto = questionService.createQuestion(req);

        assertNotNull(dto);
        assertEquals(50L, dto.getId());
        assertEquals("JVM là gì?", dto.getContent());
    }

    @Test
    @DisplayName("US-06: Xóa câu hỏi (đổi trạng thái active = false)")
    void deleteQuestion_Success() {
        Question q = new Question();
        q.setId(10L);
        q.setActive(true);

        when(questionRepository.findById(10L)).thenReturn(Optional.of(q));

        questionService.deleteQuestion(10L);

        assertFalse(q.isActive());
        verify(questionRepository, times(1)).save(q);
    }
}
