package com.intern.interview.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class QuestionSkillId implements Serializable {

    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "skill_id")
    private Integer skillId;

    public QuestionSkillId() {}

    public QuestionSkillId(Long questionId, Integer skillId) {
        this.questionId = questionId;
        this.skillId = skillId;
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public Integer getSkillId() { return skillId; }
    public void setSkillId(Integer skillId) { this.skillId = skillId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuestionSkillId that = (QuestionSkillId) o;
        return Objects.equals(questionId, that.questionId) && Objects.equals(skillId, that.skillId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(questionId, skillId);
    }
}
