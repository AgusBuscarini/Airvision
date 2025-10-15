package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Login.*;
import com.tesis.AirVision.Dtos.Register.*;
import com.tesis.AirVision.Entity.*;
import com.tesis.AirVision.Enums.Role;
import com.tesis.AirVision.Repository.UserRepository;
import com.tesis.AirVision.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    if (user.getPasswordHash().equals(request.getPassword())) {
                        return new LoginResponse("Login exitoso", user.getRole().name());
                    } else {
                        return new LoginResponse("Credenciales inválidas", null);
                    }
                })
                .orElse(new LoginResponse("Usuario no encontrado", null));
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getName() == null || request.getName().isBlank()) {
            return new RegisterResponse("Los datos ingresados no son válidos");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new RegisterResponse("El email ya está registrado");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // Por ahora guardamos plano en passwordHash, después vamos a implementar BCrypt
        user.setPasswordHash(request.getPassword());
        user.setRole(Role.USER);
        user.setCreatedAt(OffsetDateTime.now());

        userRepository.save(user);

        return new RegisterResponse("Usuario registrado con éxito");
    }

    @Override
    public void logout() {
        // Por ahora imprimimos el evento de logout, mas adelante agregamos JWT
        System.out.println("Logout ejecutado correctamente.");
    }
}
