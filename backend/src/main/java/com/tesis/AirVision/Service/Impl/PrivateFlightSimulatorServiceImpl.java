package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Entity.Airport;
import com.tesis.AirVision.Entity.Flight;
import com.tesis.AirVision.Enums.Source;
import com.tesis.AirVision.Repository.FlightRepository;
import com.tesis.AirVision.Service.PrivateFlightSimulatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrivateFlightSimulatorServiceImpl implements PrivateFlightSimulatorService {
    private final FlightRepository flightRepository;

    private static final double FLIGHT_SPEED_KMPH = 800.0;
    private static final double SIMULATION_INTERVAL_MS = 5000.0;
    private static final double SIMULATION_INTERVAL_HOURS = SIMULATION_INTERVAL_MS / (1000.0 * 60.0 * 60.0);
    private static final double DISTANCE_PER_INTERVAL_KM = FLIGHT_SPEED_KMPH * SIMULATION_INTERVAL_HOURS;
    private static final double ARRIVAL_THRESHOLD_KM = DISTANCE_PER_INTERVAL_KM * 2;

    @Scheduled(fixedRate = 30000)
    @Override
    public void updateFlightPositions() {
        List<Flight> simulatedFlights = flightRepository.findBySource(Source.SIMULATED)
                .stream()
                .filter(f ->  f.getDestinationAirport() != null && f.getOriginAirport() != null)
                .toList();

        for (Flight flight : simulatedFlights) {
            updateSingleFlight(flight);
        }
    }

    @Override
    public void updateSingleFlight(Flight flight) {
        Airport destination = flight.getDestinationAirport();

        double currentLat = flight.getLat();
        double currentLon = flight.getLon();
        double destLat = destination.getLat();
        double destLon = destination.getLon();

        double remainingDistance = calculateHaversineDistance(currentLat, currentLon, destLat, destLon);

        if (remainingDistance < ARRIVAL_THRESHOLD_KM) {
            if (flight.getOnGround()) return;

            flight.setLat(destLat);
            flight.setLon(destLon);
            flight.setOnGround(true);
            flight.setVelocity(0.0);
            flight.setVerticalRate(0.0);
        } else {
            if (flight.getOnGround()) {
                flight.setOnGround(false);
            }

            double totalDistance = calculateHaversineDistance(
                    flight.getOriginAirport().getLat(), flight.getOriginAirport().getLon(),
                    destLat, destLon
            );

            if (totalDistance == 0) return;

            double fractionToMove = DISTANCE_PER_INTERVAL_KM / remainingDistance;

            double nextLat = currentLat + (destLat - currentLat) * fractionToMove;
            double nextLon = currentLon + (destLon - currentLon) * fractionToMove;

            double bearing = calculateBearing(currentLat, currentLon, nextLat, nextLon);

            flight.setLat(nextLat);
            flight.setLon(nextLon);
            flight.setVelocity(FLIGHT_SPEED_KMPH / 3.6);
            flight.setTrueTrack(bearing);
            flight.setUpdatedAt(OffsetDateTime.now());
            flight.setLastContactTs(OffsetDateTime.now());

            if (flight.getBaroAltitude() < 10000) {
                flight.setBaroAltitude(Math.min(10000.0, flight.getBaroAltitude() + 500));
                flight.setVerticalRate(10.0);
            } else {
                flight.setVerticalRate(0.0);
            }
        }

        flightRepository.save(flight);
    }

    @Override
    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    @Override
    public double calculateBearing(double lat1, double lon1, double lat2, double lon2) {
        double dLon = Math.toRadians(lon2 - lon1);
        double y = Math.sin(dLon) * Math.cos(Math.toRadians(lat2));
        double x = Math.cos(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) -
                Math.sin(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(dLon);
        double brng = Math.toDegrees(Math.atan2(y, x));
        return (brng + 360) % 360;
    }
}
