package com.tesis.AirVision.Dtos.Payments;

import jakarta.validation.constraints.*;

public class CreatePreferenceRequest {

    @NotBlank(message = "title es requerido")
    private String title;

    @Positive(message = "unitPrice debe ser > 0")
    private double unitPrice;

    @Min(value = 1, message = "quantity debe ser >= 1")
    private int quantity;

    // para asociar el pago con el usuario (usaremos external_reference)
    @NotBlank(message = "userId es requerido")
    private String userId;

    // opcional: correo para el recibo
    @Email(message = "payerEmail inválido")
    private String payerEmail;

    // getters/setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getPayerEmail() { return payerEmail; }
    public void setPayerEmail(String payerEmail) { this.payerEmail = payerEmail; }
}
