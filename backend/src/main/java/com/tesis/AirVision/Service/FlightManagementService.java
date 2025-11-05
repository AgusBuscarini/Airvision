package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Flight.CreatePrivateFlightRequest;
import com.tesis.AirVision.Dtos.Flight.PrivateFlightDto;
import com.tesis.AirVision.Entity.User;

import java.util.List;
import java.util.UUID;

public interface FlightManagementService {
    PrivateFlightDto createPrivateFlight(CreatePrivateFlightRequest request, User ownerUser);
    List<PrivateFlightDto> getPrivateFlights(User ownerUser);
    void deletePrivateFlight(UUID flightId, User ownerUser);
}