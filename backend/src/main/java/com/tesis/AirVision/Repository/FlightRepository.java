package com.tesis.AirVision.Repository;

import com.tesis.AirVision.Entity.Flight;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Enums.Source;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FlightRepository extends JpaRepository<Flight, UUID> {
    List<Flight> findByOwnerUserAndSource(User ownerUser, Source source);
    List<Flight> findBySource(Source source);
}
