package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Airline.AirlineRequest;
import com.tesis.AirVision.Dtos.Airline.AirlineResponse;
import com.tesis.AirVision.Entity.Airline;
import com.tesis.AirVision.Repository.AirlineRepository;
import com.tesis.AirVision.Service.AirlineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AirlineServiceImpl implements AirlineService {
    private final AirlineRepository airlineRepository;

    @Override
    public List<AirlineResponse> getAirlines() {
        return airlineRepository.findAll()
                .stream()
                .map(this::toAirlineResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AirlineResponse> updateAirline(UUID airlineId, AirlineRequest airlineRequest) {
       return airlineRepository.findById(airlineId).map(airline -> {
           airline.setName(airlineRequest.getName());
           airline.setIata(airlineRequest.getIata());
           airline.setIcao(airlineRequest.getIcao());
           airline.setCountryCode(airlineRequest.getCountryCode());
           airline.setActive(airlineRequest.getActive());

           Airline updatedAirline = airlineRepository.save(airline);

           return toAirlineResponseDto(updatedAirline);
       });
    }

    @Override
    public void deleteAirline(UUID airlineId) {
        airlineRepository.deleteById(airlineId);
    }

    private AirlineResponse toAirlineResponseDto(Airline airline) {
        return AirlineResponse.builder()
                .id(airline.getId())
                .name(airline.getName())
                .type(airline.getType())
                .iata(airline.getIata())
                .icao(airline.getIcao())
                .countryCode(airline.getCountryCode())
                .active(airline.getActive())
                // Maneja el caso de que ownerUser sea nulo
                .ownerId(airline.getOwnerUser() != null ? airline.getOwnerUser().getId() : null)
                .build();
    }
}
