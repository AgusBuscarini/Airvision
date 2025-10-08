package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.*;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Repository.UserRepository;
import com.tesis.AirVision.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
