package com.tesis.AirVision.Controller;

import com.tesis.AirVision.Dtos.User.UpdateUserRoleRequest;
import com.tesis.AirVision.Entity.User;
import com.tesis.AirVision.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable UUID userId, @Valid @RequestBody UpdateUserRoleRequest request) {
        return userService.updateUserRole(userId, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}