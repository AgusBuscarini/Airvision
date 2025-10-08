package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Service.OpenSkyService;
import com.tesis.AirVision.Dtos.ExternalFlightDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {
    private final OpenSkyService openSkyService;

    public FlightController(OpenSkyService openSkyService) {
        this.openSkyService = openSkyService;
    }

    @GetMapping("/realtime")
    public ResponseEntity<List<ExternalFlightDto>> getRealTimeFlights() {
        List<ExternalFlightDto> flights = openSkyService.getAllFlights();
        return ResponseEntity.ok(flights);
    }
}
