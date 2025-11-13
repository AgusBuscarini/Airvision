package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Payments.CreatePreferenceRequest;
import com.tesis.AirVision.Dtos.Payments.CreatePreferenceResponse;

public interface PaymentService {
    CreatePreferenceResponse createPreference(CreatePreferenceRequest req);
}
