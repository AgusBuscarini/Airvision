package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Flight.PrivateFlightDto;
import com.tesis.AirVision.Service.PrivateFlightService;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class PrivateFlightServiceImpl implements PrivateFlightService {

    @Override
    public List<PrivateFlightDto> getPrivateFlights() {
        return Arrays.asList(
                new PrivateFlightDto(UUID.randomUUID(), "PRV001", "Córdoba", "Mendoza",
                        "Learjet 45", -31.4, -64.2, 10500.0, 720.0, OffsetDateTime.now()),

                new PrivateFlightDto(UUID.randomUUID(), "PRV002", "Buenos Aires", "Santiago de Chile",
                        "Cessna Citation X", -34.6, -58.4, 11000.0, 800.0, OffsetDateTime.now()),

                new PrivateFlightDto(UUID.randomUUID(), "PRV003", "Rosario", "Asunción",
                        "Gulfstream G650", -32.9, -60.7, 12000.0, 850.0, OffsetDateTime.now())
        );
    }
}
