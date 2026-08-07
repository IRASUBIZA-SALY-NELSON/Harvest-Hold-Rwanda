package rw.harvesthold.api.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import rw.harvesthold.api.dto.DeviceTokenRequest;
import rw.harvesthold.api.model.DeviceToken;
import rw.harvesthold.api.repository.DeviceTokenRepository;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/farmers/{farmerId}/device-tokens")
public class DeviceTokenController {

    private final DeviceTokenRepository tokens;

    public DeviceTokenController(DeviceTokenRepository tokens) {
        this.tokens = tokens;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(
            @PathVariable Long farmerId,
            @Valid @RequestBody DeviceTokenRequest req
    ) {
        DeviceToken entity = tokens.findByToken(req.getToken()).orElseGet(DeviceToken::new);
        entity.setFarmerId(farmerId);
        entity.setToken(req.getToken());
        entity.setPlatform(req.getPlatform());
        entity.setDeviceName(req.getDeviceName());
        entity.setUpdatedAt(Instant.now());
        DeviceToken saved = tokens.save(entity);

        return Map.of(
                "id", saved.getId(),
                "farmerId", saved.getFarmerId(),
                "platform", saved.getPlatform() == null ? "" : saved.getPlatform(),
                "status", "registered"
        );
    }
}
