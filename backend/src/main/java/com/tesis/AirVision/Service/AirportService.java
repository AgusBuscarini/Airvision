package com.tesis.AirVision.Service;

import com.tesis.AirVision.Entity.Airport;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AirportService {
    List<Airport> getAllAirports();
}
