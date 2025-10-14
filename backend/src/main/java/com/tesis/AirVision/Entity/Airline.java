package com.tesis.AirVision.Entity;

import com.tesis.AirVision.Enums.*;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "airlines")
public class Airline {

    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type", columnDefinition = "airline_t")
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

}

