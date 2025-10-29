package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.Airline.AirlineRequest;
import com.tesis.AirVision.Dtos.Airline.AirlineResponse;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Service.AirlineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/airlines")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AirlineController {

    private final AirlineService airlineService;

    @PostMapping
    public ResponseEntity<AirlineResponse> createPrivateAirline(
            @Valid @RequestBody AirlineRequest request,
            @AuthenticationPrincipal User authenticatedUser) {

        AirlineResponse response = airlineService.createPrivateAirline(request, authenticatedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}