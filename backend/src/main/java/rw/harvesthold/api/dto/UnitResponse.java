package rw.harvesthold.api.dto;

import rw.harvesthold.api.model.CoolingUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class UnitResponse {
    private String id;
    private Long farmerId;
    private String name;
    private String location;
    private String status;
    private boolean online;
    private String crop;
    private int crates;
    private int shelfLifeDays;
    private double temp;
    private double humidity;
    private String ethylene;
    private double ethylenePpm;
    private int battery;
    private boolean solar;
    private int waterLevel;
    private String lastSync;
    private double[] targetTemp;
    private List<Double> history;
    private List<Double> humidityHistory;
    private String updatedAt;

    public static UnitResponse from(CoolingUnit u) {
        UnitResponse r = new UnitResponse();
        r.id = u.getId();
        r.farmerId = u.getFarmerId();
        r.name = u.getName();
        r.location = u.getLocation();
        r.status = u.getStatus();
        r.online = u.isOnline();
        r.crop = u.getCrop();
        r.crates = u.getCrates();
        r.shelfLifeDays = u.getShelfLifeDays();
        r.temp = round1(u.getTemperature());
        r.humidity = round1(u.getHumidity());
        r.ethylene = u.getEthylene();
        r.ethylenePpm = round1(u.getEthylenePpm());
        r.battery = u.getBattery();
        r.solar = u.isSolar();
        r.waterLevel = u.getWaterLevel();
        r.lastSync = u.getLastSync();
        r.targetTemp = new double[]{u.getTargetTempMin(), u.getTargetTempMax()};
        r.history = parseCsv(u.getHistoryCsv());
        r.humidityHistory = parseCsv(u.getHumidityCsv());
        r.updatedAt = u.getUpdatedAt() != null ? u.getUpdatedAt().toString() : null;
        return r;
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private static List<Double> parseCsv(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Double::valueOf)
                .collect(Collectors.toList());
    }

    public String getId() { return id; }
    public Long getFarmerId() { return farmerId; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public String getStatus() { return status; }
    public boolean isOnline() { return online; }
    public String getCrop() { return crop; }
    public int getCrates() { return crates; }
    public int getShelfLifeDays() { return shelfLifeDays; }
    public double getTemp() { return temp; }
    public double getHumidity() { return humidity; }
    public String getEthylene() { return ethylene; }
    public double getEthylenePpm() { return ethylenePpm; }
    public int getBattery() { return battery; }
    public boolean isSolar() { return solar; }
    public int getWaterLevel() { return waterLevel; }
    public String getLastSync() { return lastSync; }
    public double[] getTargetTemp() { return targetTemp; }
    public List<Double> getHistory() { return history; }
    public List<Double> getHumidityHistory() { return humidityHistory; }
    public String getUpdatedAt() { return updatedAt; }
}
