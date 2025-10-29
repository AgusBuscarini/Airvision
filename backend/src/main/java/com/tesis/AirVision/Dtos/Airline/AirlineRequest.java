package com.tesis.AirVision.Dtos.Airline;

import lombok.Data;

@Data
public class AirlineRequest {
    private String name;
    private String iata;
    private String icao;
    private String countryCode;
    private Boolean active;
}
