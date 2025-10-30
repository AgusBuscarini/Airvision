package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Flight.CreatePrivateFlightRequest;
import com.tesis.AirVision.Dtos.Flight.PrivateFlightDto;
import com.tesis.AirVision.Entity.User;

import java.util.List;

public interface FlightManagementService {
    PrivateFlightDto createPrivateFlight(CreatePrivateFlightRequest request, User ownerUser);
    List<PrivateFlightDto> getPrivateFlights(User ownerUser);
}