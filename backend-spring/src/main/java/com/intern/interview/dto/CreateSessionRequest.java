package com.intern.interview.dto;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public class CreateSessionRequest {

    @NotNull(message = "Vị trí không được để trống")
    private Integer positionId;

    private OffsetDateTime scheduledTime;

    public CreateSessionRequest() {}

    public Integer getPositionId() { return positionId; }
    public void setPositionId(Integer positionId) { this.positionId = positionId; }

    public OffsetDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(OffsetDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
}
