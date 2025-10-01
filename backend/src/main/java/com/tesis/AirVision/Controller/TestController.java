package com.tesis.AirVision.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/health")
    public String health() {
        return "✅ AirVision backend is running!";
    }
}
