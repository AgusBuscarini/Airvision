package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Payments.CreatePreferenceRequest;
import com.tesis.AirVision.Dtos.Payments.CreatePreferenceResponse;
import org.springframework.stereotype.Service;

@Service
public interface PaymentService {
    CreatePreferenceResponse createPreference(CreatePreferenceRequest req);
}
