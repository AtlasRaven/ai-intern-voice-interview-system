package com.intern.interview.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PositionSkillId implements Serializable {

    @Column(name = "position_id")
    private Integer positionId;

    @Column(name = "skill_id")
    private Integer skillId;

    public PositionSkillId() {}

    public PositionSkillId(Integer positionId, Integer skillId) {
        this.positionId = positionId;
        this.skillId = skillId;
    }

    public Integer getPositionId() { return positionId; }
    public void setPositionId(Integer positionId) { this.positionId = positionId; }

    public Integer getSkillId() { return skillId; }
    public void setSkillId(Integer skillId) { this.skillId = skillId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PositionSkillId that = (PositionSkillId) o;
        return Objects.equals(positionId, that.positionId) && Objects.equals(skillId, that.skillId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(positionId, skillId);
    }
}
