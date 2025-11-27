package com.tesis.AirVision.Dtos.Stats;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StatsResponseDto {
    private FlightStats global;
    private FlightStats publicFlights;
    private FlightStats privateFlights;

    @Data
    @Builder
    public static class FlightStats {
        private long totalCount;
        private List<StatItem> fleetStatus;
        private List<StatItem> topCountries;
    }

    @Data
    @Builder
    public static class StatItem {
        private String name;
        private long value;
        private String color;
    }
}
