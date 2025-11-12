package com.tesis.AirVision.Controller;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Enums.Role;
import com.tesis.AirVision.Repository.UserRepository;
import com.tesis.AirVision.Service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private static final Logger log = LoggerFactory.getLogger(PaymentWebhookController.class);

    private final UserRepository userRepository;
    private final EmailService emailService;

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String topic) {

        if (!"payment".equalsIgnoreCase(topic) || id == null) {
            return ResponseEntity.ok("ignored");
        }

        try {
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(Long.parseLong(id));

            String status = payment.getStatus(); // approved, pending, rejected
            String userId = payment.getExternalReference(); // seteado en createPreference

            log.info("🔔 Webhook recibido: id={}, status={}, userRef={}", id, status, userId);

            if ("approved".equalsIgnoreCase(status) && userId != null) {
                Optional<User> opt = userRepository.findById(UUID.fromString(userId));
                if (opt.isPresent()) {
                    User user = opt.get();
                    user.setRole(Role.USER_PREMIUM);
                    userRepository.save(user);
                    log.info("👑 Usuario {} actualizado a USER_PREMIUM", user.getEmail());

                    // Enviar correo de confirmación
                    if (payment.getPayer() != null && payment.getPayer().getEmail() != null) {
                        String to = payment.getPayer().getEmail();
                        emailService.sendPaymentReceipt(
                                to,
                                "Confirmación de pago - AirVision Premium",
                                """
                                <h2>¡Gracias por tu pago!</h2>
                                <p>Tu cuenta fue actualizada a <b>Premium</b>.</p>
                                <p>Ahora podés disfrutar de todas las funcionalidades exclusivas de AirVision.</p>
                                <hr>
                                <p><i>AirVision Team</i></p>
                                """
                        );
                    }
                } else {
                    log.warn("⚠️ No se encontró el usuario con id {}", userId);
                }
            }

            return ResponseEntity.ok("ok");

        } catch (Exception e) {
            log.error("❌ Error procesando webhook: {}", e.getMessage(), e);
            // Importante: siempre responder 200 para evitar reintentos infinitos
            return ResponseEntity.ok("error");
        }
    }
}
