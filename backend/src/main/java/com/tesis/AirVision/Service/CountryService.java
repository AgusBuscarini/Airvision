package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Country.CountriesDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CountryService {
    List<CountriesDto> getAllCountries();
}
