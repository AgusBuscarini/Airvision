package com.tesis.AirVision;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Requiere Postgres y variables de entorno; se verifica con docker compose")
class AirVisionApplicationTests {

	@Test
	void contextLoads() {
	}

}
