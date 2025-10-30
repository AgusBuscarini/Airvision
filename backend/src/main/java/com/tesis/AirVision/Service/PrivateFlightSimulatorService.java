package com.tesis.AirVision.Service;

import com.tesis.AirVision.Entity.Flight;
import org.springframework.stereotype.Service;

@Service
public interface PrivateFlightSimulatorService {
    void updateFlightPositions();
    void updateSingleFlight(Flight flight);
    double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2);
    double calculateBearing(double lat1, double lon1, double lat2, double lon2);
}
