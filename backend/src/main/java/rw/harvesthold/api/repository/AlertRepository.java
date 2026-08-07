package rw.harvesthold.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.harvesthold.api.model.Alert;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    long countByFarmerIdAndReadFlagFalse(Long farmerId);
}
