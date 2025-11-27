package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.Stats.StatsResponseDto;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatsController {
    private final StatsService statsService;

    @GetMapping("/dashboard")
    public ResponseEntity<StatsResponseDto> getDashboardStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(statsService.getDashboardStats(user));
    }

    @GetMapping("/export")
    public ResponseEntity<StatsResponseDto> getExportStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(statsService.getFullStats(user));
    }
}
