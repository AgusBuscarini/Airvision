package com.tesis.AirVision;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AirVisionApplication {

	public static void main(String[] args) {
		SpringApplication.run(AirVisionApplication.class, args);
	}

}
