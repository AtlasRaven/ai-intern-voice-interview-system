package com.intern.interview.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "question_skills")
public class QuestionSkill {

    @EmbeddedId
    private QuestionSkillId id = new QuestionSkillId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionId")
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    public QuestionSkill() {}

    public QuestionSkill(Question question, Skill skill) {
        this.question = question;
        this.skill = skill;
        this.id = new QuestionSkillId(question.getId(), skill.getId());
    }

    public QuestionSkillId getId() { return id; }
    public void setId(QuestionSkillId id) { this.id = id; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }
}
