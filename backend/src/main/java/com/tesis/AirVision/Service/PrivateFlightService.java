package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Flight.PrivateFlightDto;
import java.util.List;

public interface PrivateFlightService {
    List<PrivateFlightDto> getPrivateFlights();
}