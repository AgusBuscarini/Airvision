package com.tesis.AirVision.Dtos.Flight;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class CreatePrivateFlightRequest {

    @NotBlank(message = "El indicativo del vuelo (callsign) es obligatorio")
    private String callsign;

    @NotNull(message = "La aerolínea es obligatoria")
    private UUID airlineId;

    private String icao24;
    private Double lat;
    private Double lon;
    private Double baroAltitude;
    private Double velocity;
    private Double trueTrack;
    private Double verticalRate;
    private Boolean onGround;
}