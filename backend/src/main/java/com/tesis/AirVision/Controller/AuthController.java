package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.Login.*;
import com.tesis.AirVision.Dtos.Register.*;
import com.tesis.AirVision.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return switch (response.getMessage()) {
            case "Login exitoso" -> ResponseEntity.ok(response);
            case "Usuario no encontrado" -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            case "Credenciales invalidas"  -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            case "Los datos ingresados no son válidos" -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        };
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {

        RegisterResponse response = authService.register(request);

        return switch (response.getMessage()) {
            case "Usuario registrado correctamente" -> ResponseEntity.ok(response);
            case "El email ya esta registrado"  -> ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            case "Los datos ingresados no son validos"   -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        };
    }
}