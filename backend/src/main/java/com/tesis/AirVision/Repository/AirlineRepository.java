package com.tesis.AirVision.Repository;

import com.tesis.AirVision.Entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AirlineRepository extends JpaRepository<Airline, UUID> {}
