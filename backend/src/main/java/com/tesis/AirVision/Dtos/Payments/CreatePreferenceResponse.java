package com.tesis.AirVision.Dtos.Payments;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CreatePreferenceResponse {
    private String preferenceId;
    private String initPoint;
    private String sandboxInitPoint;
}
