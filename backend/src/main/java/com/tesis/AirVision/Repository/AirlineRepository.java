package com.tesis.AirVision.Repository;

import com.tesis.AirVision.Entity.Airline;
import com.tesis.AirVision.Enums.Type;
import com.tesis.AirVision.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface AirlineRepository extends JpaRepository<Airline, UUID> {
    Optional<Airline> findByNameIgnoreCaseAndType(String name, Type type);
    List<Airline> findByOwnerUserAndType(User ownerUser, Type type);
}