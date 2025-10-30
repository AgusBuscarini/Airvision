package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Country.CountriesDto;
import com.tesis.AirVision.Entity.Countries;
import com.tesis.AirVision.Repository.CountryRepository;
import com.tesis.AirVision.Service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryServiceImpl implements CountryService {
    private final CountryRepository countryRepository;

    @Override
    public List<CountriesDto> getAllCountries() {
        List<Countries>  countries = countryRepository.findAll();

        return countries.stream()
                .map(c -> new CountriesDto(c.getCode(), c.getName()))
                .toList();
    }
}
