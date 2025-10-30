package com.tesis.AirVision.Repository;

import com.tesis.AirVision.Entity.Countries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CountryRepository extends JpaRepository<Countries, String> {
}
