package com.tesis.AirVision.Entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Source source;

    private String icao24;
    private String callsign;

    @ManyToOne
    @JoinColumn(name = "airline_id")
    private Airline airline;

    private String originCountry;

    private Double lat;
    private Double lon;
    private Double baroAltitude;
    private Double velocity;
    private Double trueTrack;
    private Double verticalRate;
    private Boolean onGround;

    @Column(name = "last_contact_ts")
    private OffsetDateTime lastContactTs;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @ManyToOne
    @JoinColumn(name = "owner_user_id")
    private User ownerUser;

    public enum Source {
        API, SIMULATED
    }
}
