package com.tesis.AirVision.Dtos.Airline;

import com.tesis.AirVision.Entity.Countries;
import lombok.Data;

@Data
public class AirlineRequest {
    private String name;
    private String iata;
    private String icao;
    private Countries country;
    private Boolean active;
}
