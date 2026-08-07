package rw.harvesthold.api.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.harvesthold.api.model.Alert;
import rw.harvesthold.api.model.CoolingUnit;
import rw.harvesthold.api.repository.AlertRepository;
import rw.harvesthold.api.repository.CoolingUnitRepository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Simulates IoT sensor telemetry so dashboards and the farmer app see live updates.
 * Keeps readings near realistic operating bands (not unbounded drift).
 */
@Service
public class TelemetrySimulator {

    private final CoolingUnitRepository units;
    private final AlertRepository alerts;
    private final Random random = new Random();
    private final AtomicLong tick = new AtomicLong();

    public TelemetrySimulator(CoolingUnitRepository units, AlertRepository alerts) {
        this.units = units;
        this.alerts = alerts;
    }

    @Scheduled(fixedDelay = 4000, initialDelay = 6000)
    @Transactional
    public void tick() {
        List<CoolingUnit> all = units.findAll();
        if (all.isEmpty()) return;

        long n = tick.incrementAndGet();
        List<CoolingUnit> dirty = new ArrayList<>();

        for (CoolingUnit u : all) {
            if (!u.isOnline()) {
                // Offline units stay mostly static
                u.setLastSync(u.getLastSync() == null || u.getLastSync().equals("Just now") ? "3 hr ago" : u.getLastSync());
                continue;
            }

            double mid = (u.getTargetTempMin() + u.getTargetTempMax()) / 2.0;
            boolean alertUnit = "alert".equalsIgnoreCase(u.getStatus());

            // Pull toward operating band with small noise; alert units sit slightly above max
            double target = alertUnit ? u.getTargetTempMax() + 2.2 : mid;
            double tempNoise = (random.nextDouble() - 0.5) * 0.45;
            double nextTemp = clamp(u.getTemperature() + (target - u.getTemperature()) * 0.22 + tempNoise, 14.0, 28.0);

            double humidityTarget = alertUnit ? 82 : 72;
            double nextHumidity = clamp(
                    u.getHumidity() + (humidityTarget - u.getHumidity()) * 0.15 + (random.nextDouble() - 0.5) * 1.0,
                    55.0, 90.0
            );

            double ethyleneTarget = alertUnit ? 1.7 : 0.45;
            double nextEthylene = clamp(
                    u.getEthylenePpm() + (ethyleneTarget - u.getEthylenePpm()) * 0.12 + (random.nextDouble() - 0.5) * 0.05,
                    0.1, 3.0
            );

            u.setTemperature(nextTemp);
            u.setHumidity(nextHumidity);
            u.setEthylenePpm(nextEthylene);
            u.setEthylene(nextEthylene < 0.8 ? "Low" : nextEthylene < 1.5 ? "Moderate" : "Rising");

            if (n % 4 == 0) {
                int batteryDelta = u.isSolar() ? (random.nextBoolean() ? 1 : 0) : -1;
                u.setBattery(clampInt(u.getBattery() + batteryDelta, 12, 100));
            }
            if (n % 6 == 0) {
                int waterDelta = alertUnit && u.getWaterLevel() < 30 ? -1 : (random.nextDouble() < 0.3 ? -1 : 0);
                u.setWaterLevel(clampInt(u.getWaterLevel() + waterDelta, 10, 95));
            }

            boolean overTemp = nextTemp > u.getTargetTempMax() + 0.8;
            boolean lowWater = u.getWaterLevel() < 25;
            boolean lowBattery = u.getBattery() < 22;

            if (overTemp || lowWater || lowBattery) {
                u.setStatus("alert");
            } else if (!alertUnit || nextTemp <= u.getTargetTempMax()) {
                if (!"idle".equalsIgnoreCase(u.getStatus())) {
                    u.setStatus("cooling");
                }
            }

            u.setHistoryCsv(appendSample(u.getHistoryCsv(), nextTemp, 24));
            u.setHumidityCsv(appendSample(u.getHumidityCsv(), nextHumidity, 24));
            u.setLastSync("Just now");
            u.setUpdatedAt(Instant.now());
            dirty.add(u);

            // Rare, deduped alerts only
            if (n % 15 == 0 && overTemp && random.nextDouble() < 0.25) {
                maybeRaiseAlert(u, "high", "Temperature above safe range",
                        String.format(Locale.US,
                                "Chamber is %.1f°C. Target is %.0f–%.0f°C. Check fan and charcoal moisture.",
                                nextTemp, u.getTargetTempMin(), u.getTargetTempMax()));
            } else if (n % 20 == 0 && lowWater && random.nextDouble() < 0.2) {
                maybeRaiseAlert(u, "medium", "Water reservoir low",
                        String.format(Locale.US,
                                "Water level at %d%%. Refill to keep evaporative cooling effective.",
                                u.getWaterLevel()));
            }
        }

        units.saveAll(dirty);
    }

    private void maybeRaiseAlert(CoolingUnit u, String severity, String title, String message) {
        Instant cutoff = Instant.now().minusSeconds(300);
        boolean recent = alerts.findByFarmerIdOrderByCreatedAtDesc(u.getFarmerId()).stream()
                .anyMatch(a -> u.getId().equals(a.getUnitId())
                        && title.equals(a.getTitle())
                        && a.getCreatedAt() != null
                        && a.getCreatedAt().isAfter(cutoff));
        if (recent) return;

        Alert alert = new Alert();
        alert.setFarmerId(u.getFarmerId());
        alert.setUnitId(u.getId());
        alert.setUnitName(u.getName());
        alert.setSeverity(severity);
        alert.setTitle(title);
        alert.setMessage(message);
        alert.setTimeLabel("Just now");
        alert.setReadFlag(false);
        alert.setCreatedAt(Instant.now());
        alerts.save(alert);
    }

    private static String appendSample(String csv, double value, int maxPoints) {
        List<String> parts = new ArrayList<>();
        if (csv != null && !csv.isBlank()) {
            for (String p : csv.split(",")) {
                String t = p.trim();
                if (!t.isEmpty()) parts.add(t);
            }
        }
        parts.add(String.format(Locale.US, "%.1f", value));
        while (parts.size() > maxPoints) {
            parts.remove(0);
        }
        return String.join(",", parts);
    }

    private static double clamp(double v, double min, double max) {
        return Math.max(min, Math.min(max, v));
    }

    private static int clampInt(int v, int min, int max) {
        return Math.max(min, Math.min(max, v));
    }
}
