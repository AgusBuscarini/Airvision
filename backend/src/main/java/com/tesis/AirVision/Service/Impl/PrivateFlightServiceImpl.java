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
                PrivateFlightDto.builder()
                        .icao24(UUID.randomUUID())
                        .callsign("PRV001")
                        .originCountry("Córdoba")
                        .destination("Mendoza")
                        .aircraftModel("Learjet 45")
                        .lat(-31.4)
                        .lon(-64.2)
                        .baroAltitude(10500.0)
                        .velocity(720.0)
                        .trueTrack(275.0)
                        .verticalRate(0.0)
                        .onGround(false)
                        .lastContactTs(OffsetDateTime.now())
                        .build(),

                PrivateFlightDto.builder()
                        .icao24(UUID.randomUUID())
                        .callsign("PRV002")
                        .originCountry("Buenos Aires")
                        .destination("Santiago de Chile")
                        .aircraftModel("Cessna Citation X")
                        .lat(-34.6)
                        .lon(-58.4)
                        .baroAltitude(11000.0)
                        .velocity(800.0)
                        .trueTrack(260.0)
                        .verticalRate(-1.5)
                        .onGround(false)
                        .lastContactTs(OffsetDateTime.now())
                        .build(),

                PrivateFlightDto.builder()
                        .icao24(UUID.randomUUID())
                        .callsign("PRV003")
                        .originCountry("Rosario")
                        .destination("Asunción")
                        .aircraftModel("Gulfstream G650")
                        .lat(-32.9)
                        .lon(-60.7)
                        .baroAltitude(12000.0)
                        .velocity(850.0)
                        .trueTrack(310.0)
                        .verticalRate(0.5)
                        .onGround(false)
                        .lastContactTs(OffsetDateTime.now())
                        .build()
        );
    }
}
