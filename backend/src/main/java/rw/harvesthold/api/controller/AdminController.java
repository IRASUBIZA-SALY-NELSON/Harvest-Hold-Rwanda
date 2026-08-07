package rw.harvesthold.api.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import rw.harvesthold.api.dto.TicketStatusRequest;
import rw.harvesthold.api.dto.UnitResponse;
import rw.harvesthold.api.model.Alert;
import rw.harvesthold.api.model.CoolingUnit;
import rw.harvesthold.api.model.Farmer;
import rw.harvesthold.api.model.HelpTicket;
import rw.harvesthold.api.repository.AlertRepository;
import rw.harvesthold.api.repository.CoolingUnitRepository;
import rw.harvesthold.api.repository.FarmerRepository;
import rw.harvesthold.api.repository.HelpTicketRepository;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CoolingUnitRepository units;
    private final FarmerRepository farmers;
    private final AlertRepository alerts;
    private final HelpTicketRepository tickets;

    public AdminController(
            CoolingUnitRepository units,
            FarmerRepository farmers,
            AlertRepository alerts,
            HelpTicketRepository tickets
    ) {
        this.units = units;
        this.farmers = farmers;
        this.alerts = alerts;
        this.tickets = tickets;
    }

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        List<CoolingUnit> allUnits = units.findAll();
        List<Farmer> allFarmers = farmers.findAll();
        List<Alert> allAlerts = alerts.findAll();
        List<HelpTicket> allTickets = tickets.findAll();

        long online = allUnits.stream().filter(CoolingUnit::isOnline).count();
        long alerting = allUnits.stream().filter(u -> "alert".equalsIgnoreCase(u.getStatus())).count();
        long unreadAlerts = allAlerts.stream().filter(a -> !a.isReadFlag()).count();
        long openTickets = allTickets.stream().filter(t -> "Open".equalsIgnoreCase(t.getStatus())).count();
        int totalCrates = allUnits.stream().mapToInt(CoolingUnit::getCrates).sum();
        double avgTemp = allUnits.isEmpty() ? 0 :
                allUnits.stream().mapToDouble(CoolingUnit::getTemperature).average().orElse(0);
        double avgHumidity = allUnits.isEmpty() ? 0 :
                allUnits.stream().mapToDouble(CoolingUnit::getHumidity).average().orElse(0);

        Map<String, Long> statusBreakdown = allUnits.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getStatus() == null ? "unknown" : u.getStatus().toLowerCase(Locale.ROOT),
                        Collectors.counting()
                ));

        Map<String, Long> districtBreakdown = allFarmers.stream()
                .collect(Collectors.groupingBy(
                        f -> f.getDistrict() == null ? "Unknown" : f.getDistrict(),
                        Collectors.counting()
                ));

        Map<String, Long> severityBreakdown = allAlerts.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getSeverity() == null ? "low" : a.getSeverity().toLowerCase(Locale.ROOT),
                        Collectors.counting()
                ));

        List<Map<String, Object>> fleetTemps = allUnits.stream()
                .sorted(Comparator.comparing(CoolingUnit::getName))
                .map(u -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", u.getId());
                    row.put("name", u.getName());
                    row.put("temp", round1(u.getTemperature()));
                    row.put("humidity", round1(u.getHumidity()));
                    row.put("targetMin", u.getTargetTempMin());
                    row.put("targetMax", u.getTargetTempMax());
                    row.put("status", u.getStatus());
                    row.put("battery", u.getBattery());
                    row.put("waterLevel", u.getWaterLevel());
                    return row;
                })
                .toList();

        // Build a merged fleet timeline from the longest history series
        List<Map<String, Object>> tempSeries = buildAverageSeries(allUnits, true);
        List<Map<String, Object>> humiditySeries = buildAverageSeries(allUnits, false);

        List<Map<String, Object>> recentAlerts = allAlerts.stream()
                .sorted(Comparator.comparing(Alert::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(8)
                .map(this::alertMap)
                .toList();

        Map<String, Object> kpis = new LinkedHashMap<>();
        kpis.put("farmers", allFarmers.size());
        kpis.put("units", allUnits.size());
        kpis.put("online", online);
        kpis.put("alerting", alerting);
        kpis.put("unreadAlerts", unreadAlerts);
        kpis.put("openTickets", openTickets);
        kpis.put("totalCrates", totalCrates);
        kpis.put("avgTemp", round1(avgTemp));
        kpis.put("avgHumidity", round1(avgHumidity));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("kpis", kpis);
        body.put("statusBreakdown", statusBreakdown);
        body.put("districtBreakdown", districtBreakdown);
        body.put("severityBreakdown", severityBreakdown);
        body.put("fleetTemps", fleetTemps);
        body.put("tempSeries", tempSeries);
        body.put("humiditySeries", humiditySeries);
        body.put("recentAlerts", recentAlerts);
        body.put("serverTime", Instant.now().toString());
        return body;
    }

    @GetMapping("/units")
    public List<Map<String, Object>> listUnits() {
        Map<Long, Farmer> farmerMap = farmers.findAll().stream()
                .collect(Collectors.toMap(Farmer::getId, f -> f));
        return units.findAll().stream()
                .sorted(Comparator.comparing(CoolingUnit::getName))
                .map(u -> {
                    UnitResponse base = UnitResponse.from(u);
                    Farmer f = farmerMap.get(u.getFarmerId());
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", base.getId());
                    m.put("farmerId", base.getFarmerId());
                    m.put("farmerName", f != null ? f.getName() : "—");
                    m.put("cooperative", f != null ? f.getCooperative() : "—");
                    m.put("district", f != null ? f.getDistrict() : "—");
                    m.put("name", base.getName());
                    m.put("location", base.getLocation());
                    m.put("status", base.getStatus());
                    m.put("online", base.isOnline());
                    m.put("crop", base.getCrop());
                    m.put("crates", base.getCrates());
                    m.put("shelfLifeDays", base.getShelfLifeDays());
                    m.put("temp", base.getTemp());
                    m.put("humidity", base.getHumidity());
                    m.put("ethylene", base.getEthylene());
                    m.put("ethylenePpm", base.getEthylenePpm());
                    m.put("battery", base.getBattery());
                    m.put("solar", base.isSolar());
                    m.put("waterLevel", base.getWaterLevel());
                    m.put("lastSync", base.getLastSync());
                    m.put("targetTemp", base.getTargetTemp());
                    m.put("history", base.getHistory());
                    m.put("humidityHistory", base.getHumidityHistory());
                    m.put("updatedAt", base.getUpdatedAt());
                    return m;
                })
                .toList();
    }

    @GetMapping("/units/{unitId}")
    public Map<String, Object> unitDetail(@PathVariable String unitId) {
        return listUnits().stream()
                .filter(u -> unitId.equals(u.get("id")))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unit not found"));
    }

    @GetMapping("/farmers")
    public List<Map<String, Object>> listFarmers() {
        Map<Long, Long> unitCounts = units.findAll().stream()
                .collect(Collectors.groupingBy(CoolingUnit::getFarmerId, Collectors.counting()));
        Map<Long, Long> unreadByFarmer = alerts.findAll().stream()
                .filter(a -> !a.isReadFlag())
                .collect(Collectors.groupingBy(Alert::getFarmerId, Collectors.counting()));

        return farmers.findAll().stream()
                .sorted(Comparator.comparing(Farmer::getName))
                .map(f -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", f.getId());
                    m.put("name", f.getName());
                    m.put("phone", f.getPhone());
                    m.put("cooperative", f.getCooperative());
                    m.put("district", f.getDistrict());
                    m.put("village", f.getVillage());
                    m.put("units", unitCounts.getOrDefault(f.getId(), 0L));
                    m.put("unreadAlerts", unreadByFarmer.getOrDefault(f.getId(), 0L));
                    m.put("createdAt", f.getCreatedAt() != null ? f.getCreatedAt().toString() : null);
                    return m;
                })
                .toList();
    }

    @GetMapping("/alerts")
    public List<Map<String, Object>> listAlerts() {
        Map<Long, String> names = farmers.findAll().stream()
                .collect(Collectors.toMap(Farmer::getId, Farmer::getName));
        return alerts.findAll().stream()
                .sorted(Comparator.comparing(Alert::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(a -> {
                    Map<String, Object> m = alertMap(a);
                    m.put("farmerName", names.getOrDefault(a.getFarmerId(), "—"));
                    return m;
                })
                .toList();
    }

    @GetMapping("/tickets")
    public List<Map<String, Object>> listTickets() {
        Map<Long, String> names = farmers.findAll().stream()
                .collect(Collectors.toMap(Farmer::getId, Farmer::getName));
        return tickets.findAll().stream()
                .sorted(Comparator.comparing(HelpTicket::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(t -> {
                    Map<String, Object> m = ticketMap(t);
                    m.put("farmerName", names.getOrDefault(t.getFarmerId(), "—"));
                    return m;
                })
                .toList();
    }

    @PatchMapping("/tickets/{ticketId}")
    public Map<String, Object> updateTicket(
            @PathVariable Long ticketId,
            @Valid @RequestBody TicketStatusRequest request
    ) {
        HelpTicket ticket = tickets.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
        String status = request.getStatus().trim();
        if (!List.of("Open", "In Progress", "Resolved", "Closed").contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }
        ticket.setStatus(status);
        tickets.save(ticket);
        Map<Long, String> names = farmers.findAll().stream()
                .collect(Collectors.toMap(Farmer::getId, Farmer::getName));
        Map<String, Object> m = ticketMap(ticket);
        m.put("farmerName", names.getOrDefault(ticket.getFarmerId(), "—"));
        return m;
    }

    private List<Map<String, Object>> buildAverageSeries(List<CoolingUnit> allUnits, boolean temperature) {
        int maxLen = allUnits.stream()
                .mapToInt(u -> {
                    String csv = temperature ? u.getHistoryCsv() : u.getHumidityCsv();
                    if (csv == null || csv.isBlank()) return 0;
                    return csv.split(",").length;
                })
                .max()
                .orElse(0);

        List<Map<String, Object>> series = new ArrayList<>();
        for (int i = 0; i < maxLen; i++) {
            double sum = 0;
            int count = 0;
            for (CoolingUnit u : allUnits) {
                String csv = temperature ? u.getHistoryCsv() : u.getHumidityCsv();
                if (csv == null || csv.isBlank()) continue;
                String[] parts = csv.split(",");
                int offset = maxLen - parts.length;
                int idx = i - offset;
                if (idx >= 0 && idx < parts.length) {
                    try {
                        sum += Double.parseDouble(parts[idx].trim());
                        count++;
                    } catch (NumberFormatException ignored) {
                    }
                }
            }
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("t", "T-" + (maxLen - i));
            point.put("value", count == 0 ? null : round1(sum / count));
            series.add(point);
        }
        return series;
    }

    private Map<String, Object> alertMap(Alert a) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", a.getId());
        m.put("farmerId", a.getFarmerId());
        m.put("unitId", a.getUnitId());
        m.put("unitName", a.getUnitName());
        m.put("severity", a.getSeverity());
        m.put("title", a.getTitle());
        m.put("message", a.getMessage());
        m.put("time", a.getTimeLabel());
        m.put("read", a.isReadFlag());
        m.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);
        return m;
    }

    private Map<String, Object> ticketMap(HelpTicket t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", t.getId());
        m.put("farmerId", t.getFarmerId());
        m.put("unitId", t.getUnitId() == null ? "" : t.getUnitId());
        m.put("topic", t.getTopic());
        m.put("details", t.getDetails());
        m.put("status", t.getStatus());
        m.put("createdAt", t.getCreatedAt() != null ? t.getCreatedAt().toString() : null);
        return m;
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }
}
