package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Flight.ExternalFlightDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FlightScheduledService {
    void flightSchedule();
    List<ExternalFlightDto> getFlightsScheduled();
}
