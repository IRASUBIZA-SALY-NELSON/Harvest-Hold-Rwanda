package rw.harvesthold.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import rw.harvesthold.api.model.*;
import rw.harvesthold.api.repository.*;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(
            FarmerRepository farmers,
            CoolingUnitRepository units,
            AlertRepository alerts,
            HelpTicketRepository tickets,
            AdminUserRepository admins
    ) {
        return args -> {
            if (admins.count() == 0) {
                AdminUser admin = new AdminUser();
                admin.setEmail("admin@harvesthold.rw");
                admin.setPassword("admin1234");
                admin.setName("Grace Mukamana");
                admin.setRole("admin");
                admins.save(admin);
            }

            if (farmers.count() > 0) return;

            Farmer jeanine = saveFarmer(farmers, "Jeanine Uwase", "+250 788 123 456", "1234",
                    "Abahuje Cooperative", "Musanze", "Cyuve");
            Farmer emmanuel = saveFarmer(farmers, "Emmanuel Habimana", "+250 788 234 567", "1234",
                    "Twitezimbere Coop", "Nyabihu", "Mukamira");
            Farmer claire = saveFarmer(farmers, "Claire Ingabire", "+250 788 345 678", "1234",
                    "Duharanire Imirire", "Rubavu", "Nyamyumba");
            Farmer patrick = saveFarmer(farmers, "Patrick Niyonzima", "+250 788 456 789", "1234",
                    "Abahuje Cooperative", "Musanze", "Kinigi");

            CoolingUnit a = saveUnit(units, "SHCCS-MSZ-014", jeanine.getId(), "Cooler Hub A",
                    "Cyuve collection point", "cooling", true, "Tomatoes & leafy greens",
                    18, 9, 18.4, 72, "Low", 0.4, 86, true, 68,
                    "21.2,20.4,19.8,19.1,18.7,18.5,18.4",
                    "68,69,70,71,72,72,72");

            CoolingUnit b = saveUnit(units, "SHCCS-MSZ-021", jeanine.getId(), "Cooler Hub B",
                    "Home storage", "alert", true, "Cabbage",
                    7, 4, 24.8, 81, "Rising", 1.8, 42, true, 22,
                    "19.5,20.1,21.4,22.6,23.5,24.2,24.8",
                    "74,75,77,78,79,80,81");

            CoolingUnit c = saveUnit(units, "SHCCS-NYB-008", emmanuel.getId(), "Mukamira Hub",
                    "Cooperative yard", "cooling", true, "Irish potatoes",
                    24, 12, 17.2, 78, "Low", 0.3, 91, true, 74,
                    "18.8,18.4,18.0,17.7,17.5,17.3,17.2",
                    "75,76,77,77,78,78,78");

            CoolingUnit d = saveUnit(units, "SHCCS-RBV-003", claire.getId(), "Lakeside Cooler",
                    "Nyamyumba lakeside", "cooling", true, "French beans",
                    14, 6, 16.9, 70, "Low", 0.5, 78, true, 55,
                    "18.1,17.8,17.4,17.2,17.0,16.9,16.9",
                    "66,67,68,69,70,70,70");

            CoolingUnit e = saveUnit(units, "SHCCS-MSZ-033", patrick.getId(), "Kinigi Satellite",
                    "Kinigi hillside", "idle", false, "Carrots",
                    5, 8, 19.1, 65, "Low", 0.2, 18, true, 40,
                    "18.5,18.6,18.8,18.9,19.0,19.1,19.1",
                    "62,63,63,64,64,65,65");

            CoolingUnit f = saveUnit(units, "SHCCS-NYB-012", emmanuel.getId(), "Buffer Chamber",
                    "Packing shed", "alert", true, "Green peppers",
                    11, 3, 22.6, 84, "Rising", 2.1, 55, true, 18,
                    "18.2,19.0,20.1,20.8,21.5,22.1,22.6",
                    "76,78,80,81,82,83,84");

            saveAlert(alerts, jeanine.getId(), b, "high", "Temperature above safe range",
                    "Chamber is 24.8°C. Target is 16–20°C. Check fan and charcoal moisture.",
                    "8 min ago", false);
            saveAlert(alerts, jeanine.getId(), b, "medium", "Water reservoir low",
                    "Water level at 22%. Refill to keep evaporative cooling effective.",
                    "26 min ago", false);
            saveAlert(alerts, jeanine.getId(), a, "low", "Produce nearing peak ripeness",
                    "Ethylene still low. Estimated best dispatch window in 2–3 days.",
                    "Today, 09:14", true);
            saveAlert(alerts, jeanine.getId(), a, "low", "Daily quality log ready",
                    "Storage conditions stable. Report available for buyers.",
                    "Yesterday", true);
            saveAlert(alerts, emmanuel.getId(), f, "high", "Ethylene rising fast",
                    "Peppers approaching market window. Schedule buyer pickup within 24h.",
                    "12 min ago", false);
            saveAlert(alerts, emmanuel.getId(), c, "low", "Solar charge healthy",
                    "Battery at 91% after midday charging cycle.",
                    "Today, 13:40", true);
            saveAlert(alerts, claire.getId(), d, "medium", "Humidity dipping",
                    "Humidity at 70%. Verify wet charcoal pads before evening load.",
                    "1 hr ago", false);
            saveAlert(alerts, patrick.getId(), e, "high", "Unit offline",
                    "Kinigi Satellite last synced 3 hours ago. Field visit recommended.",
                    "3 hr ago", false);

            HelpTicket t1 = new HelpTicket();
            t1.setFarmerId(jeanine.getId());
            t1.setUnitId(b.getId());
            t1.setTopic("Fan noise / weak airflow");
            t1.setDetails("Cooler Hub B fan sounds rough and temp keeps climbing.");
            t1.setStatus("Open");
            tickets.save(t1);

            HelpTicket t2 = new HelpTicket();
            t2.setFarmerId(emmanuel.getId());
            t2.setUnitId(f.getId());
            t2.setTopic("Water refill schedule");
            t2.setDetails("Need technician guidance on reservoir refill for Buffer Chamber.");
            t2.setStatus("In Progress");
            tickets.save(t2);

            HelpTicket t3 = new HelpTicket();
            t3.setFarmerId(patrick.getId());
            t3.setUnitId(e.getId());
            t3.setTopic("Offline unit diagnostics");
            t3.setDetails("Kinigi Satellite not reporting. Solar panel looks clean.");
            t3.setStatus("Open");
            tickets.save(t3);
        };
    }

    private static Farmer saveFarmer(
            FarmerRepository repo, String name, String phone, String pin,
            String coop, String district, String village
    ) {
        Farmer f = new Farmer();
        f.setName(name);
        f.setPhone(phone);
        f.setPin(pin);
        f.setCooperative(coop);
        f.setDistrict(district);
        f.setVillage(village);
        return repo.save(f);
    }

    private static CoolingUnit saveUnit(
            CoolingUnitRepository repo,
            String id, Long farmerId, String name, String location, String status,
            boolean online, String crop, int crates, int shelf, double temp, double humidity,
            String ethylene, double ethylenePpm, int battery, boolean solar, int water,
            String history, String humidityHistory
    ) {
        CoolingUnit u = new CoolingUnit();
        u.setId(id);
        u.setFarmerId(farmerId);
        u.setName(name);
        u.setLocation(location);
        u.setStatus(status);
        u.setOnline(online);
        u.setCrop(crop);
        u.setCrates(crates);
        u.setShelfLifeDays(shelf);
        u.setTemperature(temp);
        u.setHumidity(humidity);
        u.setEthylene(ethylene);
        u.setEthylenePpm(ethylenePpm);
        u.setBattery(battery);
        u.setSolar(solar);
        u.setWaterLevel(water);
        u.setLastSync(online ? "Just now" : "3 hr ago");
        u.setTargetTempMin(16);
        u.setTargetTempMax(20);
        u.setHistoryCsv(history);
        u.setHumidityCsv(humidityHistory);
        return repo.save(u);
    }

    private static void saveAlert(
            AlertRepository repo, Long farmerId, CoolingUnit unit,
            String severity, String title, String message, String time, boolean read
    ) {
        Alert a = new Alert();
        a.setFarmerId(farmerId);
        a.setUnitId(unit.getId());
        a.setUnitName(unit.getName());
        a.setSeverity(severity);
        a.setTitle(title);
        a.setMessage(message);
        a.setTimeLabel(time);
        a.setReadFlag(read);
        repo.save(a);
    }
}
