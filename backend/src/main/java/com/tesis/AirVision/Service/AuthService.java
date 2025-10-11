package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.*;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    LoginResponse login(LoginRequest request);
}