package com.tesis.AirVision.Dtos.Flight;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class CreatePrivateFlightRequest {
    private String callsign;
    private UUID airlineId;
    private UUID originAirportId;
    private UUID destinationAirportId;
    private String icao24;
}