package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Stats.StatsResponseDto;
import com.tesis.AirVision.Entity.User;
import org.springframework.stereotype.Service;

@Service
public interface StatsService {
    StatsResponseDto getDashboardStats(User user);
    StatsResponseDto getFullStats(User user);
}
