package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Flight.ExternalFlightDto;
import com.tesis.AirVision.Service.FlightScheduledService;
import com.tesis.AirVision.Service.OpenSkyService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightScheduledServiceImpl implements FlightScheduledService {
    private final OpenSkyService openSkyService;

    private volatile List<ExternalFlightDto> allFlights = List.of();

    @Override
    @Scheduled(fixedRate = 30000)
    public void flightSchedule() {
        allFlights = List.copyOf(openSkyService.getAllFlights());
    }

    @Override
    public List<ExternalFlightDto> getAllCachedFlights() {
        return allFlights;
    }

    @Override
    public List<ExternalFlightDto> getCachedFlightsLimited(int limit) {
        return allFlights.stream()
                .filter(f -> f.getLat() != null && f.getLon() != null)
                .limit(Math.max(limit, 0))
                .toList();
    }

    @Override
    public List<ExternalFlightDto> getFlightsScheduled() {
        return getCachedFlightsLimited(300);
    }
}
