package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Flight.CreatePrivateFlightRequest;
import com.tesis.AirVision.Dtos.Flight.PrivateFlightDto;
import com.tesis.AirVision.Entity.Airline;
import com.tesis.AirVision.Entity.Flight;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Enums.Source;
import com.tesis.AirVision.Repository.AirlineRepository;
import com.tesis.AirVision.Repository.FlightRepository;
import com.tesis.AirVision.Service.FlightManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlightManagementServiceImpl implements FlightManagementService {

    private final FlightRepository flightRepository;
    private final AirlineRepository airlineRepository;

    @Override
    public PrivateFlightDto createPrivateFlight(CreatePrivateFlightRequest request, User ownerUser) {

        Optional<Airline> optionalAirline = airlineRepository.findById(request.getAirlineId());

        if (optionalAirline.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aerolínea no encontrada.");
        }

        Airline airline = optionalAirline.get();

        if (airline.getOwnerUser() == null || !airline.getOwnerUser().getId().equals(ownerUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para crear vuelos para esta aerolínea.");
        }

        Flight newFlight = new Flight();
        newFlight.setSource(Source.SIMULATED);
        newFlight.setOwnerUser(ownerUser);
        newFlight.setAirline(airline);
        newFlight.setCallsign(request.getCallsign());

        newFlight.setIcao24(request.getIcao24() != null ? request.getIcao24() : UUID.randomUUID().toString().substring(0, 6));
        newFlight.setLat(request.getLat() != null ? request.getLat() : -31.4);
        newFlight.setLon(request.getLon() != null ? request.getLon() : -64.2);
        newFlight.setBaroAltitude(request.getBaroAltitude() != null ? request.getBaroAltitude() : 10000.0);
        newFlight.setVelocity(request.getVelocity() != null ? request.getVelocity() : 700.0);
        newFlight.setTrueTrack(request.getTrueTrack() != null ? request.getTrueTrack() : 90.0);
        newFlight.setVerticalRate(request.getVerticalRate() != null ? request.getVerticalRate() : 0.0);
        newFlight.setOnGround(request.getOnGround() != null ? request.getOnGround() : false);
        newFlight.setLastContactTs(OffsetDateTime.now());
        newFlight.setUpdatedAt(OffsetDateTime.now());

        Flight savedFlight = flightRepository.save(newFlight);

        return PrivateFlightDto.builder()
                .icao24(savedFlight.getId())
                .callsign(savedFlight.getCallsign())
                .originCountry("Mock Origin") // Temporal
                .destination("Mock Destination") // Temporal
                .aircraftModel("Mock Aircraft") // Temporal
                .lat(savedFlight.getLat())
                .lon(savedFlight.getLon())
                .baroAltitude(savedFlight.getBaroAltitude())
                .velocity(savedFlight.getVelocity())
                .trueTrack(savedFlight.getTrueTrack())
                .verticalRate(savedFlight.getVerticalRate())
                .onGround(savedFlight.getOnGround())
                .lastContactTs(savedFlight.getLastContactTs())
                .build();
    }
}