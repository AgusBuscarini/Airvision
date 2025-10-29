package com.tesis.AirVision.Repository;

import com.tesis.AirVision.Entity.Airline;
import com.tesis.AirVision.Enums.Type; // Importar Type
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Importar Optional
import java.util.UUID;

public interface AirlineRepository extends JpaRepository<Airline, UUID> {
    Optional<Airline> findByNameIgnoreCaseAndType(String name, Type type);
}