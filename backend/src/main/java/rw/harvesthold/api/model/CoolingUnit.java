package rw.harvesthold.api.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "cooling_units")
public class CoolingUnit {

    @Id
    private String id;

    @Column(nullable = false)
    private Long farmerId;

    private String name;
    private String location;
    private String status;
    private boolean online;
    private String crop;
    private int crates;
    private int shelfLifeDays;
    private double temperature;
    private double humidity;
    private String ethylene;
    private double ethylenePpm;
    private int battery;
    private boolean solar;
    private int waterLevel;
    private String lastSync;
    private double targetTempMin;
    private double targetTempMax;

    /** Comma-separated recent temperatures for sparkline */
    @Column(length = 512)
    private String historyCsv;

    /** Comma-separated recent humidity readings */
    @Column(length = 512)
    private String humidityCsv;

    private Instant updatedAt = Instant.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isOnline() { return online; }
    public void setOnline(boolean online) { this.online = online; }
    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }
    public int getCrates() { return crates; }
    public void setCrates(int crates) { this.crates = crates; }
    public int getShelfLifeDays() { return shelfLifeDays; }
    public void setShelfLifeDays(int shelfLifeDays) { this.shelfLifeDays = shelfLifeDays; }
    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }
    public double getHumidity() { return humidity; }
    public void setHumidity(double humidity) { this.humidity = humidity; }
    public String getEthylene() { return ethylene; }
    public void setEthylene(String ethylene) { this.ethylene = ethylene; }
    public double getEthylenePpm() { return ethylenePpm; }
    public void setEthylenePpm(double ethylenePpm) { this.ethylenePpm = ethylenePpm; }
    public int getBattery() { return battery; }
    public void setBattery(int battery) { this.battery = battery; }
    public boolean isSolar() { return solar; }
    public void setSolar(boolean solar) { this.solar = solar; }
    public int getWaterLevel() { return waterLevel; }
    public void setWaterLevel(int waterLevel) { this.waterLevel = waterLevel; }
    public String getLastSync() { return lastSync; }
    public void setLastSync(String lastSync) { this.lastSync = lastSync; }
    public double getTargetTempMin() { return targetTempMin; }
    public void setTargetTempMin(double targetTempMin) { this.targetTempMin = targetTempMin; }
    public double getTargetTempMax() { return targetTempMax; }
    public void setTargetTempMax(double targetTempMax) { this.targetTempMax = targetTempMax; }
    public String getHistoryCsv() { return historyCsv; }
    public void setHistoryCsv(String historyCsv) { this.historyCsv = historyCsv; }
    public String getHumidityCsv() { return humidityCsv; }
    public void setHumidityCsv(String humidityCsv) { this.humidityCsv = humidityCsv; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
