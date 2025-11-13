package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender mailSender;

    @Override
    public void sendPaymentReceipt(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML
            mailSender.send(message);
            log.info("📧 Email enviado correctamente a {}", to);
        } catch (Exception e) {
            log.error("❌ Error al enviar email a {}: {}", to, e.getMessage());
        }
    }
}
