package com.tesis.AirVision.Service.Impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tesis.AirVision.Dtos.Flight.ExternalFlightDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OpenSkyServiceImplTest {
    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @Spy
    @InjectMocks
    private OpenSkyServiceImpl openSkyService;

    @Test
    void getAllFlights_ReturnsAllFlightsWhenResponseIsOk() throws Exception {
        String jsonResponse = """
                    {
                      "states": [
                        ["abc123", "ARG123", "ARG", null, null, 10.0, 20.0, 1000.0, false, 250.0, 180.0, 0.0],
                        ["def456", "DAL456", "USA", null, null, 15.0, 25.0, 1200.0, false, 240.0, 190.0, -2.0]
                      ]
                    }
                    """;

        JsonNode mockNode = new ObjectMapper().readTree(jsonResponse);

        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/states/all")).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(JsonNode.class)).thenReturn(Mono.just(mockNode));

        List<ExternalFlightDto> result = openSkyService.getAllFlights();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("ARG123", result.get(0).getCallsign());
    }

    @Test
    void getAllFlights_ShouldReturnEmptyListWhenResponseIsNull(){
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/states/all")).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(JsonNode.class)).thenReturn(Mono.justOrEmpty(null));

        List<ExternalFlightDto> result = openSkyService.getAllFlights();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getFlightsLimited_ShouldReturnLimitedNumberOfFlightsWhenResponseIsOk() throws Exception {
        String jsonResponse = """
            {
              "states": [
                ["abc123", "ARG123", "ARG", 1609459200, 10.5, 20.3, 10000.0, false, 250.0, 45.0, 0.0, null, null, "ARG123", false, 0],
                ["def456", "DAL456", "USA", 1609459200, 15.7, 25.8, 12000.0, false, 300.0, 90.0, 0.0, null, null, "DAL456", false, 0],
                ["ghi789", "UAL789", "ENG", 1609459200, null, null, 15000.0, false, 280.0, 180.0, 0.0, null, null, "UAL789", false, 0],
                ["jkl012", "SWA012", "USA", 1609459200, 30.2, 40.1, 8000.0, false, 220.0, 270.0, 0.0, null, null, "SWA012", false, 0],
                ["mno345", "JBU345", "PAR", 1609459200, 35.9, 45.6, 20000.0, false, 290.0, 135.0, 0.0, null, null, "JBU345", false, 0]
              ]
            }
            """;

        JsonNode mockNode = new ObjectMapper().readTree(jsonResponse);

        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(JsonNode.class)).thenReturn(Mono.just(mockNode));

        List<ExternalFlightDto> result = openSkyService.getFlightsLimited(3);

        assertNotNull(result);
        assertEquals(3, result.size());

        result.forEach(
                flight-> {
                    assertNotNull(flight.getLat());
                    assertNotNull(flight.getLon());
                }
        );

        assertEquals("ARG123", result.get(0).getCallsign());
        assertEquals("DAL456", result.get(1).getCallsign());
        assertEquals("SWA012", result.get(2).getCallsign());
    }

    @Test
    void getFlightsLimited_ShouldReturnEmptyListWhenNoValidCoordenates() throws Exception {
        String jsonResponse = """
            {
              "states": [
                ["abc123", "AAL123", "USA", 1609459200, null, null, 10000.0, false, 250.0, 45.0, 0.0, null, null, "AAL123", false, 0],
                ["def456", "DAL456", "USA", 1609459200, null, null, 12000.0, false, 300.0, 90.0, 0.0, null, null, "DAL456", false, 0]
              ]
            }
            """;

        JsonNode mockNode = new ObjectMapper().readTree(jsonResponse);

        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(JsonNode.class)).thenReturn(Mono.just(mockNode));

        List<ExternalFlightDto> result = openSkyService.getFlightsLimited(5);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getFlightsLimited_ShouldReturnFewerFlightsWhenNotEnoughValidFlights() throws Exception {
        String jsonResponse = """
            {
              "states": [
                ["abc123", "ARG123", "ARG", 1609459200, 10.5, 20.3, 10000.0, false, 250.0, 45.0, 0.0, null, null, "ARG123", false, 0],
                ["def456", "DAL456", "USA", 1609459200, null, null, 12000.0, false, 300.0, 90.0, 0.0, null, null, "DAL456", false, 0],
                ["ghi789", "UAL789", "ENG", 1609459200, 15.7, 25.8, 15000.0, false, 280.0, 180.0, 0.0, null, null, "UAL789", false, 0]
              ]
            }
            """;

        JsonNode mockNode = new ObjectMapper().readTree(jsonResponse);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(JsonNode.class)).thenReturn(Mono.just(mockNode));

        List<ExternalFlightDto> result = openSkyService.getFlightsLimited(5);

        assertNotNull(result);
        assertEquals(2, result.size()); // 2 vuelos con coordenadas validas
        assertEquals("ARG123", result.get(0).getCallsign());
        assertEquals("UAL789", result.get(1).getCallsign());
    }
}