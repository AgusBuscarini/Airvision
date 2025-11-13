package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.User.ProfileResponseDto;
import com.tesis.AirVision.Entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    @GetMapping("/me")
    public ResponseEntity<ProfileResponseDto> getMyProfile(@AuthenticationPrincipal User authenticatedUser) {
        if (authenticatedUser == null) {
            return ResponseEntity.status(401).build();
        }

        ProfileResponseDto profile = ProfileResponseDto.builder()
                .id(authenticatedUser.getId())
                .name(authenticatedUser.getName())
                .email(authenticatedUser.getEmail())
                .role(authenticatedUser.getRole())
                .build();

        return ResponseEntity.ok(profile);
    }
}
