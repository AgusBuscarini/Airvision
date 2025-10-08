package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.*;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}