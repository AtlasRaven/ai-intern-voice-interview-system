package com.intern.interview.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "position_skills")
public class PositionSkill {

    @EmbeddedId
    private PositionSkillId id = new PositionSkillId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("positionId")
    @JoinColumn(name = "position_id")
    private Position position;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(name = "is_required", nullable = false)
    private boolean required = true;

    public PositionSkill() {}

    public PositionSkill(Position position, Skill skill, boolean required) {
        this.position = position;
        this.skill = skill;
        this.required = required;
        this.id = new PositionSkillId(position.getId(), skill.getId());
    }

    public PositionSkillId getId() { return id; }
    public void setId(PositionSkillId id) { this.id = id; }

    public Position getPosition() { return position; }
    public void setPosition(Position position) { this.position = position; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public boolean isRequired() { return required; }
    public void setRequired(boolean required) { this.required = required; }
}
