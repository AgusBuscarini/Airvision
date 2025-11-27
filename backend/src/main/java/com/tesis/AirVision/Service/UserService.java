package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.User.UpdateUserRoleRequest;
import com.tesis.AirVision.Entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface UserService {
    List<User> getAllUsers();
    Optional<User> updateUserRole(UUID userId, UpdateUserRoleRequest request);
}