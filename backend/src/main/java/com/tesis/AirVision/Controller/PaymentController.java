package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.Payments.CreatePreferenceRequest;
import com.tesis.AirVision.Dtos.Payments.CreatePreferenceResponse;
import com.tesis.AirVision.Service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-preference")
    public ResponseEntity<CreatePreferenceResponse> createPreference(@Valid @RequestBody CreatePreferenceRequest req) {
        return ResponseEntity.ok(paymentService.createPreference(req));
    }
}
