package com.tesis.AirVision.Dtos.Flight;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrivateFlightDto {
    private UUID icao24;
    private String callsign;
    private String originCountry;
    private Double lat;
    private Double lon;
    private Double baroAltitude;
    private Double velocity;
    private Double trueTrack;
    private Double verticalRate;
    private Boolean onGround;
    private OffsetDateTime lastContactTs;
    private String destination;
}
