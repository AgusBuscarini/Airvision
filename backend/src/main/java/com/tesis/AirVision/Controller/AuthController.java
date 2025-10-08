package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.*;
import com.tesis.AirVision.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);

        switch (response.getMessage()) {
            case "Login exitoso":
                return ResponseEntity.ok(response);
            case "Usuario no encontrado":
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            default:
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}