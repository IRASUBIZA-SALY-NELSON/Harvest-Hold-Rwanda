package rw.harvesthold.api.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import rw.harvesthold.api.dto.AdminLoginRequest;
import rw.harvesthold.api.model.AdminUser;
import rw.harvesthold.api.repository.AdminUserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AdminUserRepository admins;

    public AdminAuthController(AdminUserRepository admins) {
        this.admins = admins;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AdminLoginRequest request) {
        AdminUser admin = admins.findByEmailIgnoreCase(request.getEmail().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!admin.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return ResponseEntity.ok(Map.of(
                "token", "demo-admin-" + admin.getId(),
                "admin", Map.of(
                        "id", admin.getId(),
                        "name", admin.getName(),
                        "email", admin.getEmail(),
                        "role", admin.getRole()
                )
        ));
    }
}
