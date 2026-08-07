package rw.harvesthold.api.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import rw.harvesthold.api.dto.LoginRequest;
import rw.harvesthold.api.model.Farmer;
import rw.harvesthold.api.repository.FarmerRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final FarmerRepository farmers;

    public AuthController(FarmerRepository farmers) {
        this.farmers = farmers;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Farmer farmer = farmers.findByPhone(normalizePhone(request.getPhone()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid phone or PIN"));

        if (!farmer.getPin().equals(request.getPin())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid phone or PIN");
        }

        return ResponseEntity.ok(Map.of(
                "token", "demo-farmer-" + farmer.getId(),
                "farmer", Map.of(
                        "id", farmer.getId(),
                        "name", farmer.getName(),
                        "phone", farmer.getPhone(),
                        "cooperative", farmer.getCooperative(),
                        "district", farmer.getDistrict(),
                        "village", farmer.getVillage()
                )
        ));
    }

    private String normalizePhone(String phone) {
        return phone == null ? "" : phone.trim().replaceAll("\\s+", " ");
    }
}
