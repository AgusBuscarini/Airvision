package com.tesis.AirVision.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "countries")
@Data
public class Countries {

    @Id
    @Column(length = 2, nullable = false, unique = true)
    private String code;

    @Column(nullable = false, unique = true)
    private String name;
}
