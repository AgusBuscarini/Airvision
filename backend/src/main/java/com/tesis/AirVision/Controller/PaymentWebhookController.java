package com.tesis.AirVision.Controller;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.merchantorder.MerchantOrderClient;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.merchantorder.MerchantOrder;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Enums.Role;
import com.tesis.AirVision.Repository.UserRepository;
import com.tesis.AirVision.Service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
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
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String type,
            @RequestBody(required = false) Map<String, Object> body) {

        if (id == null && body != null && body.containsKey("data")) {
            Object dataObj = body.get("data");
            if (dataObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) dataObj;
                Object idObj = data.get("id");
                id = idObj != null ? String.valueOf(idObj) : null;
            }
        }

        if (topic == null && body != null) {
            if (body.containsKey("type")) {
                topic = String.valueOf(body.get("type"));
            } else if (body.containsKey("topic")) {
                topic = String.valueOf(body.get("topic"));
            }
        }

        if (id == null || "null".equals(id)) {
            log.warn("Webhook sin ID válido, ignorado");
            return ResponseEntity.ok("ignored - no id");
        }

        try {
            if ("payment".equalsIgnoreCase(topic)) {
                log.info("Procesando payment: {}", id);
                processPaymentDirect(Long.parseLong(id));
                return ResponseEntity.ok("payment processed");
            }
            else if ("merchant_order".equalsIgnoreCase(topic)) {
                log.info("Procesando merchant_order: {}", id);
                processMerchantOrder(Long.parseLong(id));
                return ResponseEntity.ok("merchant_order processed");
            }
            else {
                log.info("Tipo de webhook no procesado: {}", topic);
                return ResponseEntity.ok("ignored - topic: " + topic);
            }
        } catch (Exception e) {
            log.error("Error procesando webhook: {}", e.getMessage(), e);
            return ResponseEntity.ok("error");
        }
    }

    private void processPaymentDirect(Long paymentId) {
        Payment payment = null;
        int maxRetries = 5;
        int retryDelay = 2000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                log.info("Consultando pago ID: {} (intento {}/{})", paymentId, attempt, maxRetries);

                PaymentClient client = new PaymentClient();
                payment = client.get(paymentId);

                log.info("Pago encontrado en intento {}", attempt);
                break;

            } catch (com.mercadopago.exceptions.MPApiException e) {
                if (e.getStatusCode() == 404 && attempt < maxRetries) {
                    log.warn("Pago {} no disponible aún (404). Reintentando en {}ms... ({}/{})",
                            paymentId, retryDelay, attempt, maxRetries);
                    try {
                        Thread.sleep(retryDelay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Interrupted while waiting", ie);
                    }
                } else {
                    log.error("MPApiException:");
                    log.error("   Status Code: {}", e.getStatusCode());
                    log.error("   Message: {}", e.getMessage());
                    throw new RuntimeException(e);
                }
            } catch (Exception e) {
                log.error("Error inesperado procesando pago {}: {}", paymentId, e.getMessage(), e);
                throw new RuntimeException(e);
            }
        }

        if (payment == null) {
            log.error("No se pudo obtener el pago {} después de {} intentos", paymentId, maxRetries);
            return;
        }

        try {
            String status = payment.getStatus();
            String userId = payment.getExternalReference();

            log.info("Pago consultado: id={}, status={}, userRef={}, amount={}",
                    paymentId, status, userId, payment.getTransactionAmount());

            if ("approved".equalsIgnoreCase(status)) {
                updateUserToPremium(userId, payment);
            } else {
                log.info("Pago no aprobado (status={}), no se actualiza el rol", status);
            }
        } catch (Exception e) {
            log.error("Error procesando datos del pago: {}", e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    private void processMerchantOrder(Long orderId) {
        try {
            MerchantOrderClient orderClient = new MerchantOrderClient();
            MerchantOrder order = orderClient.get(orderId);

            String orderStatus = order.getOrderStatus();
            String userId = order.getExternalReference();

            log.info("Order obtenida: id={}, status={}, externalReference={}",
                    orderId, orderStatus, userId);

            if ("paid".equalsIgnoreCase(orderStatus)) {
                if (order.getPayments() != null && !order.getPayments().isEmpty()) {
                    Long paymentId = order.getPayments().get(0).getId();
                    log.info("Procesando pago de la orden: {}", paymentId);

                    PaymentClient paymentClient = new PaymentClient();
                    Payment payment = paymentClient.get(paymentId);

                    if ("approved".equalsIgnoreCase(payment.getStatus())) {
                        updateUserToPremium(userId, payment);
                    }
                } else {
                    log.warn("Orden paid pero sin pagos asociados");
                }
            } else {
                log.info("Orden no está 'paid' (estado: {}). No se actualiza el rol.", orderStatus);
            }

        } catch (Exception e) {
            log.error("Error procesando merchant_order {}: {}", orderId, e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    private void updateUserToPremium(String userId, Payment payment) {
        if (userId == null || userId.isEmpty()) {
            log.warn("No hay userId (externalReference) en el pago");
            return;
        }

        try {
            log.info("Buscando usuario con UUID: {}", userId);
            Optional<User> opt = userRepository.findById(UUID.fromString(userId));

            if (opt.isPresent()) {
                User user = opt.get();
                log.info("Usuario encontrado: {}, rol actual: {}", user.getEmail(), user.getRole());

                if (user.getRole() != Role.USER_PREMIUM) {
                    user.setRole(Role.USER_PREMIUM);
                    userRepository.save(user);

                    log.info("¡ÉXITO! Usuario {} actualizado a USER_PREMIUM", user.getEmail());

                    try {
                        if (payment.getPayer() != null && payment.getPayer().getEmail() != null) {
                            emailService.sendPaymentReceipt(
                                    payment.getPayer().getEmail(),
                                    "Confirmación de pago - AirVision Premium",
                                    """
                                    <h2>¡Gracias por tu pago!</h2>
                                    <p>Tu cuenta fue actualizada a <b>Premium</b>.</p>
                                    <p>Ahora podés disfrutar de todas las funcionalidades exclusivas de AirVision.</p>
                                    <hr>
                                    <p><i>AirVision Team</i></p>
                                    """
                            );
                            log.info("Email enviado a {}", payment.getPayer().getEmail());
                        }
                    } catch (Exception emailEx) {
                        log.error("Error enviando email: {}", emailEx.getMessage());
                    }
                } else {
                    log.info("Usuario {} ya es PREMIUM (webhook duplicado)", user.getEmail());
                }
            } else {
                log.error("No se encontró el usuario con UUID: {}", userId);
            }
        } catch (IllegalArgumentException e) {
            log.error("UUID inválido: {}", userId, e);
        } catch (Exception e) {
            log.error("Error actualizando usuario: {}", e.getMessage(), e);
        }
    }
}