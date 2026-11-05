package com.intern.interview.service;

import com.intern.interview.dto.CreatePositionRequest;
import com.intern.interview.dto.PositionDto;
import java.util.List;

public interface PositionService {
    List<PositionDto> getAllOpenPositions();
    PositionDto getPositionById(Integer id);
    PositionDto createPosition(CreatePositionRequest request);
}
