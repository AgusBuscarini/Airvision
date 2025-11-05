package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.Airline.AirlineRequest;
import com.tesis.AirVision.Dtos.Airline.AirlineResponse;
import com.tesis.AirVision.Service.AirlineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/airlines")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminAirlineController {

    private final AirlineService airlineService;

    @GetMapping
    public ResponseEntity<List<AirlineResponse>> getAirlines(){
        List<AirlineResponse> flights = airlineService.getAirlines();
        return ResponseEntity.ok(flights);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AirlineResponse> updateAirline(@PathVariable UUID id, @RequestBody AirlineRequest airlineRequest){
        return airlineService.updateAirline(id, airlineRequest)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AirlineResponse> deleteAirline(@PathVariable UUID id){
        airlineService.deleteAirline(id);
        return ResponseEntity.noContent().build();
    }
}
