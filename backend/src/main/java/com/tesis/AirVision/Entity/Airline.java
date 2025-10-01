package com.tesis.AirVision.Entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "airlines")
public class Airline {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @ManyToOne
    @JoinColumn(name = "owner_user_id")
    private User ownerUser;

    private String iata;
    private String icao;
    private String countryCode;

    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public enum Type {
        GLOBAL, PRIVATE
    }
}

