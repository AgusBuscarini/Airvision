package com.tesis.AirVision.Dtos.Payments;

public class CreatePreferenceResponse {
    private String preferenceId;
    private String initPoint;     // web checkout
    private String sandboxInitPoint;

    public CreatePreferenceResponse(String preferenceId, String initPoint, String sandboxInitPoint) {
        this.preferenceId = preferenceId;
        this.initPoint = initPoint;
        this.sandboxInitPoint = sandboxInitPoint;
    }

    public String getPreferenceId() { return preferenceId; }
    public String getInitPoint() { return initPoint; }
    public String getSandboxInitPoint() { return sandboxInitPoint; }
}
