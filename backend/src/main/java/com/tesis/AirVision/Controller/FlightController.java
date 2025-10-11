package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Service.FlightScheduledService;
import com.tesis.AirVision.Service.OpenSkyService;
import com.tesis.AirVision.Dtos.ExternalFlightDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FlightController {
    private final OpenSkyService openSkyService;
    private final FlightScheduledService flightScheduledService;

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
}
