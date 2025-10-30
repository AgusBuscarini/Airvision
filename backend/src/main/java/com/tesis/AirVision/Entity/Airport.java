package com.tesis.AirVision.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "airports")
@Data
public class Airport {

    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String iata;
    private String icao;

    @ManyToOne
    @JoinColumn(name = "country_code")
    private Countries country;

    private Double lat;
    private Double lon;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

}

