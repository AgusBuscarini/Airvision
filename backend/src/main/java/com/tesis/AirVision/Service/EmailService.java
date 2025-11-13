package com.tesis.AirVision.Service;

public interface EmailService {
    void sendPaymentReceipt(String to, String subject, String htmlBody);
}
