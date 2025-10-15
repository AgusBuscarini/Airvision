package com.tesis.AirVision.Dtos.Flight;

import java.time.OffsetDateTime;
import java.util.UUID;

public class PrivateFlightDto {
    private UUID id;
    private String callsign;
    private String origin;
    private String destination;
    private String aircraftModel;
    private Double latitude;
    private Double longitude;
    private Double altitude;
    private Double velocity;
    private OffsetDateTime timestamp;

    public PrivateFlightDto(UUID id, String callsign, String origin, String destination,
                            String aircraftModel, Double latitude, Double longitude,
                            Double altitude, Double velocity, OffsetDateTime timestamp) {
        this.id = id;
        this.callsign = callsign;
        this.origin = origin;
        this.destination = destination;
        this.aircraftModel = aircraftModel;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.velocity = velocity;
        this.timestamp = timestamp;
    }

    public UUID getId() { return id; }
    public String getCallsign() { return callsign; }
    public String getOrigin() { return origin; }
    public String getDestination() { return destination; }
    public String getAircraftModel() { return aircraftModel; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Double getAltitude() { return altitude; }
    public Double getVelocity() { return velocity; }
    public OffsetDateTime getTimestamp() { return timestamp; }
}
