package com.tesis.AirVision.Service.Impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.tesis.AirVision.Service.OpenSkyService;
import com.tesis.AirVision.Dtos.ExternalFlightDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OpenSkyServiceImpl implements OpenSkyService {
    public final WebClient webClient;

    public OpenSkyServiceImpl() {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(16 * 1024 * 1024)) // 16 MB
                .build();

        this.webClient = WebClient.builder()
                .baseUrl("https://opensky-network.org/api")
                .exchangeStrategies(strategies)
                .defaultHeader("User-Agent", "AirVision/1.0")
                .build();
    }

    @Override
    public List<ExternalFlightDto> getAllFlights() {
        JsonNode response = webClient.get()
                .uri("/states/all")
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        List<ExternalFlightDto> flights = new ArrayList<>();

        if (response != null && response.has("states")) {
            for (JsonNode state : response.get("states")) {
                flights.add(parseState(state));
            }
        }

        return flights;
    }

    @Override
    public List<ExternalFlightDto> getFlightsLimited(int limit) {
        List<ExternalFlightDto> allFlights = getAllFlights();
        return allFlights.stream()
                .filter(f -> f.getLat() != null && f.getLon() != null)
                .limit(limit)
                .toList();
    }

    private ExternalFlightDto parseState(JsonNode node) {
        return ExternalFlightDto.builder()
                .icao24(getText(node, 0))
                .callsign(getText(node, 1))
                .originCountry(getText(node, 2))
                .lon(getDouble(node, 5))
                .lat(getDouble(node, 6))
                .baroAltitude(getDouble(node, 7))
                .onGround(getBoolean(node, 8))
                .velocity(getDouble(node, 9))
                .trueTrack(getDouble(node, 10))
                .verticalRate(getDouble(node, 11))
                .lastContactTs(OffsetDateTime.now())
                .build();
    }

    private String getText(JsonNode node, int index) {
        return node.get(index).isNull() ? null : node.get(index).asText();
    }

    private Double getDouble(JsonNode node, int index) {
        return node.get(index).isNull() ? null : node.get(index).asDouble();
    }

    private Boolean getBoolean(JsonNode node, int index) {
        return !node.get(index).isNull() && node.get(index).asBoolean();
    }
}
