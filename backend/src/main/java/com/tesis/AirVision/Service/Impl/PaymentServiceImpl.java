package com.tesis.AirVision.Service.Impl;

import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import com.tesis.AirVision.Dtos.Payments.CreatePreferenceRequest;
import com.tesis.AirVision.Dtos.Payments.CreatePreferenceResponse;
import com.tesis.AirVision.Service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${frontend.success-url}")
    private String successUrl;

    @Value("${frontend.failure-url}")
    private String failureUrl;

    @Value("${frontend.pending-url}")
    private String pendingUrl;

    @Value("${backend.webhook-url}")
    private String webhookUrl;

    @Override
    public CreatePreferenceResponse createPreference(CreatePreferenceRequest req) {
        try {
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title(req.getTitle())
                    .quantity(req.getQuantity())
                    .unitPrice(java.math.BigDecimal.valueOf(req.getUnitPrice()))
                    .currencyId("ARS")
                    .build();

            PreferenceRequest request = PreferenceRequest.builder()
                    .items(List.of(item))
                    .payer(PreferencePayerRequest.builder()
                            .email(req.getPayerEmail())
                            .build())
                    .backUrls(PreferenceBackUrlsRequest.builder()
                            .success(successUrl)
                            .failure(failureUrl)
                            .pending(pendingUrl)
                            .build())
                    .autoReturn("approved")
                    .externalReference(req.getUserId())
                    .notificationUrl(webhookUrl)
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference pref = client.create(request);

            return new CreatePreferenceResponse(
                    pref.getId(),
                    pref.getInitPoint(),
                    pref.getSandboxInitPoint()
            );

        } catch (com.mercadopago.exceptions.MPException | com.mercadopago.exceptions.MPApiException e) {
            throw new IllegalStateException("Error al crear la preferencia de pago: " + e.getMessage(), e);
        }
    }
}
