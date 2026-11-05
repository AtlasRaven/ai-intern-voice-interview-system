package com.intern.interview.service.impl;

import com.intern.interview.dto.CreateQuestionRequest;
import com.intern.interview.dto.QuestionDto;
import com.intern.interview.entity.Position;
import com.intern.interview.entity.Question;
import com.intern.interview.entity.QuestionSkill;
import com.intern.interview.entity.Skill;
import com.intern.interview.exception.ResourceNotFoundException;
import com.intern.interview.repository.PositionRepository;
import com.intern.interview.repository.QuestionRepository;
import com.intern.interview.repository.SkillRepository;
import com.intern.interview.service.QuestionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final PositionRepository positionRepository;
    private final SkillRepository skillRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository,
                               PositionRepository positionRepository,
                               SkillRepository skillRepository) {
        this.questionRepository = questionRepository;
        this.positionRepository = positionRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionDto> getQuestions(Integer positionId, String difficulty) {
        List<Question> questions;
        if (positionId != null && difficulty != null) {
            questions = questionRepository.findByPositionIdAndDifficultyAndActiveTrue(positionId, difficulty.toUpperCase());
        } else if (positionId != null) {
            questions = questionRepository.findByPositionIdAndActiveTrue(positionId);
        } else {
            questions = questionRepository.findAll().stream().filter(Question::isActive).collect(Collectors.toList());
        }
        return questions.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionDto getQuestionById(Long id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy câu hỏi id: " + id));
        return toDto(q);
    }

    @Override
    @Transactional
    public QuestionDto createQuestion(CreateQuestionRequest request) {
        Position position = positionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vị trí tuyển dụng id: " + request.getPositionId()));

        Question q = new Question();
        q.setPosition(position);
        q.setContent(request.getContent().trim());
        q.setDifficulty(request.getDifficulty().toUpperCase().trim());
        q.setSampleAnswer(request.getSampleAnswer().trim());
        q.setEvaluationRubric(request.getEvaluationRubric().trim());
        q.setActive(true);

        Question saved = questionRepository.save(q);

        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            for (Integer skillId : request.getSkillIds()) {
                Skill skill = skillRepository.findById(skillId).orElse(null);
                if (skill != null) {
                    saved.getQuestionSkills().add(new QuestionSkill(saved, skill));
                }
            }
            saved = questionRepository.save(saved);
        }

        return toDto(saved);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy câu hỏi id: " + id));
        q.setActive(false);
        questionRepository.save(q);
    }

    private QuestionDto toDto(Question q) {
        QuestionDto dto = new QuestionDto();
        dto.setId(q.getId());
        dto.setPositionId(q.getPosition().getId());
        dto.setPositionTitle(q.getPosition().getTitle());
        dto.setContent(q.getContent());
        dto.setDifficulty(q.getDifficulty());
        dto.setSampleAnswer(q.getSampleAnswer());
        dto.setEvaluationRubric(q.getEvaluationRubric());
        dto.setSkills(q.getQuestionSkills().stream()
                .map(qs -> qs.getSkill().getName())
                .collect(Collectors.toList()));
        return dto;
    }
}
