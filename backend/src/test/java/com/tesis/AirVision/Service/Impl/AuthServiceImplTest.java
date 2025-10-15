package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.Login.LoginRequest;
import com.tesis.AirVision.Dtos.Login.LoginResponse;
import com.tesis.AirVision.Dtos.Register.RegisterRequest;
import com.tesis.AirVision.Dtos.Register.RegisterResponse;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Enums.Role;
import com.tesis.AirVision.Repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@test.com");
        user.setPasswordHash("test123");
        user.setRole(Role.USER);
    }

    @Test
    void login_Successful() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("test123");

        LoginResponse loginResponse = authService.login(request);

        assertEquals("Login exitoso", loginResponse.getMessage());
        assertEquals("USER", loginResponse.getRole());
    }

    @Test
    void login_Failed() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("testWrong");

        LoginResponse loginResponse = authService.login(request);

        assertEquals("Credenciales inválidas", loginResponse.getMessage());
        assertNull(loginResponse.getRole());
    }

    @Test
    void login_NotFound() {
        when(userRepository.findByEmail("testNotFound@test.com")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest();
        request.setEmail("testNotFound@test.com");
        request.setPassword("test");

        LoginResponse loginResponse = authService.login(request);

        assertEquals("Usuario no encontrado", loginResponse.getMessage());
        assertNull(loginResponse.getRole());
    }

    @Test
    void register_ShouldReturnError_WhenDataIsInvalid() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("");
        request.setPassword("");
        request.setName("");

        RegisterResponse response = authService.register(request);

        assertEquals("Los datos ingresados no son válidos", response.getMessage());
        verify(userRepository, never()).findByEmail(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_ShouldReturnError_WhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("1234");
        request.setName("Agustin");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(new User()));

        RegisterResponse response = authService.register(request);

        assertEquals("El email ya está registrado", response.getMessage());
        verify(userRepository, times(1)).findByEmail("test@test.com");
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_ShouldSaveUser_WhenDataIsValidAndEmailNotExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("nuevo@test.com");
        request.setPassword("abcd1234");
        request.setName("Nuevo Usuario");

        when(userRepository.findByEmail("nuevo@test.com"))
                .thenReturn(Optional.empty());

        RegisterResponse response = authService.register(request);

        assertEquals("Usuario registrado con éxito", response.getMessage());
        verify(userRepository, times(1)).findByEmail("nuevo@test.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void logout_ShouldPrintMessage() {
        java.io.ByteArrayOutputStream outContent = new java.io.ByteArrayOutputStream();
        System.setOut(new java.io.PrintStream(outContent));

        authService.logout();

        assertTrue(outContent.toString().contains("Logout ejecutado correctamente."));
    }
}