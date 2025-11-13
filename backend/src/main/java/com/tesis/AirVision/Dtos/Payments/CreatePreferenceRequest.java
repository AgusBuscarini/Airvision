package com.tesis.AirVision.Dtos.Payments;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreatePreferenceRequest {

    @NotBlank(message = "title es requerido")
    private String title;

    @Positive(message = "unitPrice debe ser > 0")
    private double unitPrice;

    @Min(value = 1, message = "quantity debe ser >= 1")
    private int quantity;

    @NotBlank(message = "userId es requerido")
    private String userId;

    @Email(message = "payerEmail inválido")
    private String payerEmail;
}
