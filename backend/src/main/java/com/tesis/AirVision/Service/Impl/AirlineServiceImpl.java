package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Airline.AirlineRequest;
import com.tesis.AirVision.Dtos.Airline.AirlineResponse;
import com.tesis.AirVision.Entity.Airline;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Enums.Type;
import com.tesis.AirVision.Repository.AirlineRepository;
import com.tesis.AirVision.Service.AirlineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
           airline.setCountry(airlineRequest.getCountry());
           airline.setActive(airlineRequest.getActive());

           Airline updatedAirline = airlineRepository.save(airline);

           return toAirlineResponseDto(updatedAirline);
       });
    }

    @Override
    public void deleteAirline(UUID airlineId) {
        airlineRepository.deleteById(airlineId);
    }

    // SCRUM-71 & SCRUM-72: Implementación de la lógica de creación.
    @Override
    public AirlineResponse createPrivateAirline(AirlineRequest request, User ownerUser) {

        if (airlineRepository.findByNameIgnoreCaseAndType(request.getName(), Type.PRIVATE).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe una aerolínea privada con el nombre: " + request.getName());
        }

        Airline newAirline = new Airline();
        newAirline.setName(request.getName());
        newAirline.setIata(request.getIata());
        newAirline.setIcao(request.getIcao());
        newAirline.setCountry(request.getCountry());
        newAirline.setActive(true);
        newAirline.setType(Type.PRIVATE);
        newAirline.setOwnerUser(ownerUser);

        Airline savedAirline = airlineRepository.save(newAirline);

        return toAirlineResponseDto(savedAirline);
    }

    @Override
    public List<AirlineResponse> getMyPrivateAirlines(User ownerUser) {
        return airlineRepository.findByOwnerUserAndType(ownerUser, Type.PRIVATE)
                .stream()
                .map(this::toAirlineResponseDto)
                .collect(Collectors.toList());
    }

    private AirlineResponse toAirlineResponseDto(Airline airline) {
        return AirlineResponse.builder()
                .id(airline.getId())
                .name(airline.getName())
                .type(airline.getType())
                .iata(airline.getIata())
                .icao(airline.getIcao())
                .country(airline.getCountry())
                .active(airline.getActive())
                .ownerId(airline.getOwnerUser() != null ? airline.getOwnerUser().getId() : null)
                .build();
    }
}
