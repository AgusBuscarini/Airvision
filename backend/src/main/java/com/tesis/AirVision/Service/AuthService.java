package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.Login.*;
import com.tesis.AirVision.Dtos.Register.*;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    LoginResponse login(LoginRequest request);
    RegisterResponse register(RegisterRequest request);
}