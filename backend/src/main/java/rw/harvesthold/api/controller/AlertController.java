package rw.harvesthold.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import rw.harvesthold.api.model.Alert;
import rw.harvesthold.api.repository.AlertRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmers/{farmerId}/alerts")
public class AlertController {

    private final AlertRepository alerts;

    public AlertController(AlertRepository alerts) {
        this.alerts = alerts;
    }

    @GetMapping
    public List<Map<String, Object>> list(@PathVariable Long farmerId) {
        return alerts.findByFarmerIdOrderByCreatedAtDesc(farmerId).stream().map(this::toMap).toList();
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unread(@PathVariable Long farmerId) {
        return Map.of("count", alerts.countByFarmerIdAndReadFlagFalse(farmerId));
    }

    @PatchMapping("/{alertId}/read")
    public Map<String, Object> markRead(@PathVariable Long farmerId, @PathVariable Long alertId) {
        Alert alert = alerts.findById(alertId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!alert.getFarmerId().equals(farmerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        alert.setReadFlag(true);
        alerts.save(alert);
        return toMap(alert);
    }

    @PatchMapping("/read-all")
    public Map<String, String> markAll(@PathVariable Long farmerId) {
        List<Alert> list = alerts.findByFarmerIdOrderByCreatedAtDesc(farmerId);
        list.forEach(a -> a.setReadFlag(true));
        alerts.saveAll(list);
        return Map.of("status", "ok");
    }

    private Map<String, Object> toMap(Alert a) {
        return Map.of(
                "id", a.getId(),
                "unitId", a.getUnitId(),
                "unitName", a.getUnitName(),
                "severity", a.getSeverity(),
                "title", a.getTitle(),
                "message", a.getMessage(),
                "time", a.getTimeLabel(),
                "read", a.isReadFlag()
        );
    }
}
