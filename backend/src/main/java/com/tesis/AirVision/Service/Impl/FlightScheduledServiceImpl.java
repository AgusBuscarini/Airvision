package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Flight.ExternalFlightDto;
import com.tesis.AirVision.Service.FlightScheduledService;
import com.tesis.AirVision.Service.OpenSkyService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightScheduledServiceImpl implements FlightScheduledService {
    private final OpenSkyService openSkyService;

    private List<ExternalFlightDto> flightScheduled = new ArrayList<>();

    @Override
    @Scheduled(fixedRate = 30000)
    public void flightSchedule() {
        flightScheduled = openSkyService.getFlightsLimited(300);
    }

    @Override
    public List<ExternalFlightDto> getFlightsScheduled() {
        return flightScheduled;
    }
}
