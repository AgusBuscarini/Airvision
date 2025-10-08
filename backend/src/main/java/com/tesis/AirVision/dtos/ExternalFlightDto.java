package com.tesis.AirVision.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExternalFlightDto {
    private String icao24;
    private String callsign;
    private String originCountry;
    private Double lon;
    private Double lat;
    private Double baroAltitude;
    private Double velocity;
    private Double trueTrack;
    private Double verticalRate;
    private Boolean onGround;
    private OffsetDateTime lastContactTs;
}
