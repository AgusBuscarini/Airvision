package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.Flight.ExternalFlightDto;
import com.tesis.AirVision.Service.FlightScheduledService;
import com.tesis.AirVision.Service.OpenSkyService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = FlightController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class FlightControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OpenSkyService openSkyService;

    @MockitoBean
    private FlightScheduledService flightScheduledService;

    @Test
    void getRealTimeFlights_ShouldReturnList() throws Exception {
        ExternalFlightDto flight = ExternalFlightDto.builder()
                .icao24("abc123")
                .callsign("TEST123")
                .originCountry("Argentina")
                .lat(10.0)
                .lon(20.0)
                .build();

        when(openSkyService.getAllFlights()).thenReturn(List.of(flight));

        mockMvc.perform(get("/api/flights/realtime")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].icao24").value("abc123"))
                .andExpect(jsonPath("$[0].originCountry").value("Argentina"));
    }

    @Test
    void getFlightsLim_ShouldReturnLimitedList() throws Exception {
        ExternalFlightDto flight = ExternalFlightDto.builder()
                .icao24("xyz789")
                .callsign("LIMIT123")
                .lat(30.0)
                .lon(40.0)
                .build();

        when(openSkyService.getFlightsLimited(anyInt())).thenReturn(List.of(flight));

        mockMvc.perform(get("/api/flights/limit")
                        .param("limit", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].icao24").value("xyz789"))
                .andExpect(jsonPath("$[0].callsign").value("LIMIT123"));
    }

    @Test
    void getFlightsScheduled_ShouldReturnScheduledList() throws Exception {
        ExternalFlightDto flight = ExternalFlightDto.builder()
                .icao24("sched001")
                .callsign("SCHEDULED123")
                .originCountry("Chile")
                .build();

        when(flightScheduledService.getFlightsScheduled()).thenReturn(List.of(flight));

        mockMvc.perform(get("/api/flights/scheduled")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].icao24").value("sched001"))
                .andExpect(jsonPath("$[0].originCountry").value("Chile"));
    }
}
