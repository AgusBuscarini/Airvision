package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Flight.CreatePrivateFlightRequest;
import com.tesis.AirVision.Dtos.Flight.PrivateFlightDto;
import com.tesis.AirVision.Entity.Airline;
import com.tesis.AirVision.Entity.Airport;
import com.tesis.AirVision.Entity.Flight;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Enums.Role;
import com.tesis.AirVision.Enums.Source;
import com.tesis.AirVision.Repository.AirlineRepository;
import com.tesis.AirVision.Repository.AirportRepository;
import com.tesis.AirVision.Repository.FlightRepository;
import com.tesis.AirVision.Service.FlightManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlightManagementServiceImpl implements FlightManagementService {

    private final FlightRepository flightRepository;
    private final AirlineRepository airlineRepository;
    private final AirportRepository airportRepository;

    @Override
    @Transactional
    public PrivateFlightDto createPrivateFlight(CreatePrivateFlightRequest request, User ownerUser) {

        Airline airline = airlineRepository.findById(request.getAirlineId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aerolínea no encontrada."));

        if (ownerUser.getRole() != Role.ADMIN &&
                (airline.getOwnerUser() == null || !airline.getOwnerUser().getId().equals(ownerUser.getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para crear vuelos para esta aerolínea.");
        }

        Airport origin = airportRepository.findById(request.getOriginAirportId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aeropuerto de origen no encontrado."));

        Airport destination = airportRepository.findById(request.getDestinationAirportId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aeropuerto de destino no encontrado."));

        if (origin.getId().equals(destination.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El origen y el destino no pueden ser el mismo.");
        }

        Flight newFlight = new Flight();
        newFlight.setSource(Source.SIMULATED);
        newFlight.setOwnerUser(ownerUser);
        newFlight.setAirline(airline);
        newFlight.setCallsign(request.getCallsign());

        newFlight.setOriginAirport(origin);
        newFlight.setDestinationAirport(destination);
        newFlight.setLat(origin.getLat());
        newFlight.setLon(origin.getLon());
        newFlight.setOnGround(true);
        newFlight.setBaroAltitude(0.0);

        newFlight.setIcao24(request.getIcao24() != null ? request.getIcao24() : UUID.randomUUID().toString().substring(0, 6));
        newFlight.setVelocity(0.0);
        newFlight.setTrueTrack(0.0);
        newFlight.setVerticalRate(0.0);
        newFlight.setLastContactTs(OffsetDateTime.now());
        newFlight.setUpdatedAt(OffsetDateTime.now());

        Flight savedFlight = flightRepository.save(newFlight);

        return PrivateFlightDto.builder()
                .icao24(savedFlight.getId())
                .callsign(savedFlight.getCallsign())
                .originCountry(savedFlight.getOriginAirport().getName())
                .destination(savedFlight.getDestinationAirport().getName())
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

    @Override
    public List<PrivateFlightDto> getPrivateFlights(User ownerUser) {
        List<Flight> flights = flightRepository.findByOwnerUserAndSource(ownerUser, Source.SIMULATED);

        return flights.stream()
                .map(flight -> PrivateFlightDto.builder()
                        .icao24(flight.getId())
                        .callsign(flight.getCallsign())
                        .originCountry(flight.getOriginAirport().getName())
                        .destination(flight.getDestinationAirport().getName())
                        .lat(flight.getLat())
                        .lon(flight.getLon())
                        .baroAltitude(flight.getBaroAltitude())
                        .velocity(flight.getVelocity())
                        .trueTrack(flight.getTrueTrack())
                        .verticalRate(flight.getVerticalRate())
                        .onGround(flight.getOnGround())
                        .lastContactTs(flight.getLastContactTs())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public void deletePrivateFlight(UUID flightId, User ownerUser) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vuelo no encontrado"));

        if (ownerUser.getRole() != Role.ADMIN &&
                (flight.getOwnerUser() == null || !flight.getOwnerUser().getId().equals(ownerUser.getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para eliminar este vuelo.");
        }

        flightRepository.delete(flight);
    }
}