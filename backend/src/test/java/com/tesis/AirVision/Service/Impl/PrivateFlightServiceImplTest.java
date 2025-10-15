package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Flight.PrivateFlightDto;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PrivateFlightServiceImplTest {

    private final PrivateFlightServiceImpl privateFlightService = new PrivateFlightServiceImpl();

    @Test
    void getPrivateFlights_ShouldReturnThreeFlightsWithValidData() {
        List<PrivateFlightDto> flights = privateFlightService.getPrivateFlights();

        assertNotNull(flights, "La lista no debe ser nula");
        assertEquals(3, flights.size(), "Debe devolver exactamente 3 vuelos privados");

        PrivateFlightDto first = flights.get(0);
        assertEquals("PRV001", first.getCallsign());
        assertEquals("Córdoba", first.getOriginCountry());
        assertEquals("Mendoza", first.getDestination());
        assertEquals("Learjet 45", first.getAircraftModel());
        assertNotNull(first.getIcao24(), "El ICAO24 no debe ser nulo");
        assertNotNull(first.getLastContactTs(), "La fecha de último contacto no debe ser nula");
        assertFalse(first.getOnGround(), "El vuelo no debe estar en tierra");

        flights.forEach(f -> {
            assertNotNull(f.getLat(), "Latitud no debe ser nula");
            assertNotNull(f.getLon(), "Longitud no debe ser nula");
            assertTrue(f.getLat() >= -90 && f.getLat() <= 90, "Latitud fuera de rango");
            assertTrue(f.getLon() >= -180 && f.getLon() <= 180, "Longitud fuera de rango");
        });

        flights.forEach(f -> {
            assertNotNull(f.getVelocity(), "La velocidad no debe ser nula");
            assertNotNull(f.getBaroAltitude(), "La altitud barométrica no debe ser nula");
            assertNotNull(f.getTrueTrack(), "El rumbo verdadero no debe ser nulo");
            assertNotNull(f.getVerticalRate(), "La tasa vertical no debe ser nula");
        });
    }
}