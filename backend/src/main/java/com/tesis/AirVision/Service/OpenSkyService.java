package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Flight.ExternalFlightDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OpenSkyService {
    List<ExternalFlightDto> getAllFlights();
    List<ExternalFlightDto> getFlightsLimited(int limit);
}
