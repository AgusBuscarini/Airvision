package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.Country.CountriesDto;
import com.tesis.AirVision.Service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {
    private final CountryService countryService;

    @GetMapping
    public ResponseEntity<List<CountriesDto>> getAllCountries() {
        return ResponseEntity.ok(countryService.getAllCountries());
    }
}
