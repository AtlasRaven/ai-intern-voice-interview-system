package com.intern.interview.service.impl;

import com.intern.interview.dto.CreatePositionRequest;
import com.intern.interview.dto.PositionDto;
import com.intern.interview.entity.Position;
import com.intern.interview.entity.PositionSkill;
import com.intern.interview.entity.Skill;
import com.intern.interview.exception.BadRequestException;
import com.intern.interview.exception.ResourceNotFoundException;
import com.intern.interview.repository.PositionRepository;
import com.intern.interview.repository.SkillRepository;
import com.intern.interview.service.PositionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PositionServiceImpl implements PositionService {

    private final PositionRepository positionRepository;
    private final SkillRepository skillRepository;

    public PositionServiceImpl(PositionRepository positionRepository, SkillRepository skillRepository) {
        this.positionRepository = positionRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PositionDto> getAllOpenPositions() {
        return positionRepository.findByOpenTrue().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PositionDto getPositionById(Integer id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vị trí tuyển dụng id: " + id));
        return toDto(position);
    }

    @Override
    @Transactional
    public PositionDto createPosition(CreatePositionRequest request) {
        if (positionRepository.findByCode(request.getCode()).isPresent()) {
            throw new BadRequestException("Mã vị trí '" + request.getCode() + "' đã tồn tại.");
        }

        Position position = new Position();
        position.setCode(request.getCode().trim().toUpperCase());
        position.setTitle(request.getTitle().trim());
        position.setDescription(request.getDescription().trim());
        position.setRequirements(request.getRequirements().trim());
        position.setOpen(true);

        Position saved = positionRepository.save(position);

        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            for (Integer skillId : request.getSkillIds()) {
                Skill skill = skillRepository.findById(skillId).orElse(null);
                if (skill != null) {
                    saved.getPositionSkills().add(new PositionSkill(saved, skill, true));
                }
            }
            saved = positionRepository.save(saved);
        }

        return toDto(saved);
    }

    private PositionDto toDto(Position p) {
        PositionDto dto = new PositionDto();
        dto.setId(p.getId());
        dto.setCode(p.getCode());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setRequirements(p.getRequirements());
        dto.setOpen(p.isOpen());
        dto.setSkills(p.getPositionSkills().stream()
                .map(ps -> ps.getSkill().getName())
                .collect(Collectors.toList()));
        return dto;
    }
}
