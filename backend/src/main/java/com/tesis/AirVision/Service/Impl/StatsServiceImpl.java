package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Flight.ExternalFlightDto;
import com.tesis.AirVision.Dtos.Stats.StatsResponseDto;
import com.tesis.AirVision.Entity.Flight;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Enums.Source;
import com.tesis.AirVision.Repository.FlightRepository;
import com.tesis.AirVision.Service.FlightScheduledService;
import com.tesis.AirVision.Service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {
    private final FlightScheduledService flightScheduledService;
    private final FlightRepository flightRepository;

    @Override
    public StatsResponseDto getDashboardStats(User user) {
        return generateStats(user, true);
    }

    @Override
    public StatsResponseDto getFullStats(User user) {
        return generateStats(user, false);
    }

    private StatsResponseDto generateStats(User user, boolean applyLimit) {
        List<ExternalFlightDto> externalFlights = flightScheduledService.getFlightsScheduled();

        OffsetDateTime activeThreshold = OffsetDateTime.now().minusMinutes(2);
        List<Flight> privateFlightsEntities = flightRepository.findBySource(Source.SIMULATED).stream()
                .filter(f -> f.getUpdatedAt().isAfter(activeThreshold))
                .toList();

        List<Flight> myPrivateEntities = new ArrayList<>();
        if (user != null) {
            myPrivateEntities = privateFlightsEntities.stream()
                    .filter(f -> f.getOwnerUser() != null && f.getOwnerUser().getId().equals(user.getId()))
                    .toList();
        }

        List<FlightStatData> publicData = externalFlights.stream()
                .map(f -> new FlightStatData(f.getOriginCountry(), f.getOnGround()))
                .toList();

        List<FlightStatData> privateData = privateFlightsEntities.stream()
                .map(f -> new FlightStatData(
                        (f.getOriginAirport() != null && f.getOriginAirport().getCountry() != null)
                                ? f.getOriginAirport().getCountry().getName()
                                : "Privado",
                        f.getOnGround()
                ))
                .toList();

        List<FlightStatData> myData = myPrivateEntities.stream()
                .map(f -> new FlightStatData(
                        (f.getOriginAirport() != null && f.getOriginAirport().getCountry() != null)
                                ? f.getOriginAirport().getCountry().getName()
                                : "Privado",
                        f.getOnGround()
                ))
                .toList();

        List<FlightStatData> globalData = Stream.concat(publicData.stream(), privateData.stream()).toList();

        return StatsResponseDto.builder()
                .global(calculateStats(globalData, applyLimit))
                .publicFlights(calculateStats(publicData, applyLimit))
                .privateFlights(calculateStats(privateData, applyLimit))
                .myFlights(calculateStats(myData, applyLimit))
                .build();
    }

    private record FlightStatData(String country, Boolean onGround) {}

    private StatsResponseDto.FlightStats calculateStats(List<FlightStatData> flights, boolean applyLimit) {
        long total = flights.size();

        long onGround = flights.stream().filter(f -> Boolean.TRUE.equals(f.onGround())).count();
        long inAir = total - onGround;

        long safeTotal = total > 0 ? total : 1;
        long percentInAir = Math.round((double) inAir / safeTotal * 100);
        long percentOnGround = 100 - percentInAir;

        List<StatsResponseDto.StatItem> fleetStatus = List.of(
                StatsResponseDto.StatItem.builder().name("En Aire").value(percentInAir).color("#10b981").build(),
                StatsResponseDto.StatItem.builder().name("En Tierra").value(percentOnGround).color("#f59e0b").build()
        );

        Map<String, Long> countryCounts = new HashMap<>();
        flights.forEach(f -> {
            String c = f.country() != null ? f.country() : "N/A";
            countryCounts.merge(c, 1L, Long::sum);
        });

        Stream<Map.Entry<String, Long>> stream = countryCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed());

        if (applyLimit) {
            stream = stream.limit(5);
        }

        List<StatsResponseDto.StatItem> topCountries = stream
                .map(e -> StatsResponseDto.StatItem.builder()
                        .name(e.getKey())
                        .value(e.getValue())
                        .build())
                .collect(Collectors.toList());

        return StatsResponseDto.FlightStats.builder()
                .totalCount(total)
                .fleetStatus(fleetStatus)
                .topCountries(topCountries)
                .build();
    }
}
