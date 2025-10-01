package com.tesis.AirVision.Repository;

import com.tesis.AirVision.Entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface FlightRepository extends JpaRepository<Flight, UUID> {}
