package com.tesis.AirVision.Config;

import com.mercadopago.MercadoPagoConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class MercadoPagoConfigBean {

    @Value("${mercadopago.access-token}")
    private String mpAccessToken;

    @PostConstruct
    public void init() {
        if (mpAccessToken == null || mpAccessToken.isBlank()) {
            System.err.println("MP_ACCESS_TOKEN no encontrado o vacío. Revisar .env y docker-compose.yml");
            throw new IllegalStateException("MP_ACCESS_TOKEN no configurado");
        }
        com.mercadopago.MercadoPagoConfig.setAccessToken(mpAccessToken);
    }

}
