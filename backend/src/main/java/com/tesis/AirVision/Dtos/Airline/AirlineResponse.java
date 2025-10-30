package com.tesis.AirVision.Dtos.Airline;

import com.tesis.AirVision.Entity.Countries;
import com.tesis.AirVision.Enums.Type;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AirlineResponse {
    private UUID id;
    private String name;
    private Type type;
    private String iata;
    private String icao;
    private Countries country;
    private Boolean active;

    private UUID ownerId;
}
