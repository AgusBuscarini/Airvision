package com.tesis.AirVision.Service.Impl;

import com.tesis.AirVision.Dtos.User.UpdateUserRoleRequest;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Repository.UserRepository;
import com.tesis.AirVision.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> updateUserRole(UUID userId, UpdateUserRoleRequest request) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setRole(request.getRole());
                    return userRepository.save(user);
                });
    }
}