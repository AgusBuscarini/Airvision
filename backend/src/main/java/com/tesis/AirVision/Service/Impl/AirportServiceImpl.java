package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Entity.Airport;
import com.tesis.AirVision.Repository.AirportRepository;
import com.tesis.AirVision.Service.AirportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AirportServiceImpl implements AirportService {
    private final AirportRepository airportRepository;

    @Override
    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }
}
