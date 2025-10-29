package com.tesis.AirVision.Service;

import com.tesis.AirVision.Dtos.User.UpdateUserRoleRequest;
import com.tesis.AirVision.Entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> updateUserRole(UUID userId, UpdateUserRoleRequest request);
}