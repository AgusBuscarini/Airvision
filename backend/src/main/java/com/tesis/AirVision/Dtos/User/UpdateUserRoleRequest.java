package com.tesis.AirVision.Dtos.User;

import com.tesis.AirVision.Enums.Role;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class UpdateUserRoleRequest {
    @NotNull(message = "El rol no puede ser nulo")
    private Role role;
}