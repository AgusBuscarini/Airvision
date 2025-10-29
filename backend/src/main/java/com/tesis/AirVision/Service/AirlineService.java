package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Airline.AirlineRequest;
import com.tesis.AirVision.Dtos.Airline.AirlineResponse;
import com.tesis.AirVision.Entity.User; // Importar User
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface AirlineService {
    List<AirlineResponse> getAirlines();
    Optional<AirlineResponse> updateAirline(UUID airlineId, AirlineRequest airlineRequest);
    void deleteAirline(UUID airlineId);
    AirlineResponse createPrivateAirline(AirlineRequest airlineRequest, User ownerUser);
}