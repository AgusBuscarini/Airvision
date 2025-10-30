package com.tesis.AirVision.Entity;

import com.tesis.AirVision.Enums.*;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "flights")
@Data
public class Flight {

    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "source", columnDefinition = "source_t")
    private Source source;

    private String icao24;
    private String callsign;

    @ManyToOne
    @JoinColumn(name = "airline_id")
    private Airline airline;

    @ManyToOne
    @JoinColumn(name = "origin_airport_id")
    private Airport originAirport;

    @ManyToOne
    @JoinColumn(name = "destination_airport_id")
    private Airport destinationAirport;

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
}
