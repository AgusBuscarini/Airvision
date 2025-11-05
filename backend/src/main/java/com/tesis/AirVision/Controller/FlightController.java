package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Service.FlightScheduledService;
import com.tesis.AirVision.Service.OpenSkyService;
import com.tesis.AirVision.Service.FlightManagementService;
import com.tesis.AirVision.Dtos.Flight.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FlightController {
    private final OpenSkyService openSkyService;
    private final FlightScheduledService flightScheduledService;
    private final FlightManagementService flightManagementService;

    @GetMapping("/realtime")
    public ResponseEntity<List<ExternalFlightDto>> getRealTimeFlights() {
        List<ExternalFlightDto> flights = openSkyService.getAllFlights();
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/limit")
    public ResponseEntity<List<ExternalFlightDto>> getFlightsLim(@RequestParam(defaultValue = "300") int limit) {
        List<ExternalFlightDto> flights = openSkyService.getFlightsLimited(limit);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/scheduled")
    public ResponseEntity<List<ExternalFlightDto>> getFlightsScheduled() {
        List<ExternalFlightDto> flights = flightScheduledService.getFlightsScheduled();
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/privates")
    public ResponseEntity<List<PrivateFlightDto>> getPrivateFlights(@AuthenticationPrincipal User user) {
        List<PrivateFlightDto> flights = flightManagementService.getPrivateFlights(user);
        return ResponseEntity.ok(flights);
    }

    @PostMapping("/privates")
    public ResponseEntity<PrivateFlightDto> createPrivateFlight(
            @Valid @RequestBody CreatePrivateFlightRequest request,
            @AuthenticationPrincipal User authenticatedUser) {
        PrivateFlightDto newFlight = flightManagementService.createPrivateFlight(request, authenticatedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newFlight);
    }

    @DeleteMapping("/privates/{id}")
    public ResponseEntity<Void> deletePrivateFlight(
            @PathVariable UUID id,
            @AuthenticationPrincipal User authenticatedUser) {

        flightManagementService.deletePrivateFlight(id, authenticatedUser);

        return ResponseEntity.noContent().build();
    }
}
