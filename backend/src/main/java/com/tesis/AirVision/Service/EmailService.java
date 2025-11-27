package com.tesis.AirVision.Service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    void sendPaymentReceipt(String to, String subject, String htmlBody);
}
