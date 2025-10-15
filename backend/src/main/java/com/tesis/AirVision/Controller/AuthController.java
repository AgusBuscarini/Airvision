package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.Login.*;
import com.tesis.AirVision.Dtos.Register.*;
import com.tesis.AirVision.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {

        RegisterResponse response = authService.register(request);

        if ("Usuario registrado con éxito".equals(response.getMessage())) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else if ("El email ya está registrado".equals(response.getMessage())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        authService.logout();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Sesión cerrada correctamente");
        return ResponseEntity.ok(response);
    }
}