package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Login.*;
import com.tesis.AirVision.Dtos.Register.*;
import com.tesis.AirVision.Entity.*;
import com.tesis.AirVision.Enums.Role;
import com.tesis.AirVision.Repository.UserRepository;
import com.tesis.AirVision.Security.JwtService;
import com.tesis.AirVision.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    public LoginResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
            return new LoginResponse("Los datos ingresados no son válidos", null, null);
        }

        if (userRepository.findByEmail(request.getEmail()).isEmpty()) {
            return new LoginResponse("Usuario no encontrado", null, null);
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            return new LoginResponse("Credenciales invalidas", null, null);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String token = jwtService.generateToken(userDetails);

        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new LoginResponse("Login exitoso", role, token);
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {
        if(request.getEmail() == null || request.getPassword() == null ||
            request.getEmail().isBlank() || request.getPassword().isBlank() ||
                request.getName() == null || request.getName().isBlank()){
            return new RegisterResponse("Los datos ingresados no son validos");
        }

        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            return new RegisterResponse("El email ya esta registrado");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(OffsetDateTime.now());

        userRepository.save(user);

        return new RegisterResponse("Usuario registrado correctamente");
    }
}
